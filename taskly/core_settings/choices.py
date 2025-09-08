from django.db import models

class PriorityChoice(models.TextChoices):
    LOW = 'low', 'Low'
    MEDIUM =  'medium', 'Medium'
    HIGH =  'high', 'High'
    

    
class GenderChoice(models.TextChoices):
    MALE = 'male', 'Male'
    FEMALE =  'female', 'Female'