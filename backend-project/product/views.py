
from decimal import Decimal, InvalidOperation
from django.db.models import Q, F, Case, When, DecimalField, Prefetch

from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny

from .models import Category, Product, ProductImage,ProductVariant
from .serializers import CategorySerializer, ProductSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = (
            Product.objects
            .filter(is_active=True)
            .select_related('category')
            .prefetch_related(
                Prefetch(
                    'images',
                    queryset=ProductImage.objects.order_by('-is_main', 'id'),
                ),
                'variants',
            )
            .annotate(
                effective_price=Case(
                    When(
                        discount_price__lt=F('price'),
                        then=F('discount_price'),
                    ),
                    default=F('price'),
                    output_field=DecimalField(
                        max_digits=10,
                        decimal_places=2,
                    ),
                )
            )
            .order_by('-created_at')
        )

        params = self.request.query_params

        category = params.get('category')
        search = params.get('search')
        min_price = params.get('min_price')
        max_price = params.get('max_price')
        color = params.get('color')
        size = params.get('size')

        if category:
            if not category.isdigit():
                raise ValidationError({
                    'category': 'Enter a valid category ID.'
                })
            qs = qs.filter(category_id=int(category))

        if search:
            search = search.strip()
            qs = qs.filter(
                Q(title__icontains=search)
                | Q(description__icontains=search)
            )

        if min_price:
            try:
                min_value = Decimal(min_price)
                if not min_value.is_finite() or min_value < 0:
                    raise InvalidOperation
            except (InvalidOperation, ValueError):
                raise ValidationError({
                    'min_price': 'Enter a valid non-negative price.'
                })

            qs = qs.filter(effective_price__gte=min_value)

        if max_price:
            try:
                max_value = Decimal(max_price)
                if not max_value.is_finite() or max_value < 0:
                    raise InvalidOperation
            except (InvalidOperation, ValueError):
                raise ValidationError({
                    'max_price': 'Enter a valid non-negative price.'
                })

            qs = qs.filter(effective_price__lte=max_value)

        variant_filter = {'stock__gt': 0}
        if color:
            variant_filter['color_name__iexact'] = color.strip()
        if size:
            variant_filter['size__iexact'] = size.strip()

        if color or size:
            qs = qs.filter(
                id__in=ProductVariant.objects.filter(**variant_filter).values('product_id')
            )

        return qs
