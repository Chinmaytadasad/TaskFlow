# TaskFlow – Scalable Task Management Web Application  
## Frontend Developer Intern Assignment

TaskFlow is a modern, secure, and scalable web application built as part of the **Frontend Developer Intern assignment**. This project demonstrates real-world frontend engineering practices along with a production-style backend, including authentication, protected routes, CRUD operations, clean architecture, security best practices, and scalability considerations.

The application is built using **React + Vite + Tailwind CSS** on the frontend and **FastAPI + JWT + MongoDB/SQLite** on the backend.

---

## 🚀 Core Features

### 🔐 Authentication & Security
- User registration with client and server-side validation  
- Secure login using JWT  
- Password hashing using bcrypt  
- Protected routes (dashboard accessible only after login)  
- Token persistence and auto-login on refresh  
- JWT middleware for API protection  
- CORS configuration  
- Environment-based secret management  
- Axios interceptors for automatic token injection  
- Centralized error handling  

### 📊 Dashboard & Task Management
- Create, Read, Update, Delete (CRUD) tasks  
- Task status workflow: **To Do, In Progress, Completed**  
- Search tasks by title  
- Filter tasks by status  
- Task statistics cards  
- Responsive UI (mobile, tablet, desktop)  
- Loading states and graceful error handling  

### 🎨 UI / UX
- Modern dark theme  
- Glass-morphism design  
- Smooth animations  
- Accessible forms with validation feedback  
- Reusable component-based structure  

---

## 🛠 Tech Stack

### Frontend
- React 18  
- Vite  
- React Router  
- Tailwind CSS  
- Axios  
- Context API  

### Backend
- FastAPI  
- JWT Authentication  
- SQLAlchemy / Motor (MongoDB)  
- Pydantic  
- Bcrypt  
- Python Virtual Environment (venv)  

---

## 🧩 Project Architecture

### Frontend Structure
```
frontend/
 ├── components/   # Navbar, Cards, Forms, ProtectedRoute
 ├── pages/        # Login, Register, Dashboard
 ├── context/      # Authentication Context
 ├── services/     # API Layer (Axios, Auth, Tasks)
 ├── App.jsx       # Routing & Protected Routes
 └── main.jsx      # Entry Point
```

### Backend Structure
```
backend/
 ├── app/
 │   ├── routers/      # Auth & Task APIs
 │   ├── models/       # Database Models
 │   ├── schemas/      # Pydantic Schemas
 │   ├── core/         # JWT, Security, Config
 │   ├── database.py  # DB Connection
 │   └── main.py      # FastAPI App
 ├── start.bat        # Windows startup
 ├── start.sh         # Linux/Mac startup
 ├── requirements.txt
 └── .env.example
```

---

## ▶ How to Run Locally

### Backend
```bash
cd backend
start.bat
```

This will:
- Create virtual environment if missing  
- Install dependencies  
- Load environment variables  
- Start FastAPI server at `http://localhost:8000`  
- API Docs: `http://localhost:8000/docs`

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔗 API Endpoints

### Authentication
- POST `/api/auth/register`  
- POST `/api/auth/login`  
- GET `/api/auth/me`  
- PUT `/api/auth/profile`  

### Tasks
- GET `/api/tasks` (search & filter supported)  
- POST `/api/tasks`  
- PUT `/api/tasks/{id}`  
- DELETE `/api/tasks/{id}`  

All task endpoints are protected using JWT middleware.

---

## 🔒 Security Practices
- Password hashing using bcrypt  
- JWT token validation  
- Token expiration handling  
- Environment variable based secrets  
- CORS whitelisting  
- Protected frontend routes  
- Centralized API error handling  

---

## 📈 Scalability & Production Readiness

### Backend
- Stateless JWT authentication (horizontal scaling ready)  
- Modular FastAPI architecture  
- Database abstraction (SQLite → PostgreSQL / MongoDB)  
- Docker-ready  
- Redis caching ready  
- Nginx reverse proxy compatible  
- CI/CD friendly  

### Frontend
- Component-driven architecture  
- Service layer abstraction  
- Context-based global state  
- Ready for React Query / SWR  
- Lazy loading supported  
- Clean separation of concerns  

---

## 📦 Deliverables
- Full React + FastAPI source code  
- JWT-based authentication  
- CRUD dashboard with search & filter  
- Protected routes  
- `.env.example`  
- `start.bat` & `start.sh`  
- Postman API collection  
- Scalability documentation  

---

## 👨‍💻 Author

**Chinmay Tadasad** 
