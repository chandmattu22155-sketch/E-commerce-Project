from celery import shared_task
from django.contrib.auth import get_user_model
from django.core.mail import send_mail


@shared_task(autoretry_for=(Exception,), retry_backoff=60, retry_kwargs={'max_retries': 3})
def send_welcome_email(user_id):

    User = get_user_model()
    user = User.objects.filter(id=user_id).first()

    if not user:
        return

    send_mail(
        subject='Welcome to Clothify',
        message=f'Hi {user.first_name}, your account has been created.',
        from_email=None,
        recipient_list=[user.email],
        fail_silently=False,
    )

    
