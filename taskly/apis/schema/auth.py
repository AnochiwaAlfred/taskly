from ninja import Schema, FileEx, UploadedFile
from typing import List, Optional
from datetime import date, datetime




class AuthUserRegistrationSchema(Schema):
    email:Optional[str]
    username:Optional[str]  


class AuthUserRetrievalSchema(Schema):
    id:str=None
    email:str=None
    username:str=None    
    is_online:bool=None
    last_online:datetime=None
    is_active:bool=None
    is_staff:bool=None
    is_superuser:bool=None
    
    
class UserLoginSchema(Schema):
    email: Optional[str]
    password: Optional[str]
    
    
    
  