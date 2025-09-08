from django.contrib import messages

INSTALLEDAPPS = [
    'corsheaders', 
    'users',
    'tasks',
]



MESSAGE_TAGS = {
    messages.DEBUG: 'alert-info',
    messages.INFO: 'alert-info',
    messages.SUCCESS: 'alert-success',
    messages.WARNING: 'alert-warning',
    messages.ERROR: 'alert-danger',
}
