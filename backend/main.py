from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import os
import json

app = FastAPI(
    title="Modern Business Website",
    description="Красивый адаптивный сайт с анимациями",
    version="1.0.0"
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Монтируем статические файлы
app.mount("/static", StaticFiles(directory="../frontend"), name="static")
app.mount("/css", StaticFiles(directory="../frontend/css"), name="css")
app.mount("/js", StaticFiles(directory="../frontend/js"), name="js")

# Модели данных
class ContactForm(BaseModel):
    name: str
    email: str
    message: str
    phone: Optional[str] = None

class Service(BaseModel):
    id: int
    title: str
    description: str
    icon: str

class BlogPost(BaseModel):
    id: int
    title: str
    excerpt: str
    content: str
    image_url: str
    created_at: str

# Мокапы данных
services_data = [
    {
        "id": 1,
        "title": "Веб-разработка",
        "description": "Создание современных веб-приложений с использованием передовых технологий",
        "icon": "💻"
    },
    {
        "id": 2,
        "title": "Мобильные приложения",
        "description": "Разработка кроссплатформенных мобильных приложений",
        "icon": "📱"
    },
    {
        "id": 3,
        "title": "UI/UX Дизайн",
        "description": "Создание интуитивно понятных и красивых интерфейсов",
        "icon": "🎨"
    },
    {
        "id": 4,
        "title": "SEO Оптимизация",
        "description": "Повышение видимости вашего сайта в поисковых системах",
        "icon": "🔍"
    }
]

blog_posts = [
    {
        "id": 1,
        "title": "Будущее веб-разработки в 2024",
        "excerpt": "Изучаем тренды и технологии, которые определят развитие веба в ближайшие годы",
        "content": "Полный текст статьи о будущем веб-разработки...",
        "image_url": "/static/images/blog1.jpg",
        "created_at": "2024-01-15"
    },
    {
        "id": 2,
        "title": "Искусственный интеллект в дизайне",
        "excerpt": "Как AI меняет подход к созданию пользовательских интерфейсов",
        "content": "Полный текст статьи об AI в дизайне...",
        "image_url": "/static/images/blog2.jpg",
        "created_at": "2024-01-10"
    }
]

# Роуты для API
@app.get("/")
async def read_root():
    return FileResponse('../frontend/index.html')

@app.get("/about.html")
async def about_page():
    return FileResponse('../frontend/about.html')

@app.get("/services.html")
async def services_page():
    return FileResponse('../frontend/services.html')

@app.get("/contact.html")
async def contact_page():
    return FileResponse('../frontend/contact.html')

@app.get("/api/services")
async def get_services() -> List[Service]:
    return services_data

@app.get("/api/blog")
async def get_blog_posts() -> List[BlogPost]:
    return blog_posts

@app.get("/api/blog/{post_id}")
async def get_blog_post(post_id: int) -> BlogPost:
    post = next((p for p in blog_posts if p["id"] == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@app.post("/api/contact")
async def submit_contact_form(form: ContactForm):
    # Здесь обычно сохраняем в базу данных
    print(f"Новое сообщение от: {form.name} ({form.email})")
    print(f"Сообщение: {form.message}")
    
    return {
        "status": "success",
        "message": "Сообщение успешно отправлено!",
        "data": {
            "name": form.name,
            "email": form.email,
            "phone": form.phone,
            "message": form.message
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Server is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)