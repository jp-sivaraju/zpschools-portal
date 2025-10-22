import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']

# Sample schools data for Konaseema District
SAMPLE_SCHOOLS = [
    {
        "id": "school-001",
        "name": "ZPHS Amalapuram",
        "mandal_id": "mandal-amalapuram",
        "hm_note": "Welcome to ZPHS Amalapuram! We strive for excellence in education and holistic development of our students.",
        "facilities": ["Library", "Computer Lab", "Science Lab", "Playground", "Sports Equipment"],
        "contact_email": "zphs.amalapuram@ap.gov.in",
        "contact_phone": "08856-222333",
        "address": "Main Road, Amalapuram, Konaseema District"
    },
    {
        "id": "school-002",
        "name": "ZPHS Razole",
        "mandal_id": "mandal-razole",
        "hm_note": "ZPHS Razole is committed to providing quality education to rural students.",
        "facilities": ["Library", "Smart Classroom", "Sports Ground", "Laboratory"],
        "contact_email": "zphs.razole@ap.gov.in",
        "contact_phone": "08852-245678",
        "address": "Gandhi Road, Razole, Konaseema District"
    },
    {
        "id": "school-003",
        "name": "ZPHS Mummidivaram",
        "mandal_id": "mandal-mummidivaram",
        "hm_note": "Empowering students through education and innovation.",
        "facilities": ["Computer Lab", "Library", "Playground", "Drinking Water"],
        "contact_email": "zphs.mummidivaram@ap.gov.in",
        "contact_phone": "08853-234567",
        "address": "School Street, Mummidivaram, Konaseema District"
    },
    {
        "id": "school-004",
        "name": "ZPHS Ravulapalem",
        "mandal_id": "mandal-ravulapalem",
        "hm_note": "Building futures through quality education.",
        "facilities": ["Science Lab", "Library", "Sports Equipment", "Clean Toilets"],
        "contact_email": "zphs.ravulapalem@ap.gov.in",
        "contact_phone": "08854-223344",
        "address": "Market Road, Ravulapalem, Konaseema District"
    },
    {
        "id": "school-005",
        "name": "ZPHS Sakhinetipalli",
        "mandal_id": "mandal-sakhinetipalli",
        "hm_note": "Dedicated to excellence in education and character building.",
        "facilities": ["Library", "Computer Lab", "Playground", "Mid-day Meal"],
        "contact_email": "zphs.sakhinetipalli@ap.gov.in",
        "contact_phone": "08855-234567",
        "address": "NH-16, Sakhinetipalli, Konaseema District"
    }
]

SAMPLE_MANDALS = [
    {"id": "mandal-amalapuram", "name": "Amalapuram", "district": "Konaseema", "meo_count": 2},
    {"id": "mandal-razole", "name": "Razole", "district": "Konaseema", "meo_count": 2},
    {"id": "mandal-mummidivaram", "name": "Mummidivaram", "district": "Konaseema", "meo_count": 2},
    {"id": "mandal-ravulapalem", "name": "Ravulapalem", "district": "Konaseema", "meo_count": 2},
    {"id": "mandal-sakhinetipalli", "name": "Sakhinetipalli", "district": "Konaseema", "meo_count": 2},
]

async def seed_database():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("🌱 Starting database seeding...")
    
    # Seed mandals
    existing_mandals = await db.mandals.count_documents({})
    if existing_mandals == 0:
        await db.mandals.insert_many(SAMPLE_MANDALS)
        print(f"✓ Inserted {len(SAMPLE_MANDALS)} mandals")
    else:
        print(f"⚠ Mandals already exist ({existing_mandals}), skipping...")
    
    # Seed schools
    existing_schools = await db.schools.count_documents({})
    if existing_schools == 0:
        schools_to_insert = []
        for school in SAMPLE_SCHOOLS:
            school_doc = school.copy()
            from datetime import datetime, timezone
            school_doc['created_at'] = datetime.now(timezone.utc).isoformat()
            schools_to_insert.append(school_doc)
        
        await db.schools.insert_many(schools_to_insert)
        print(f"✓ Inserted {len(schools_to_insert)} schools")
    else:
        print(f"⚠ Schools already exist ({existing_schools}), skipping...")
    
    # Summary
    total_schools = await db.schools.count_documents({})
    total_mandals = await db.mandals.count_documents({})
    total_users = await db.users.count_documents({})
    
    print("\n📊 Database Summary:")
    print(f"   Total Mandals: {total_mandals}")
    print(f"   Total Schools: {total_schools}")
    print(f"   Total Users: {total_users}")
    print("\n✨ Database seeding complete!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
