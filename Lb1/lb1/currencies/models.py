from django.db import models
from django.utils import timezone

# Create your models here.
class CurrencyRate(models.Model):
    name = models.CharField(max_length=50)
    buy_rate = models.DecimalField(max_digits=10, decimal_places=2)
    sell_rate = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return self.name


class SavedCurrency(models.Model):
    name = models.CharField(max_length=50)
    buy_rate = models.DecimalField(max_digits=10, decimal_places=2)
    sell_rate = models.DecimalField(max_digits=10, decimal_places=2)
    saved_date = models.DateField(default=timezone.now)

    class Meta:
        ordering = ['-saved_date', 'name']

    def __str__(self):
        return f"{self.name} ({self.saved_date})"