from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
# pyrefly: ignore [missing-import]
from .models import CurrencyRate, SavedCurrency
from django.conf import settings
import requests

def currency_list(request):
    if request.method == "POST":
        name = request.POST.get("name")
        buy_rate = request.POST.get("buy_rate")
        sell_rate = request.POST.get("sell_rate")

        if name and buy_rate and sell_rate:
            CurrencyRate.objects.create(
                name=name,
                buy_rate=buy_rate,
                sell_rate=sell_rate
            )
            return redirect("currency_list")

    currencies = CurrencyRate.objects.all().order_by("name")

    rates = None
    try:
        response = requests.get(f"https://v6.exchangerate-api.com/v6/{settings.API_KEY}/latest/UAH?limit=10")
        response.raise_for_status()
        rates = response.json().get("conversion_rates", {})
    except Exception:
        rates = None

    return render(request, "currencies/currency_main.html", {
        "currencies": currencies,
        "rates": rates,
    })

def delete_currency(request, currency_id):
    currency = get_object_or_404(CurrencyRate, id=currency_id)
    currency.delete()
    return redirect("currency_list")

def save_today_rates(request):
    if request.method == "POST":
        today = timezone.now().date()
        currencies = CurrencyRate.objects.all()
        for c in currencies:
            SavedCurrency.objects.create(
                name=c.name,
                buy_rate=c.buy_rate,
                sell_rate=c.sell_rate,
                saved_date=today
            )
    return redirect("saved_currencies")

def savedCurrencies(request):
    saved_currencies = SavedCurrency.objects.all().order_by("-saved_date", "name")
    return render(request, "currencies/saved_currencies.html", {
        "saved_currencies": saved_currencies,
    })

def fetch_external_rates(request):
    url = "https://api.frankfurter.app/latest?from=USD"

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        rates = data.get("rates", {})
        request.session["external_rates"] = rates
    except Exception:
        request.session["external_rates"] = None

    return redirect("currency_list")