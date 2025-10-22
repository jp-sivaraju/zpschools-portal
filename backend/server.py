from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

# User Models
class UserBase(BaseModel):
    email: EmailStr
    name: str
    phone: Optional[str] = None
    role: str = "student"  # admin, meo, staff, alumni, student, parent, donor, mentor
    school_id: Optional[str] = None
    mandal_id: Optional[str] = None
    batch_year: Optional[int] = None
    approved: bool = False

class UserCreate(UserBase):
    password: str

class User(UserBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

# School Models
class School(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    mandal_id: str
    hm_note: Optional[str] = None
    facilities: List[str] = []
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SchoolCreate(BaseModel):
    name: str
    mandal_id: str
    hm_note: Optional[str] = None
    facilities: List[str] = []
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None

# Mandal Model
class Mandal(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    district: str = "Konaseema"
    meo_count: int = 0

# Alumni Models
class Alumni(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    school_id: str
    batch_year: int
    current_profession: Optional[str] = None
    company: Optional[str] = None
    achievements: List[str] = []
    willing_to_mentor: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Event Model
class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    school_id: Optional[str] = None
    event_date: datetime
    location: Optional[str] = None
    rsvp_count: int = 0
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EventCreate(BaseModel):
    title: str
    description: str
    school_id: Optional[str] = None
    event_date: datetime
    location: Optional[str] = None

# Donation Model
class Donation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    donor_name: str
    donor_email: EmailStr
    amount: float
    school_id: Optional[str] = None
    purpose: Optional[str] = None
    payment_status: str = "pending"  # pending, completed, failed
    transaction_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DonationCreate(BaseModel):
    donor_name: str
    donor_email: EmailStr
    amount: float
    school_id: Optional[str] = None
    purpose: Optional[str] = None

# Forum Post Model
class ForumPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    author_id: str
    school_id: Optional[str] = None
    category: str = "general"
    replies_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ForumPostCreate(BaseModel):
    title: str
    content: str
    school_id: Optional[str] = None
    category: str = "general"

# Bulletin/Notice Model
class Bulletin(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    school_id: Optional[str] = None
    category: str = "announcement"
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BulletinCreate(BaseModel):
    title: str
    content: str
    school_id: Optional[str] = None
    category: str = "announcement"

# News Model
class News(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    school_id: Optional[str] = None
    image_url: Optional[str] = None
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NewsCreate(BaseModel):
    title: str
    content: str
    school_id: Optional[str] = None
    image_url: Optional[str] = None

# Gallery Model
class Gallery(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    school_id: str
    images: List[str] = []
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GalleryCreate(BaseModel):
    title: str
    school_id: str
    images: List[str] = []

# School Need Model
class SchoolNeed(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    school_id: str
    title: str
    description: str
    category: str  # infrastructure, books, equipment, etc.
    target_amount: Optional[float] = None
    raised_amount: float = 0
    status: str = "active"  # active, fulfilled, closed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SchoolNeedCreate(BaseModel):
    school_id: str
    title: str
    description: str
    category: str
    target_amount: Optional[float] = None

# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = timedelta(days=7)):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=User)
async def register(user_create: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_create.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_dict = user_create.model_dump()
    hashed_pwd = hash_password(user_dict.pop("password"))
    user_dict["hashed_password"] = hashed_pwd
    
    user_obj = User(**user_dict)
    doc = user_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.users.insert_one(doc)
    return user_obj

@api_router.post("/auth/login", response_model=Token)
async def login(login_req: LoginRequest):
    user = await db.users.find_one({"email": login_req.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(login_req.password, user.get("hashed_password", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    access_token = create_access_token(data={"sub": user["id"]})
    
    # Remove sensitive data
    user.pop("hashed_password", None)
    if isinstance(user.get('created_at'), str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    
    return {"access_token": access_token, "token_type": "bearer", "user": User(**user)}

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: dict = Depends(get_current_user)):
    current_user.pop("hashed_password", None)
    if isinstance(current_user.get('created_at'), str):
        current_user['created_at'] = datetime.fromisoformat(current_user['created_at'])
    return User(**current_user)

# ==================== SCHOOL ROUTES ====================

@api_router.post("/schools", response_model=School)
async def create_school(school: SchoolCreate, current_user: dict = Depends(get_current_user)):
    school_obj = School(**school.model_dump())
    doc = school_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.schools.insert_one(doc)
    return school_obj

@api_router.get("/schools", response_model=List[School])
async def get_schools(mandal_id: Optional[str] = None, search: Optional[str] = None):
    query = {}
    if mandal_id:
        query["mandal_id"] = mandal_id
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    
    schools = await db.schools.find(query, {"_id": 0}).to_list(1000)
    for school in schools:
        if isinstance(school.get('created_at'), str):
            school['created_at'] = datetime.fromisoformat(school['created_at'])
    return schools

@api_router.get("/schools/{school_id}", response_model=School)
async def get_school(school_id: str):
    school = await db.schools.find_one({"id": school_id}, {"_id": 0})
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    if isinstance(school.get('created_at'), str):
        school['created_at'] = datetime.fromisoformat(school['created_at'])
    return School(**school)

@api_router.put("/schools/{school_id}", response_model=School)
async def update_school(school_id: str, school_update: SchoolCreate, current_user: dict = Depends(get_current_user)):
    existing = await db.schools.find_one({"id": school_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="School not found")
    
    update_data = school_update.model_dump()
    await db.schools.update_one({"id": school_id}, {"$set": update_data})
    
    updated_school = await db.schools.find_one({"id": school_id}, {"_id": 0})
    if isinstance(updated_school.get('created_at'), str):
        updated_school['created_at'] = datetime.fromisoformat(updated_school['created_at'])
    return School(**updated_school)

# ==================== MANDAL ROUTES ====================

@api_router.get("/mandals", response_model=List[Mandal])
async def get_mandals():
    mandals = await db.mandals.find({}, {"_id": 0}).to_list(100)
    return mandals

# ==================== ALUMNI ROUTES ====================

@api_router.post("/alumni")
async def create_alumni_profile(alumni_data: dict, current_user: dict = Depends(get_current_user)):
    alumni_data["user_id"] = current_user["id"]
    alumni_obj = Alumni(**alumni_data)
    doc = alumni_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.alumni.insert_one(doc)
    return alumni_obj

@api_router.get("/alumni")
async def get_alumni(school_id: Optional[str] = None, batch_year: Optional[int] = None):
    query = {}
    if school_id:
        query["school_id"] = school_id
    if batch_year:
        query["batch_year"] = batch_year
    
    alumni = await db.alumni.find(query, {"_id": 0}).to_list(1000)
    return alumni

# ==================== EVENT ROUTES ====================

@api_router.post("/events", response_model=Event)
async def create_event(event: EventCreate, current_user: dict = Depends(get_current_user)):
    event_dict = event.model_dump()
    event_dict["created_by"] = current_user["id"]
    event_obj = Event(**event_dict)
    doc = event_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['event_date'] = doc['event_date'].isoformat()
    await db.events.insert_one(doc)
    return event_obj

@api_router.get("/events", response_model=List[Event])
async def get_events(school_id: Optional[str] = None):
    query = {}
    if school_id:
        query["school_id"] = school_id
    
    events = await db.events.find(query, {"_id": 0}).sort("event_date", -1).to_list(100)
    for event in events:
        if isinstance(event.get('created_at'), str):
            event['created_at'] = datetime.fromisoformat(event['created_at'])
        if isinstance(event.get('event_date'), str):
            event['event_date'] = datetime.fromisoformat(event['event_date'])
    return events

# ==================== DONATION ROUTES ====================

@api_router.post("/donations", response_model=Donation)
async def create_donation(donation: DonationCreate):
    # In real implementation, integrate with Razorpay
    donation_obj = Donation(**donation.model_dump())
    doc = donation_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['payment_status'] = 'completed'  # Mocked as completed
    doc['transaction_id'] = f"TXN{uuid.uuid4().hex[:12].upper()}"
    await db.donations.insert_one(doc)
    return donation_obj

@api_router.get("/donations", response_model=List[Donation])
async def get_donations(school_id: Optional[str] = None):
    query = {}
    if school_id:
        query["school_id"] = school_id
    
    donations = await db.donations.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    for donation in donations:
        if isinstance(donation.get('created_at'), str):
            donation['created_at'] = datetime.fromisoformat(donation['created_at'])
    return donations

# ==================== FORUM ROUTES ====================

@api_router.post("/forums/posts", response_model=ForumPost)
async def create_forum_post(post: ForumPostCreate, current_user: dict = Depends(get_current_user)):
    post_dict = post.model_dump()
    post_dict["author_id"] = current_user["id"]
    post_obj = ForumPost(**post_dict)
    doc = post_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.forum_posts.insert_one(doc)
    return post_obj

@api_router.get("/forums/posts", response_model=List[ForumPost])
async def get_forum_posts(school_id: Optional[str] = None, category: Optional[str] = None):
    query = {}
    if school_id:
        query["school_id"] = school_id
    if category:
        query["category"] = category
    
    posts = await db.forum_posts.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    for post in posts:
        if isinstance(post.get('created_at'), str):
            post['created_at'] = datetime.fromisoformat(post['created_at'])
    return posts

# ==================== BULLETIN ROUTES ====================

@api_router.post("/bulletins", response_model=Bulletin)
async def create_bulletin(bulletin: BulletinCreate, current_user: dict = Depends(get_current_user)):
    bulletin_dict = bulletin.model_dump()
    bulletin_dict["created_by"] = current_user["id"]
    bulletin_obj = Bulletin(**bulletin_dict)
    doc = bulletin_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.bulletins.insert_one(doc)
    return bulletin_obj

@api_router.get("/bulletins", response_model=List[Bulletin])
async def get_bulletins(school_id: Optional[str] = None):
    query = {}
    if school_id:
        query["school_id"] = school_id
    
    bulletins = await db.bulletins.find(query, {"_id": 0}).sort("created_at", -1).to_list(50)
    for bulletin in bulletins:
        if isinstance(bulletin.get('created_at'), str):
            bulletin['created_at'] = datetime.fromisoformat(bulletin['created_at'])
    return bulletins

# ==================== NEWS ROUTES ====================

@api_router.post("/news", response_model=News)
async def create_news(news: NewsCreate, current_user: dict = Depends(get_current_user)):
    news_dict = news.model_dump()
    news_dict["created_by"] = current_user["id"]
    news_obj = News(**news_dict)
    doc = news_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.news.insert_one(doc)
    return news_obj

@api_router.get("/news", response_model=List[News])
async def get_news(school_id: Optional[str] = None):
    query = {}
    if school_id:
        query["school_id"] = school_id
    
    news_list = await db.news.find(query, {"_id": 0}).sort("created_at", -1).to_list(50)
    for news_item in news_list:
        if isinstance(news_item.get('created_at'), str):
            news_item['created_at'] = datetime.fromisoformat(news_item['created_at'])
    return news_list

# ==================== GALLERY ROUTES ====================

@api_router.post("/galleries", response_model=Gallery)
async def create_gallery(gallery: GalleryCreate, current_user: dict = Depends(get_current_user)):
    gallery_dict = gallery.model_dump()
    gallery_dict["created_by"] = current_user["id"]
    gallery_obj = Gallery(**gallery_dict)
    doc = gallery_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.galleries.insert_one(doc)
    return gallery_obj

@api_router.get("/galleries", response_model=List[Gallery])
async def get_galleries(school_id: Optional[str] = None):
    query = {}
    if school_id:
        query["school_id"] = school_id
    
    galleries = await db.galleries.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    for gallery in galleries:
        if isinstance(gallery.get('created_at'), str):
            gallery['created_at'] = datetime.fromisoformat(gallery['created_at'])
    return galleries

# ==================== SCHOOL NEEDS ROUTES ====================

@api_router.post("/school-needs", response_model=SchoolNeed)
async def create_school_need(need: SchoolNeedCreate, current_user: dict = Depends(get_current_user)):
    need_obj = SchoolNeed(**need.model_dump())
    doc = need_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.school_needs.insert_one(doc)
    return need_obj

@api_router.get("/school-needs", response_model=List[SchoolNeed])
async def get_school_needs(school_id: Optional[str] = None, status: Optional[str] = None):
    query = {}
    if school_id:
        query["school_id"] = school_id
    if status:
        query["status"] = status
    
    needs = await db.school_needs.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    for need in needs:
        if isinstance(need.get('created_at'), str):
            need['created_at'] = datetime.fromisoformat(need['created_at'])
    return needs

# ==================== ADMIN ROUTES ====================

@api_router.get("/admin/stats")
async def get_admin_stats(current_user: dict = Depends(get_current_user)):
    # Only admins can access
    if current_user.get("role") not in ["admin", "meo"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    total_schools = await db.schools.count_documents({})
    total_users = await db.users.count_documents({})
    total_alumni = await db.alumni.count_documents({})
    total_donations = await db.donations.count_documents({})
    
    # Calculate total donation amount
    donations = await db.donations.find({"payment_status": "completed"}, {"_id": 0}).to_list(10000)
    total_amount = sum(d.get("amount", 0) for d in donations)
    
    return {
        "total_schools": total_schools,
        "total_users": total_users,
        "total_alumni": total_alumni,
        "total_donations": total_donations,
        "total_donation_amount": total_amount,
        "pending_approvals": await db.users.count_documents({"approved": False, "role": "alumni"})
    }

@api_router.get("/admin/users")
async def get_all_users(current_user: dict = Depends(get_current_user), role: Optional[str] = None):
    if current_user.get("role") not in ["admin", "meo"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    query = {}
    if role:
        query["role"] = role
    
    users = await db.users.find(query, {"_id": 0, "hashed_password": 0}).to_list(1000)
    return users

@api_router.put("/admin/users/{user_id}/approve")
async def approve_user(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["admin", "meo"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.users.update_one({"id": user_id}, {"$set": {"approved": True}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User approved successfully"}

# ==================== PLACEHOLDER ROUTES ====================

@api_router.get("/chat/conversations")
async def get_conversations(current_user: dict = Depends(get_current_user)):
    # Placeholder for chat functionality
    return {"message": "Chat feature - Coming soon", "conversations": []}

@api_router.get("/mentors")
async def get_mentors(school_id: Optional[str] = None):
    # Placeholder for mentoring system
    return {"message": "Mentoring feature - Coming soon", "mentors": []}

@api_router.get("/notifications")
async def get_notifications(current_user: dict = Depends(get_current_user)):
    # Placeholder for notifications
    return {"message": "Notification system - Coming soon", "notifications": []}

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
