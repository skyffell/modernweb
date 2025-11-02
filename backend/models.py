from pydantic import BaseModel, EmailStr
from typing import Optional

class ContactForm(BaseModel):
    name: str
    email: EmailStr
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