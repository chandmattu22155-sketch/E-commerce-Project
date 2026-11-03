from decimal import Decimal

from drf_spectacular.utils import OpenApiExample, extend_schema_field, extend_schema_serializer
from rest_framework import serializers

from product.serializers import ProductMiniSerializer
from .models import Cart, CartItem

MONEY = serializers.DecimalField(max_digits=12, decimal_places=2)


class CartItemSerializer(serializers.ModelSerializer):
    variant_id = serializers.IntegerField(read_only=True)
    product = ProductMiniSerializer(source='variant.product', read_only=True)
    color_name = serializers.CharField(source='variant.color_name', read_only=True)   
    color_code = serializers.CharField(source='variant.color_code', read_only=True)   
    size = serializers.CharField(source='variant.size', read_only=True)               
    available_stock = serializers.IntegerField(source='variant.stock', read_only=True)
    unit_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, source='variant.product.final_price', read_only=True
    )
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = (
            'id', 'variant_id', 'product', 'color_name', 'color_code', 'size',
            'quantity', 'available_stock', 'unit_price', 'subtotal',
        )

    @extend_schema_field(MONEY)
    def get_subtotal(self, obj):
        return obj.variant.product.final_price * obj.quantity


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ('id', 'items', 'total_price')

    @extend_schema_field(MONEY)
    def get_total_price(self, obj):
        return sum(
            (i.variant.product.final_price * i.quantity for i in obj.items.all()),
            Decimal('0.00'),
        )


@extend_schema_serializer(examples=[ 
    OpenApiExample(
        'Cart mein add karna',
        value={'variant_id': 1, 'quantity': 2},
        request_only=True,
    )
])
class AddToCartSerializer(serializers.Serializer):
    variant_id = serializers.IntegerField(
        help_text='Product ke "variants" mein se us color + size ki id'
    )
    quantity = serializers.IntegerField(min_value=1, default=1)


@extend_schema_serializer(examples=[
    OpenApiExample('Quantity badalna', value={'quantity': 3}, request_only=True)
])
class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)