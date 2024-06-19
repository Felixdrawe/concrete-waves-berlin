from django.contrib import admin
from .models import User
from .models import Profile

# Define an admin class for your User model
class UserAdmin(admin.ModelAdmin):
    # Define fields to be displayed in the admin interface
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_staff']

# Register User model with the admin site
admin.site.register(User, UserAdmin)

# Register Profile model with the admin site
admin.site.register(Profile)