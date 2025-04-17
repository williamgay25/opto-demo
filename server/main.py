import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, List
from utils.tools import tools
from utils.mock_data import mock_data
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

app = FastAPI(title="Opto Demo Backend")

class PortfolioData(BaseModel):
    allocations: Dict[str, float]
    metrics: Dict[str, float]

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    portfolio_data: PortfolioData

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

def generate(messages: List):
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        tools=tools
    )

    return completion.choices[0].message

def simulate_allocation_change(portfolio_data, function_args):
    metrics = {
        "return": { "value": 13.7, "change": 0.0 },
        "yield": { "value": 0.4, "change": 0.0 },
        "volatility": { "value": 10.8, "change": 0.0 }
    }

    allocation = {
        "private": {
            "total": 10.0,
            "change": 0.0,
            "categories": [
                { "name": "Venture capital - early stage", "value": 2.5, "change": 0.0 },
                { "name": "Private equity - buyout", "value": 2.5, "change": 0.0 },
                { "name": "Real estate - value add", "value": 2.5, "change": 0.0 },
                { "name": "Real estate - core", "value": 2.5, "change": 0.0 }
            ]
        },
        "public": {
            "total": 90.0,
            "change": 0.0,
            "categories": [
                { "name": "Public bonds", "value": 54.0, "change": 0.0 },
                { "name": "Public equities", "value": 36.0, "change": 0.0 }
            ]
        }
    }

    return allocation, metrics

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
        messages = [{"role": m.role, "content": m.content} for m in request.messages]

        portfolio_context = f"""
        Current portfolio data:
        - Return: {request.portfolio_data.metrics['return']}%
        - Volatility: {request.portfolio_data.metrics['volatility']}%
        - Yield: {request.portfolio_data.metrics['yield']}%
        - Allocations: {json.dumps(request.portfolio_data.allocations)}
        """

        messages.insert(0, {
            "role": "system", 
            "content": f"You are an AI assistant for Opto Investments. You help financial advisors analyze and optimize portfolios. {portfolio_context}"
        })

        initial_result = generate(messages)
        messages.append(initial_result)

        if initial_result.tool_calls:
            tool_call = initial_result.tool_calls[0]
            function_name = tool_call.function.name
            function_args = json.loads(tool_call.function.arguments)
            
            if function_name == "simulate_allocation_change":
                allocation, metrics = simulate_allocation_change(request.portfolio_data, function_args)

                tool_context = f"""
                Simulated portfolio data:
                - Return: {metrics['return']}%
                - Volatility: {metrics['volatility']}%
                - Yield: {metrics['yield']}%
                - Allocations: {json.dumps(allocation)}
                """

                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": tool_context
                })

                tool_result = generate(messages)

                return {
                    "type": "function_result",
                    "function_name": function_name,
                    "original_allocations": request.portfolio_data.allocations,
                    "simulated_allocations": allocation,
                    "original_metrics": request.portfolio_data.metrics,
                    "simulated_metrics": metrics,
                    "assistant_message": tool_result.content
                }

        return {
            "type": "assistant_result",
            "assistant_message": initial_result.content
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ping")
async def ping():
    return {"ping": "pong"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)), reload=True)