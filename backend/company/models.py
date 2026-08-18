from django.conf import settings
from django.db import models


class CompanyProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="company_profile",
    )

    # ==========================================
    # COMPANY INFORMATION
    # ==========================================

    company_name = models.CharField(
        max_length=200,
        default="Sharma Interiors & Furniture",
    )

    owner_name = models.CharField(
        max_length=150,
        blank=True,
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
    )

    email = models.EmailField(
        blank=True,
    )

    website = models.URLField(
        blank=True,
    )

    gst = models.CharField(
        max_length=30,
        blank=True,
    )

    address = models.TextField(
        blank=True,
    )


    # ==========================================
    # COMPANY LOGO / SIGNATURE
    # ==========================================

    logo = models.TextField(
        blank=True,
    )

    signature = models.TextField(
        blank=True,
    )


    # ==========================================
    # BANK DETAILS
    # ==========================================

    bank_name = models.CharField(
        max_length=150,
        blank=True,
    )

    account_number = models.CharField(
        max_length=50,
        blank=True,
    )

    ifsc = models.CharField(
        max_length=20,
        blank=True,
    )

    upi_id = models.CharField(
        max_length=100,
        blank=True,
    )


    # ==========================================
    # INVOICE SETTINGS
    # ==========================================

    invoice_prefix = models.CharField(
        max_length=20,
        default="CP",
    )

    starting_invoice = models.PositiveIntegerField(
        default=1,
    )


    # ==========================================
    # QUOTATION / INVOICE TEXT
    # ==========================================

    terms = models.TextField(
        blank=True,
    )

    footer = models.TextField(
        blank=True,
        default="Thank you for your business.",
    )


    # ==========================================
    # TIMESTAMPS
    # ==========================================

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )


    class Meta:
        ordering = ["-updated_at"]


    def __str__(self):
        return self.company_name