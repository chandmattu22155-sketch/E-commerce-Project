from django.urls import path
from .views import OrderCreateView, UserOrderListView

urlpatterns = [
    path('create/', OrderCreateView.as_view(), name='order-create'),
    path('my-orders/', UserOrderListView.as_view(), name='user-orders'),
]



