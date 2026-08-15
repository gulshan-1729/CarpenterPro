from django.conf import settings
from django.db import models


class Quotation(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="quotations",
    )

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.PROTECT,
        related_name="quotations",
    )

    invoice_no = models.CharField(
        max_length=30
    )

    phone = models.CharField(
        max_length=20
    )

    address = models.TextField(
        blank=True,
        null=True,
    )

    gst = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
    )

    discount = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
    )

    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    gst_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    discount_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    grand_total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    date = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return self.invoice_no


class QuotationItem(models.Model):
    quotation = models.ForeignKey(
        Quotation,
        on_delete=models.CASCADE,
        related_name="items",
    )

    furniture = models.ForeignKey(
        "furniture.Furniture",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="quotation_items",
    )

    furniture_name = models.CharField(
        max_length=150
    )

    length = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    width = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    area = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    qty = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=1,
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    def __str__(self):
        return self.furniture_name