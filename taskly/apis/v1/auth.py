from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from ninja import Router, FormEx
# from ninja.security import django_auth
from typing import List, Union, Any
from django.contrib.auth import logout as contrib_logout
from django.contrib.auth import authenticate, login


from apis.schema.auth import *
from plugins.hasher import hasherGenerator, decrypter
from users.models import *


from ninja.security import HttpBearer

class TokenAuth(HttpBearer):
    def authenticate(self, request, token):
        user = AuthUser.objects.filter(token=token).first()
        if user:
            return user

token_auth = TokenAuth()


router = Router(tags=["Authentication"])


@router.post("/register-via-email/", auth=None)
def register_user_with_email(
    request,
    password: str = FormEx(...),
    passwordConfirm: str = FormEx(...),
    user_data: AuthUserRegistrationSchema = FormEx(...),
):
    if password != passwordConfirm:
        raise ValidationError("Passwords do not match.")

    try:
        user = AuthUser(**user_data.dict())
        user.set_password(password)
        user.save()
        return {"message": f"Registration successful. UserID: {user.id}"}
    except IntegrityError:
        raise ValidationError("Username or email already exists.")


    


@router.get("/{user_id}/get/", response=Union[AuthUserRetrievalSchema, str])
def get_user_by_id(request, user_id):
    user = get_object_or_404(AuthUser, id=user_id)
    return user


@router.get("/getAllUsers/", response=List[AuthUserRetrievalSchema])
def get_all_users(request):
    users = AuthUser.objects.all()
    return users


@router.delete("/deleteUser/{user_id}/")
def delete_user(request, user_id):
    user = AuthUser.objects.get(id=user_id)
    user.delete()
    return f"User {user.username} deleted successfully"


@router.post("/login/")
def login_user(request, data: UserLoginSchema = FormEx(...)):
    email = data.email
    password = data.password

    user = AuthUser.objects.filter(email=email).first()
    if not user:
        return {"message": "Invalid Email"}

    auth_user = authenticate(request, username=user.username, password=password)
    if not auth_user:
        print(auth_user)
        print("Password Issues")
        return {"message": "Invalid Password"}
    # generate your custom token
    hh = hasherGenerator()
    access_token = decrypter(**hh)
    
    user._clear_token()
    user.logout()

    # store token in DB
    user._set_token(access_token)
    user.login()
    

    return {
        "access_token": user.token,
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "message": "User Logged in Successfully",
    }




@router.post("/logout/", auth=token_auth)
def logout(request):
    user: AuthUser = request.auth
    user.logout()
    contrib_logout(request)
    user._clear_token()
    return {"message": "User Logged Out; You can sign in again."}





