from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient("mongodb://localhost:27017")
users = client.hackathon.users
history = client.hackathon.history
reports = client.hackathon.reports
