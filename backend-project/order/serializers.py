from drf_spectacular.utils import OpenApiExample, extend_schema_serializer
from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    image = serializers.CharField(source='image_url', read_only=True)
    line_total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = (
            'id', 'product', 'variant', 'product_title', 'image',
            'color_name', 'size', 'quantity', 'price', 'line_total',
        )


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    shipping_info = serializers.CharField(read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'full_name', 'email', 'phone_number', 'address_line', 'city',
            'postal_code', 'country', 'shipping_info', 'total_price',
            'status', 'is_paid', 'created_at', 'items',
        )


@extend_schema_serializer(examples=[   
    OpenApiExample(
        'Order Sample',
        value={
            'full_name': 'Ali Khan',
            'email': 'ali@example.com',
            'phone_number': '03001234567',
            'address_line': 'House 12, Street 4, Model Town',
            'city': 'Lahore',
            'postal_code': '54000',
            'country': 'Pakistan',
        },
        request_only=True,
    )
])

class CreateOrderSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255, help_text="Receiver's full name")
    email = serializers.EmailField(help_text="Order confirmation will be sent to this email")
    phone_number = serializers.CharField(max_length=15)
    address_line = serializers.CharField(max_length=500, help_text="House / Street / Area details")
    city = serializers.CharField(max_length=100)
    postal_code = serializers.CharField(max_length=20, required=False, allow_blank=True, default='')
    country = serializers.CharField(max_length=100, default='Pakistan')