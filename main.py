

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth
from app.routers.handlers import text

app = FastAPI()
app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost:5173"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"]
)

app.mount("/", StaticFiles(directory="app/public", html=True), name="static")

app.include_router(auth.router, prefix="/auth")
app.include_router(text.router, prefix="/documents")
if __name__ == "__main__":
	import uvicorn
	uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
