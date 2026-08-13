from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken


class SignupView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        name = request.data.get("name", "").strip()
        email = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")
        confirm_password = request.data.get(
            "confirmPassword",
            ""
        )

        # -------------------------
        # Validation
        # -------------------------

        if not name:
            return Response(
                {"message": "Name is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not email:
            return Response(
                {"message": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not password:
            return Response(
                {"message": "Password is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(password) < 8:
            return Response(
                {
                    "message":
                    "Password must be at least 8 characters."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if confirm_password and password != confirm_password:
            return Response(
                {"message": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # -------------------------
        # Existing user
        # -------------------------

        if User.objects.filter(
            username=email
        ).exists():

            return Response(
                {
                    "message":
                    "An account with this email already exists."
                },
                status=status.HTTP_409_CONFLICT,
            )

        if User.objects.filter(
            email=email
        ).exists():

            return Response(
                {
                    "message":
                    "An account with this email already exists."
                },
                status=status.HTTP_409_CONFLICT,
            )

        # -------------------------
        # Create user
        # -------------------------

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name,
        )

        # -------------------------
        # Generate JWT
        # -------------------------

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Account created successfully.",

                "user": {
                    "id": user.id,
                    "name": user.first_name,
                    "email": user.email,
                },

                "access": str(
                    refresh.access_token
                ),

                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        email = request.data.get(
            "email",
            ""
        ).strip().lower()

        password = request.data.get(
            "password",
            ""
        )

        if not email or not password:
            return Response(
                {
                    "message":
                    "Email and password are required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(
            request,
            username=email,
            password=password,
        )

        if user is None:

            return Response(
                {
                    "message":
                    "Invalid email or password."
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:

            return Response(
                {
                    "message":
                    "This account has been disabled."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful.",

                "user": {
                    "id": user.id,
                    "name": user.first_name,
                    "email": user.email,
                },

                "access": str(
                    refresh.access_token
                ),

                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )


class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        return Response(
            {
                "id": user.id,
                "name": user.first_name,
                "email": user.email,
            }
        )