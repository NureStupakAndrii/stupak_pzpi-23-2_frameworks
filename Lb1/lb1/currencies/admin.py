from django.contrib import admin
# pyrefly: ignore [missing-import]
from .models import CurrencyRate, SavedCurrency


@admin.register(CurrencyRate)
class CurrencyRateAdmin(admin.ModelAdmin):
    list_display = ('name', 'buy_rate', 'sell_rate')
    search_fields = ('name',)


@admin.register(SavedCurrency)
class SavedCurrencyAdmin(admin.ModelAdmin):
    list_display = ('name', 'buy_rate', 'sell_rate', 'saved_date')
    list_filter = ('saved_date',)
    search_fields = ('name',)
