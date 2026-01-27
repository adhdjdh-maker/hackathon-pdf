from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient("mongodb://localhost:27017")
users = client.hackathon.users
pdf_documents = client.hackathon.pdf_documents
