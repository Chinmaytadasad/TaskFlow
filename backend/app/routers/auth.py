from fastapi import APIRouter, HTTPException, status, Depends
import logging
from datetime import timedelta
from app.database import users_collection
from app.models.user import UserModel
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token, UserUpdate
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.dependencies import get_current_user
from app.core.config import settings
from bson import ObjectId

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

logger = logging.getLogger(__name__)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register a new user."""
    # Check if email already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    existing_username = await users_collection.find_one({"username": user_data.username})
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = UserModel(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password
    )
    
    user_dict = new_user.model_dump(by_alias=True, exclude={"id"})
    result = await users_collection.insert_one(user_dict)
    
    created_user = await users_collection.find_one({"_id": result.inserted_id})
    # Convert ObjectId to string for Pydantic model
    if created_user:
        created_user["_id"] = str(created_user["_id"])
    return UserResponse(**created_user)


@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Login user and return JWT token."""
    logger.info("Login attempt for email: %s", user_credentials.email)

    # Find user by email
    user_data = await users_collection.find_one({"email": user_credentials.email})
    logger.info("User found: %s", bool(user_data))

    # Verify password (log only the result, not the hash)
    verified = False
    if user_data and user_data.get("hashed_password"):
        verified = verify_password(user_credentials.password, user_data["hashed_password"])
    logger.info("Password verified: %s", verified)

    if not user_data or not verified:
        logger.warning("Authentication failed for %s", user_credentials.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user_data.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user_data["_id"])},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: UserModel = Depends(get_current_user)):
    """Get current user profile."""
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        username=current_user.username,
        is_active=current_user.is_active,
        created_at=current_user.created_at
    )


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    current_user: UserModel = Depends(get_current_user)
):
    """Update user profile."""
    update_data = {}
    
    # Check if new username is taken
    if user_update.username and user_update.username != current_user.username:
        existing_username = await users_collection.find_one({"username": user_update.username})
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        update_data["username"] = user_update.username
    
    # Check if new email is taken
    if user_update.email and user_update.email != current_user.email:
        existing_email = await users_collection.find_one({"email": user_update.email})
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        update_data["email"] = user_update.email
    
    if update_data:
        await users_collection.update_one(
            {"_id": current_user.id},
            {"$set": update_data}
        )
    
    updated_user = await users_collection.find_one({"_id": current_user.id})
    # Convert ObjectId to string for Pydantic model
    if updated_user:
        updated_user["_id"] = str(updated_user["_id"])
    return UserResponse(**updated_user)
