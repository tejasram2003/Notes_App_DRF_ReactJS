from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone

# Create your models here.

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    reminder = models.BooleanField(default=False)
    reminder_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title
    
    def clean(self):
        # Call the parent class's clean method
        super().clean()

        # If reminder is set to True, reminder_time should not be null
        if self.reminder and not self.reminder_time:
            raise ValidationError({'reminder_time': 'Reminder time is required when reminder is set to True.'})

        # Optional: You can also enforce that reminder_time cannot be in the past
        if self.reminder and self.reminder_time and self.reminder_time < timezone.now():
            raise ValidationError({'reminder_time': 'Reminder time cannot be in the past.'})
