from celery import shared_task
from django.core.mail import send_mail

from .models import Order


@shared_task(autoretry_for=(Exception,), retry_backoff=60, retry_kwargs={'max_retries': 3})
def send_order_confirmation_email(order_id):
    order = Order.objects.filter(id=order_id).first()
    if not order:
        return

    lines = '\n'.join(
        f'{i.quantity} x {i.product_title} ({i.color_name} / {i.size}) - {i.line_total}'
        for i in order.items.all()
    )

    send_mail(
        subject=f'Order #{order.id} confirmed',
        message=(
            f'Hi {order.full_name},\n\n'
            f'Thank you for your order #{order.id}.\n\n'
            f'{lines}\n\n'
            f'Total: {order.total_price}\n'
            f'Shipping to: {order.shipping_info}\n\n'
            f'Clothify'
        ),
        from_email=None,
        recipient_list=[order.email],   # CHANGED
        fail_silently=False,
    )