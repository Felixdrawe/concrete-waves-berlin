from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(unique=True)


class Profile(models.Model):
    profile = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_name = models.CharField(max_length=100, null=True, blank=True)
    email = models.CharField(max_length=50, null=True, blank=True)
    about = models.TextField(null=True, blank=True)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/%Y/%m/%d/', null=True, blank=True)

    def __str__(self):
        return f"Profile of {self.profile.username}"
