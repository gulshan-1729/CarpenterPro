from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CompanyProfile
from .serializers import CompanyProfileSerializer


class CompanyProfileView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    # ==========================================
    # GET COMPANY PROFILE
    # ==========================================

    def get(self, request):

        company, created = (
            CompanyProfile.objects.get_or_create(
                user=request.user
            )
        )

        serializer = CompanyProfileSerializer(
            company
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


    # ==========================================
    # CREATE / UPDATE COMPANY PROFILE
    # ==========================================

    def put(self, request):

        company, created = (
            CompanyProfile.objects.get_or_create(
                user=request.user
            )
        )

        serializer = CompanyProfileSerializer(
            company,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


    # ==========================================
    # PARTIAL UPDATE
    # ==========================================

    def patch(self, request):

        company, created = (
            CompanyProfile.objects.get_or_create(
                user=request.user
            )
        )

        serializer = CompanyProfileSerializer(
            company,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )