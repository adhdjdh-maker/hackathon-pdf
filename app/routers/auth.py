from app.database.db import users
from fastapi import APIRouter, Body, Depends, UploadFile, File, status

from fastapi.responses import JSONResponse

from app.services.auth import create_session_token, jwt_auth_handler

import datetime
import base64
router = APIRouter()

@router.get("/me")
async def get_me(user_data=Depends(jwt_auth_handler)):
    user = await users.find_one({"email": user_data["sub"]})
    if not user:
        return JSONResponse(content={"error": "User not found"}, status_code=404)
    
    return {
        "email": user["email"],
        "display_name": user.get("display_name", "Administrator"),
        "avatar": user.get("avatar"),  # Отдаем строку Base64 или URL
        "settings": user.get("settings", {
            "active_rules": ["gost"],
            "custom_regex": "",
            "exclude_quotes": False
        })
    }

@router.post("/upload-avatar")
async def upload_avatar(file: UploadFile = File(...), user_data=Depends(jwt_auth_handler)):
    # Проверка формата
    if file.content_type not in ["image/jpeg", "image/png"]:
        return JSONResponse(content={"message": "Invalid file type"}, status_code=400)

    # Читаем файл и конвертируем в Base64
    contents = await file.read()
    if len(contents) > 2 * 1024 * 1024:  # Лимит 2MB
        return JSONResponse(content={"message": "File too large"}, status_code=400)

    encoded_image = base64.b64encode(contents).decode("utf-8")
    avatar_data = f"data:{file.content_type};base64,{encoded_image}"

    await users.update_one(
        {"email": user_data["sub"]},
        {"$set": {"avatar": avatar_data}}
    )
    
    return {"avatar_url": avatar_data}

@router.post("/update-settings")
async def update_settings(payload: dict = Body(...), user_data=Depends(jwt_auth_handler)):
    update_data = {"settings": payload.get("settings", {})}
    
    # Синхронизируем display_name если он пришел
    if "display_name" in payload.get("settings", {}):
        update_data["display_name"] = payload["settings"]["display_name"]

    await users.update_one(
        {"email": user_data["sub"]},
        {"$set": update_data}
    )
    return JSONResponse(content={"message": "Настройки обновлены"}, status_code=200)


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

@router.post("/change-password")
async def change_password(
    payload: dict = Body(...), 
    user_data=Depends(jwt_auth_handler)
):
    old_password = payload.get("old_password")
    new_password = payload.get("new_password")
    
    if not old_password or not new_password:
        return JSONResponse(content={"message": "Missing fields"}, status_code=400)
    
    # Ищем пользователя
    user = await users.find_one({"email": user_data["sub"]})
    
    # Проверка старого пароля
    if user.get("password") != old_password:
        return JSONResponse(content={"message": "Текущий пароль неверен"}, status_code=400)
    
    # Обновляем
    await users.update_one(
        {"email": user_data["sub"]},
        {"$set": {"password": new_password}}
    )
    
    return {"message": "Пароль успешно изменен"}

@router.post("/register")
async def register(
    email: str = Body(...), 
    password: str = Body(...),
    fullName: str = Body(...),
    role: str = Body(...),
    school: str = Body(None),
    schoolCode: str = Body(None)
):
    if not email or not password or not fullName:
        return JSONResponse(content={"message": "Заполните обязательные поля"}, status_code=400)

    if await users.find_one({"email": email}):
        return JSONResponse(content={"message": "Пользователь с таким Email уже существует"}, status_code=400)

    if role == "TEACHER" and schoolCode != "QAZ-2026-PRO":
        return JSONResponse(content={"message": "Неверный код доступа школы"}, status_code=403)

    new_user = {
        "email": email,
        "password": password,
        "display_name": fullName,
        "role": role,
        "school": school,
        "settings": {
            "active_rules": ["gost", "tables", "titles"],
            "exclude_quotes": True
        },
        "created_at": datetime.datetime.utcnow()
    }

    await users.insert_one(new_user)
    
    token = await create_session_token(str(email))
    
    return JSONResponse(content={
        "message": "User created successfully", 
        "token": token
    }, status_code=201)
