import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
    """Basic health check endpoint"""
    return {"status": "ok", "message": "Opto AI Assistant API is running"}

@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Simple chat endpoint that echoes the message back
    This will be expanded to call OpenAI in the next phase
    """
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
    """Another simple endpoint to test connectivity"""
    return {"ping": "pong"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)), reload=True)