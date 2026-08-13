from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Furniture
from .serializers import FurnitureSerializer


class FurnitureListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = FurnitureSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Furniture.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )


class FurnitureDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = FurnitureSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Furniture.objects.filter(
            user=self.request.user
        )