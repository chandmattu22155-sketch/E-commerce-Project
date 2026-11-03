from django.contrib.auth import get_user_model
from django.db import models
from product.models import Product, ProductVariant

User = get_user_model()


class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone_number = models.CharField(max_length=15)
    address_line = models.TextField()
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, default='Pakistan')

    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def shipping_info(self):
        parts = [self.full_name, self.phone_number, self.address_line, self.city, self.postal_code, self.country]
        return ', '.join(p for p in parts if p)

    def __str__(self):
        return f"Order #{self.id} - {self.user.email}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True, blank=True)  
    product_title = models.CharField(max_length=255)
    image_url = models.URLField(max_length=500, blank=True)    
    color_name = models.CharField(max_length=50, blank=True)   
    size = models.CharField(max_length=20, blank=True)          
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)   

    @property
    def line_total(self):  
        return self.price * self.quantity

    def __str__(self):
        return f"{self.quantity} x {self.product_title}"