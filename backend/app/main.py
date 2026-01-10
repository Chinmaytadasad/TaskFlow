from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, tasks

# Initialize FastAPI app
app = FastAPI(
    title="Task Management API",
    description="A scalable web application with authentication and task management using MongoDB",
    version="1.0.0"
)

# Configure CORS
# Determine allowed origins and credentials behavior
if getattr(settings, "CORS_ORIGINS", None) == "*":
    allow_origins = ["*"]
    allow_credentials = False
else:
    allow_origins = settings.cors_origins_list
    allow_credentials = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=allow_credentials,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(tasks.router)


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "Task Management API with MongoDB",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "database": "MongoDB"}
