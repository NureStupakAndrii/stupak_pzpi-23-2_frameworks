from django.urls import path
# pyrefly: ignore [missing-import]
from .views import currency_list, delete_currency, savedCurrencies, save_today_rates, fetch_external_rates

urlpatterns = [
    path("", currency_list, name="currency_list"),
    path("delete/<int:currency_id>/", delete_currency, name="delete_currency"),
    path("saved/", savedCurrencies, name="saved_currencies"),
    path("save-today/", save_today_rates, name="save_today_rates"),
    path("fetch-external/", fetch_external_rates, name="fetch_external_rates"),
]