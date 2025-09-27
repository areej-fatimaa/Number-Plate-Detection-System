from django.db import models
from datetime import date

class Subscription(models.Model):
    user_id = models.IntegerField()
    plan_name = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    start_date = models.DateField(default=date.today)  # Default to today's date if not provided
    end_date = models.DateField(null=True, blank=True)  # Optional
    payment_intent_id = models.CharField(max_length=255, null=True, blank=True)
