from datetime import datetime, timezone
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, UserManager, PermissionsMixin, Group, Permission
from plugins.code_generator import generateUniqueId

# Create your models here.


class AuthUserManager(UserManager):
    def _create_user(self, username, password, email, **extra_fields):
        if not email:
            raise ValueError("You have not provided a vaild email address")

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, password=None, username=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(username, password, **extra_fields)

    def create_superuser(
        self, username=None, email=None, password=None, **extra_fields
    ):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self._create_user(username, password, email, **extra_fields)

CUSTOM_USER_DISPLAY = [
    'id', 
    'email', 
    'username', 
    "is_staff", 
    'is_superuser',
    'is_online',
    'last_online'
    ]

class AuthUser(AbstractBaseUser, PermissionsMixin):

    
    # DEFAULT FIELDS
    id = models.CharField(max_length=15, primary_key=True, default=generateUniqueId)
    email = models.EmailField(("email address"), null=False, blank=False, unique=True)
    password = models.CharField(max_length=200, null=True, blank=True)
    username = models.CharField(max_length=200, unique=True)

    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_online = models.BooleanField(default=False, editable=False)
    
    created = models.DateTimeField(auto_now=True)
    last_online = models.DateTimeField(auto_now=True, editable=False)
    
    # Section for mananging api session login
    token = models.CharField(max_length=600, blank=True, null=True, editable=False)
    key = models.CharField(max_length=150, blank=True, null=True, editable=False)
    
    otp = models.CharField(max_length=6, blank=True, null=True, editable=False)
    is_verified = models.BooleanField(default=False, editable=False)
    
    # Section for django perms
    # groups = models.ManyToManyField(Group, related_name='custom_user_set', blank=True, null=True)
    permissions = models.CharField(max_length=150, blank=True, null=True)

    objects = AuthUserManager()

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["email"]

    class Meta:
        verbose_name = "AuthUser"
        verbose_name_plural = "AuthUsers"

    def __str__(self):
        return self.username
    
    def fullname(self):
        return f"{self.first_name} {self.last_name}"
    
    # API METHODS
    
    def custom_list_display():
        return CUSTOM_USER_DISPLAY
    
    def _set_token(self, token):
        self.token = token
        self.save()
        
    def _clear_token(self):
        self.token = ''
        self.save()
        
    def logout(self):
        self.is_online=False
        self.last_online=datetime.now(timezone.utc)
        self.save()
        
    def login(self):
        self.is_online=True
        self.last_online=datetime.now(timezone.utc)
        self.save()
        
        