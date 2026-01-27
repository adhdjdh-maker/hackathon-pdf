import jwt
import datetime
import config
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

async def create_session_token(user_id: str) -> str:
	payload = {
		"sub": user_id,
		"iat": datetime.datetime.utcnow(),
		"exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=config.jwt_expire_seconds)
	}
	token = jwt.encode(payload, config.jwt_secret, algorithm="HS256")
	return token

async def decode_session_token(token: str) -> dict:
	try:
		payload = jwt.decode(token, config.jwt_secret, algorithms=["HS256"])
		return payload
	except jwt.ExpiredSignatureError:
		return None
	except jwt.InvalidTokenError:
		return None


security = HTTPBearer()

async def jwt_auth_handler(credentials: HTTPAuthorizationCredentials = Depends(security)):
	token = credentials.credentials
	payload = await decode_session_token(token)
	if payload is None:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Invalid or expired JWT token",
			headers={"WWW-Authenticate": "Bearer"},
		)
	return payload
    