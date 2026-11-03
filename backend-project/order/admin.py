from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False
    fields = ('product_title', 'color_name', 'size', 'quantity', 'price')
    readonly_fields = ('product_title', 'color_name', 'size', 'quantity', 'price')

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'full_name', 'phone_number', 'total_price', 'status', 'is_paid', 'created_at']
    list_editable = ['status', 'is_paid']
    list_filter = ['status', 'is_paid']
    search_fields = ['full_name', 'email', 'phone_number']
    readonly_fields = [
        'user', 'full_name', 'email', 'phone_number', 'address_line',
        'city', 'postal_code', 'country', 'total_price',
    ]
    inlines = [OrderItemInline]