from ninja import Router
from ninja.security import HttpBearer
import os, json, shutil


router = Router(tags=["OS Endpoints"])


# class SuperAuth(HttpBearer):
#     def authenticate(self, request, token):
#         # user =  User.objects.all().filter(encoded=token,is_token_verified=True)
#         user = CustomUser.objects.all().filter(encoded=token)
#         if user.exists() and user[0].is_superuser == True:
#             foundUser = user.get()
#             return foundUser.encoded


# super_authenticator = SuperAuth() if config("ENVIRONMENT") == "production" else None
super_authenticator=None


@router.delete("/deleteMigrations", auth=super_authenticator)
def delete_migrations(request):
    from taskly.settings import BASE_DIR

    BASE_DIR = os.path.abspath(os.path.join(BASE_DIR, os.pardir))

    dir_list = os.listdir(BASE_DIR)
    dir_list2 = [os.path.join(BASE_DIR, x) for x in dir_list if "." not in x]
    message = "No migration to delete"
    for item in dir_list2:
        if os.path.isdir(item):
            for dir in os.listdir(item):
                if dir == "migrations":
                    try:
                        shutil.rmtree(os.path.join(BASE_DIR, item, dir))
                        message = "Migrations Deleted"
                    except OSError as e:
                        message = f"Error: {e}"
    return message


@router.delete("/deletePyCache", auth=super_authenticator)
def delete_pycache_folders(request):
    from taskly.settings import BASE_DIR

    BASE_DIR = os.path.abspath(os.path.join(BASE_DIR, os.pardir))
    for root, dirs, files in os.walk(BASE_DIR):
        for dir in dirs:
            if dir == "__pycache__":
                folder_path = os.path.join(root, dir)
                shutil.rmtree(folder_path)
    return f"Deleted All Pycache"