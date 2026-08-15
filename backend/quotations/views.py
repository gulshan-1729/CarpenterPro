from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Quotation
from .serializers import QuotationSerializer


class QuotationListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = QuotationSerializer
    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):
        return Quotation.objects.filter(
            user=self.request.user
        ).prefetch_related(
            "items"
        )

    def perform_create(self, serializer):
        serializer.save()


class QuotationDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = QuotationSerializer
    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):
        return Quotation.objects.filter(
            user=self.request.user
        ).prefetch_related(
            "items"
        )