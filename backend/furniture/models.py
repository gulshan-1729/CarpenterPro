from django.conf import settings
from django.db import models


class Furniture(models.Model):
    CATEGORY_CHOICES = [
        ("bedroom", "Bedroom"),
        ("living_room", "Living Room"),
        ("kitchen", "Kitchen"),
        ("office", "Office"),
        ("storage", "Storage"),
        ("other", "Other"),
    ]

    UNIT_CHOICES = [
        ("sqft", "Square Feet"),
        ("sqft", "Square Feet"),
        ("piece", "Piece"),
        ("running_ft", "Running Feet"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="furniture_items",
    )

    name = models.CharField(
        max_length=150
    )

    category = models.CharField(
        max_length=30,
        choices=CATEGORY_CHOICES,
        default="other",
    )

    rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    unit = models.CharField(
        max_length=20,
        choices=UNIT_CHOICES,
        default="sqft",
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name