from app.database.db import users
from fastapi import APIRouter, Body, status

from fastapi.responses import JSONResponse

from app.services.auth import create_session_token

router = APIRouter()

@router.post("/login")
async def login(email: str = Body(...), password: str = Body(...)):
    if email and password:
        if (await users.find_one({"email": email, "password": password})):
            jwt = await create_session_token(str(email))
            return JSONResponse(content={"message": "Login successfully", "token": jwt}, status_code=200)
        else:
            return JSONResponse(content={"message": "Invalid email or password"}, status_code=401)
    else:
        return JSONResponse(content={"message": "Not valid parameters"}, status_code=400)


@router.post("/register")
async def register(email: str = Body(...), password: str = Body(...)):
    if email and password:
        if not (await users.find_one({"email": email})):
            await users.insert_one({"email": email, "password": password})
            jwt = await create_session_token(str(email))
            return JSONResponse(content={"message": "User created successfully", "token": jwt}, status_code=201)
        else:
            return JSONResponse(content={"message": "User already exists"}, status_code=400)
    else:
        return JSONResponse(content={"message": "Not valid parameters"}, status_code=400)
