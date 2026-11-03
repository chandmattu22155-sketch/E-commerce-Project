from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from product.models import ProductVariant
from .models import Cart, CartItem
from .serializers import AddToCartSerializer, CartSerializer, UpdateCartItemSerializer


def load_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return Cart.objects.prefetch_related(
        Prefetch(
            'items',
            queryset=CartItem.objects
            .select_related('variant__product')
            .prefetch_related('variant__product__images')
            .order_by('id'),
        )
    ).get(pk=cart.pk)


def cart_response(request):
    return CartSerializer(load_cart(request.user), context={'request': request}).data


class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return load_cart(self.request.user)


class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(request=AddToCartSerializer, responses={201: CartSerializer})
    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        variant = get_object_or_404(   
            ProductVariant.objects.select_related('product'),
            id=serializer.validated_data['variant_id'],
            product__is_active=True,
        )
        quantity = serializer.validated_data['quantity']

        cart, _ = Cart.objects.get_or_create(user=request.user)
        item = CartItem.objects.filter(cart=cart, variant=variant).first()
        new_quantity = (item.quantity if item else 0) + quantity

        if new_quantity > variant.stock:  
            return Response(
                {'error': f'Only {variant.stock} items in stock.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if item:
            item.quantity = new_quantity
            item.save(update_fields=['quantity'])
        else:
            CartItem.objects.create(cart=cart, variant=variant, quantity=new_quantity)

        return Response(cart_response(request), status=status.HTTP_201_CREATED)


class CartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(request=UpdateCartItemSerializer, responses=CartSerializer)
    def patch(self, request, pk):
        item = get_object_or_404(
            CartItem.objects.select_related('variant'), id=pk, cart__user=request.user
        )
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quantity = serializer.validated_data['quantity']

        if quantity > item.variant.stock:
            return Response(
                {'error': f'Only {item.variant.stock} items in stock.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        item.quantity = quantity
        item.save(update_fields=['quantity'])
        return Response(cart_response(request))

    @extend_schema(responses={204: None})
    def delete(self, request, pk):
        item = get_object_or_404(CartItem, id=pk, cart__user=request.user)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)