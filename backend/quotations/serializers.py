from django.db import transaction
from rest_framework import serializers

from .models import Quotation, QuotationItem


class QuotationItemSerializer(serializers.ModelSerializer):
    furniture_id = serializers.IntegerField(
        source="furniture.id",
        read_only=True,
    )

    class Meta:
        model = QuotationItem

        fields = [
            "id",
            "furniture_id",
            "furniture_name",
            "length",
            "width",
            "area",
            "rate",
            "qty",
            "amount",
        ]

        read_only_fields = [
            "id",
            "furniture_id",
        ]


class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(
        many=True
    )

    class Meta:
        model = Quotation

        fields = [
            "id",
            "invoice_no",
            "customer",
            "phone",
            "address",
            "gst",
            "discount",
            "subtotal",
            "gst_amount",
            "discount_amount",
            "grand_total",
            "date",
            "updated_at",
            "items",
        ]

        read_only_fields = [
            "id",
            "date",
            "updated_at",
        ]

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop(
            "items",
            []
        )

        quotation = Quotation.objects.create(
            user=self.context[
                "request"
            ].user,
            **validated_data
        )

        for item_data in items_data:
            QuotationItem.objects.create(
                quotation=quotation,
                **item_data
            )

        return quotation

    @transaction.atomic
    def update(
        self,
        instance,
        validated_data
    ):
        items_data = validated_data.pop(
            "items",
            None
        )

        for field, value in validated_data.items():
            setattr(
                instance,
                field,
                value
            )

        instance.save()

        if items_data is not None:
            instance.items.all().delete()

            for item_data in items_data:
                QuotationItem.objects.create(
                    quotation=instance,
                    **item_data
                )

        return instance