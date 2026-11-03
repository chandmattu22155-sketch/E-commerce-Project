from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariant


def get_main_image(product):  
    images = list(product.images.all())
    main = next((img for img in images if img.is_main), None) or (images[0] if images else None)
    return main.image if main else None


class CategorySerializer(serializers.ModelSerializer):
    image = serializers.CharField(source='image_url', read_only=True)

    class Meta:
        model = Category
        fields = ('id', 'name', 'image')


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'is_main')


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ('id', 'color_name', 'color_code', 'size', 'stock')


class ProductMiniSerializer(serializers.ModelSerializer):  
    image = serializers.SerializerMethodField()
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Product
        fields = ('id', 'title', 'image', 'price', 'final_price')

    def get_image(self, obj) -> str | None:
        return get_main_image(obj)


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    image = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True) 
    stock = serializers.IntegerField(source='total_stock', read_only=True)                   

    class Meta:
        model = Product
        fields = (
            'id', 'title', 'description', 'price', 'discount_price',
            'discount_percentage', 'final_price', 'average_rating',
            'reviews_count', 'stock', 'image', 'images', 'category',
            'category_name', 'variants',
        )

    def get_image(self, obj) -> str | None:
        return get_main_image(obj)