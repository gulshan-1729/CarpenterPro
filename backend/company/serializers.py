from rest_framework import serializers

from .models import CompanyProfile


class CompanyProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = CompanyProfile

        fields = [
            "id",

            "company_name",
            "owner_name",
            "phone",
            "email",
            "website",
            "gst",
            "address",

            "logo",
            "signature",

            "bank_name",
            "account_number",
            "ifsc",
            "upi_id",

            "invoice_prefix",
            "starting_invoice",

            "terms",
            "footer",

            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]