
from django.contrib import admin
from users.models import *
from django.contrib.auth.admin import UserAdmin

# Register your models here.


@admin.register(AuthUser)
class AuthUserAdmin(UserAdmin):
    search_fields = ["email__startswith", "username__startswith"]
    list_display = [
        "id",
        "username",
        "email",
        "is_staff",
        "is_superuser",
    ]
    list_filter = ["is_staff", "is_superuser"]
    list_display_links = ["username", "email"]
    ordering = ["id"]
    filter_horizontal = []
    fieldsets = [
        (None, {"fields": ["username", "email", "password"]}),
        ("Permissions", {"fields": ["is_staff", "is_superuser"]}),
    ]