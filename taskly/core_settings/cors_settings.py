CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOWED_ORIGIN_REGEXES = [
    # match localhost with any port
    r"^http:\/\/localhost:*([0-9]+)?$",
    r"^https:\/\/localhost:*([0-9]+)?$",


]
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",  # Add the address of your frontend server
    "http://127.0.0.1:3000",  # Add additional addresses as needed
    "http://localhost:5500",  # Add the address of your frontend server
    "http://127.0.0.1:5500",  # Add additional addresses as needed
    "http://localhost:8000",  # Add the address of your frontend server
    "http://127.0.0.1:8000",  # Add additional addresses as needed
    "http://localhost:8001",  # Add the address of your frontend server
    "http://127.0.0.1:8001",  # Add additional addresses as needed
    "http://0.0.0.0:8080",
]
CORS_ALLOW_METHODS = (
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
)

CORS_ALLOW_HEADERS = (
    "accept",
    "authorization",
    "content-type",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
)

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Add the address of your frontend server
    "http://127.0.0.1:3000",  # Add additional addresses as needed
    "http://localhost:5500",  # Add the address of your frontend server
    "http://127.0.0.1:5500",  # Add additional addresses as needed
    "http://localhost:8000",  # Add the address of your frontend server
    "http://127.0.0.1:8000",  # Add additional addresses as needed
    "http://localhost:8001",  # Add the address of your frontend server
    "http://127.0.0.1:8001",  # Add additional addresses as needed
    "http://0.0.0.0:8080",
]