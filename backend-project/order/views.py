from decimal import Decimal

from django.db import transaction
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.models import Cart
from product.models import ProductVariant
from .models import Order, OrderItem
from .serializers import CreateOrderSerializer, OrderSerializer
from .tasks import send_order_confirmation_email


class OrderError(Exception):
    pass


class OrderCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(request=CreateOrderSerializer, responses={201: OrderSerializer})
    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            with transaction.atomic(): 
                cart = Cart.objects.select_for_update().filter(user=request.user).first()
                cart_items = list(cart.items.order_by('variant_id')) if cart else []
                if not cart_items:
                    raise OrderError('Your cart is empty!')

                variants = {
                    v.id: v
                    for v in ProductVariant.objects
                    .select_for_update(of=('self',))
                    .select_related('product')
                    .filter(id__in=[i.variant_id for i in cart_items])
                    .order_by('id')
                }

                total = Decimal('0.00')
                lines = []
                for item in cart_items:
                    variant = variants.get(item.variant_id)
                    if variant is None or not variant.product.is_active:
                        raise OrderError('An item in your cart is no longer available.')
                    if item.quantity > variant.stock:
                        raise OrderError(
                            f'"{variant.product.title}" ({variant.color_name} / {variant.size}): '
                            f'only {variant.stock} left.'
                        )
                    price = variant.product.final_price
                    lines.append((variant, item.quantity, price))
                    total += price * item.quantity

                order = Order.objects.create(
                    user=request.user,
                    full_name=data['full_name'],
                    email=data['email'],
                    phone_number=data['phone_number'],
                    address_line=data['address_line'],
                    city=data['city'],
                    postal_code=data['postal_code'],
                    country=data['country'],
                    total_price=total,
                )

                for variant, quantity, price in lines:
                    product = variant.product
                    image = product.images.order_by('-is_main', 'id').first()
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        variant=variant,
                        product_title=product.title,
                        image_url=image.image if image else '',
                        color_name=variant.color_name,
                        size=variant.size,
                        quantity=quantity,
                        price=price,
                    )
                    variant.stock -= quantity
                    variant.save(update_fields=['stock'])

                cart.items.all().delete()
        except OrderError as exc:
            return Response({'error': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            send_order_confirmation_email.delay(order.id)
        except Exception:
            pass

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class UserOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Order.objects.none()
        return (
            Order.objects.filter(user=self.request.user)
            .prefetch_related('items')
            .order_by('-created_at')
        )