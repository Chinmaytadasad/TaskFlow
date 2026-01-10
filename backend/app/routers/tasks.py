from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from datetime import datetime
from app.database import tasks_collection
from app.models.user import UserModel
from app.models.task import TaskModel, TaskStatus
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.core.dependencies import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.get("", response_model=List[TaskResponse])
async def get_tasks(
    search: Optional[str] = Query(None, description="Search tasks by title"),
    status_filter: Optional[TaskStatus] = Query(None, description="Filter by status"),
    current_user: UserModel = Depends(get_current_user)
):
    """Get all tasks for the current user with optional search and filter."""
    query = {"user_id": str(current_user.id)}
    
    # Apply search filter
    if search:
        query["title"] = {"$regex": search, "$options": "i"}
    
    # Apply status filter
    if status_filter:
        query["status"] = status_filter
    
    tasks_cursor = tasks_collection.find(query).sort("created_at", -1)
    tasks = await tasks_cursor.to_list(length=100)
    
    # Convert ObjectId to string for Pydantic models
    for task in tasks:
        if task.get("_id"):
            task["_id"] = str(task["_id"])
            task["id"] = task["_id"]
    
    return [TaskResponse(**task) for task in tasks]


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    current_user: UserModel = Depends(get_current_user)
):
    """Create a new task."""
    new_task = TaskModel(
        title=task_data.title,
        description=task_data.description,
        status=task_data.status.value if hasattr(task_data.status, 'value') else task_data.status,
        user_id=str(current_user.id)
    )
    
    task_dict = new_task.model_dump(by_alias=True, exclude={"id"})
    result = await tasks_collection.insert_one(task_dict)
    
    created_task = await tasks_collection.find_one({"_id": result.inserted_id})
    # Convert ObjectId to string for Pydantic model
    if created_task:
        created_task["_id"] = str(created_task["_id"])
        created_task["id"] = created_task["_id"]
    return TaskResponse(**created_task)


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    current_user: UserModel = Depends(get_current_user)
):
    """Get a specific task by ID."""
    if not ObjectId.is_valid(task_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID"
        )
    
    task = await tasks_collection.find_one({
        "_id": ObjectId(task_id),
        "user_id": str(current_user.id)
    })
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Convert ObjectId to string for Pydantic model
    task["_id"] = str(task["_id"])
    task["id"] = task["_id"]
    return TaskResponse(**task)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_update: TaskUpdate,
    current_user: UserModel = Depends(get_current_user)
):
    """Update a task."""
    if not ObjectId.is_valid(task_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID"
        )
    
    task = await tasks_collection.find_one({
        "_id": ObjectId(task_id),
        "user_id": str(current_user.id)
    })
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Build update data
    update_data = {}
    if task_update.title is not None:
        update_data["title"] = task_update.title
    if task_update.description is not None:
        update_data["description"] = task_update.description
    if task_update.status is not None:
        update_data["status"] = task_update.status.value if hasattr(task_update.status, 'value') else task_update.status
    
    update_data["updated_at"] = datetime.utcnow()
    
    await tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": update_data}
    )
    
    updated_task = await tasks_collection.find_one({"_id": ObjectId(task_id)})
    # Convert ObjectId to string for Pydantic model
    if updated_task:
        updated_task["_id"] = str(updated_task["_id"])
        updated_task["id"] = updated_task["_id"]
    return TaskResponse(**updated_task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    current_user: UserModel = Depends(get_current_user)
):
    """Delete a task."""
    if not ObjectId.is_valid(task_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID"
        )
    
    task = await tasks_collection.find_one({
        "_id": ObjectId(task_id),
        "user_id": str(current_user.id)
    })
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    await tasks_collection.delete_one({"_id": ObjectId(task_id)})
    
    return None
