# from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from ninja import Router, FormEx
# from ninja.security import django_auth
from typing import List, Union, Any
import uuid
# from django.contrib import messages as django_message
from django.http import JsonResponse


from apis.schema.tasks import *
from tasks.models import *
from users.models import AuthUser
from core_settings.error_messages import ErrorMessages
from ninja.security import HttpBearer


router = Router(tags=["Task Endpoints"])

class TokenAuth(HttpBearer):
    def authenticate(self, request, token):
        user = AuthUser.objects.filter(token=token).first()
        if user:
            return user

token_auth = TokenAuth()


@router.post("/{user_id}/create_task/", response=Union[TaskRetrievalSchema, dict], auth=token_auth)
def create_task(request, user_id: str, data: TaskRegistrationSchema):
    user = get_object_or_404(AuthUser, id=user_id)

    if not data.title.strip():
        return JsonResponse({"error": "Title is required"}, status=400)
    if data.priority not in PriorityChoice.values:
        return JsonResponse({"error": f"Priority must be one of {PriorityChoice.values}"}, status=400)
    if not user:
        return JsonResponse({"error": f"User not found"}, status=400)
    try:
        task = Task.objects.create(
            title=data.title.strip(),
            description=data.description.strip() or "No description provided",
            priority=data.priority,
            user=user
        )
        return task
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@router.get("get_all_tasks/", response=List[TaskRetrievalSchema])
def get_all_tasks(request):
    tasks = Task.objects.all()
    return tasks


@router.get("/{task_id}/get/", response=Union[TaskRetrievalSchema, str])
def get_task_by_id(request, task_id:uuid.UUID):
    task = get_object_or_404(Task, id=task_id)
    return task


from ninja.responses import Response

@router.delete("/{task_id}/delete/", auth=token_auth)
def delete_task(request, task_id: uuid.UUID):
    task = get_object_or_404(Task, id=task_id)
    if task:
        task.delete()
        return {"message": "Task deleted successfully"}
    return {"message": "Task not found"}



@router.put("/{task_id}/update_task/", response=Union[TaskRetrievalSchema, str])
def update_task(request, task_id:uuid.UUID, data:TaskUpdateSchema):
    task = get_object_or_404(Task, id=task_id)
    title = str(data.dict().get("title"))
    description = str(data.dict().get("description"))
    
    if task:
        try:
            task.title = title if title!="" else task.title
            task.description = description if description!="" else task.description
            task.save()
            return task
        except Exception as e:
            err = str(e)
            return f"Error: {err}"
    else:
        return task
    
@router.put("/{task_id}/update_task_status/", response=Union[TaskRetrievalSchema, str], auth=token_auth)
def update_task_status(request, task_id:uuid.UUID):
    task = get_object_or_404(Task, id=task_id)
    
    if task:
        try:
            task.is_completed = not task.is_completed
            task.save()
            return task
        except Exception as e:
            err = str(e)
            return f"Error: {err}"
    else:
        return task
    
@router.put("/{task_id}/update_task_priority/", response=Union[TaskRetrievalSchema, str], auth=token_auth)
def update_task_priority(request, task_id: uuid.UUID, data: PriorityUpdateSchema):
    task = get_object_or_404(Task, id=task_id)
    if task:
        try:
            task.priority = data.priority or task.priority
            task.save()
            return task
        except Exception as e:
            return f"Error: {str(e)}"
    return task
    
    
@router.get("/{user_id}/get_user_tasks/", response=List[TaskRetrievalSchema])
def get_user_task(request, user_id):
    user = get_object_or_404(AuthUser, id=user_id)
    if not user:
        return user
    else:
        tasks = Task.objects.all().filter(user_id=user_id)
        return tasks
        