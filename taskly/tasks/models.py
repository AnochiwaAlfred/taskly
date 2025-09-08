from django.db import models
from core_settings.core import CoreBaseModel
from core_settings.choices import PriorityChoice

# Create your models here.


class Task(CoreBaseModel):
    title = models.CharField(max_length=500, blank=True, default="Unknown Title")
    description = models.CharField(max_length=1000, blank=True, default="Do Something")
    priority = models.CharField(max_length=500, null=True, blank=True, choices=PriorityChoice)
    is_completed = models.BooleanField(default=False)
    user = models.ForeignKey("users.AuthUser", null=True, blank=True, on_delete=models.CASCADE)
    modified =  models.DateTimeField(auto_now=True)
    
    
    def __str__(self):
        return f"{self.title}_{self.timestamp.date()}"