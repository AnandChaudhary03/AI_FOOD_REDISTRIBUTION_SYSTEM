from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, business, ngo, delivery, admin, individual, pos
from app.models import models
from app.seed import seed_db
import json

# Create all tables & auto-seed demo accounts
Base.metadata.create_all(bind=engine)
try:
    seed_db()
except Exception as e:
    print(f"[Startup] Seeding note: {e}")

app = FastAPI(
    title="AnnaSetu API",
    description="AI-Based Food Redistribution & Surplus Management Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(business.router)
app.include_router(ngo.router)
app.include_router(delivery.router)
app.include_router(admin.router)
app.include_router(individual.router)
app.include_router(pos.router)

# WebSocket connections manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        self.active_connections.pop(user_id, None)

    async def send_personal_message(self, message: dict, user_id: int):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(json.dumps(message))

    async def broadcast(self, message: dict):
        for connection in self.active_connections.values():
            await connection.send_text(json.dumps(message))

manager = ConnectionManager()

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message({"echo": data}, user_id)
    except WebSocketDisconnect:
        manager.disconnect(user_id)

@app.get("/")
def root():
    return {"app": "AnnaSetu", "version": "1.0.0", "status": "running", "tagline": "Bridging Surplus. Ending Hunger."}

@app.get("/health")
def health():
    return {"status": "healthy"}
