from django import forms
# pyrefly: ignore [missing-import]
from .models import CurrencyRate

class CurrencyRateForm(forms.ModelForm):
    class Meta:
        model = CurrencyRate
        fields = ['name', 'buy_rate', 'sell_rate']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Currency Name'}),
            'buy_rate': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Buy Rate', 'step': '0.01'}),
            'sell_rate': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Sell Rate', 'step': '0.01'}),
        }
