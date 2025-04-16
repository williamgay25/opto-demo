import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from utils.tools import tools
from utils.mock_data import mock_data

app = FastAPI(title="Opto Demo Backend")

class ChatRequest(BaseModel):
    message: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://opto-demo.vercel.app",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Opto AI Assistant API is running"}

@app.get("/portfolio-data")
async def get_portfolio_data():
    try:
        return JSONResponse(content=mock_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        return {
            "received": request.message,
            "response": f"You said: {request.message}",
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ping")
async def ping():
    return {"ping": "pong"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)), reload=True)