from django.urls import path

from .views import (
    FurnitureListCreateView,
    FurnitureDetailView,
)


urlpatterns = [
    path(
        "",
        FurnitureListCreateView.as_view(),
        name="furniture-list-create",
    ),

    path(
        "<int:pk>/",
        FurnitureDetailView.as_view(),
        name="furniture-detail",
    ),
]