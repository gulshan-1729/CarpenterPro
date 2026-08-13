from rest_framework import serializers

from .models import Furniture


class FurnitureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Furniture

        fields = [
            "id",
            "name",
            "category",
            "rate",
            "unit",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]