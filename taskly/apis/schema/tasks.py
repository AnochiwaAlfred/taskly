
from ninja import NinjaAPI, Schema
from uuid import UUID
from .auth import AuthUserRetrievalSchema
from datetime import datetime
from typing import Optional 


class TaskRegistrationSchema(Schema):
    title:str = None
    description:str = None
    priority:str = None
    
class TaskUpdateSchema(Schema):
    title:str = None
    description:str = None
    priority:str = None
    is_completed:Optional[bool] = None
    
class TaskRetrievalSchema(Schema):
    id:UUID = None
    title:str = None
    description:str = None
    priority:str = None
    is_completed:bool = None
    timestamp:datetime = None
    modified:datetime = None
    user: AuthUserRetrievalSchema = None
    
class PriorityUpdateSchema(Schema):
    priority: str

    # 3fa85f64-5717-4562-b3fc-2c963f66afa6