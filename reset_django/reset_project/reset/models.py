from django.db import models
from django.contrib.auth.models import AbstractUser


class UserModel(AbstractUser):
    email = models.EmailField(
        blank=False, default="", max_length=254, verbose_name="email address"
    )

    USERNAME_FIELD = "username"  # e.g: "username", "email"
    EMAIL_FIELD = "email"  # e.g: "email", "primary_email"
