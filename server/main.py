import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, List, Optional
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

def calculate_metrics(allocations):
    """Calculate portfolio metrics based on allocations"""
    return {
        "return": sum([allocations[asset] * mock_data["asset_returns"][asset] for asset in allocations]) / 100,
        "volatility": sum([allocations[asset] * mock_data["asset_volatility"][asset] for asset in allocations]) / 100,
        "yield": sum([allocations[asset] * mock_data["asset_yield"][asset] for asset in allocations]) / 100
    }

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

        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=tools
        ) 

        result = completion.choices[0].message

        if result.tool_calls:
            tool_call = result.tool_calls[0]
            function_name = tool_call.function.name
            function_args = json.loads(tool_call.function.arguments)
            
            if function_name == "simulate_allocation_change":
                asset_class = function_args["asset_class"]
                new_percentage = function_args["new_percentage"]

                simulated_allocations = request.portfolio_data.allocations.copy()
                simulated_allocations[asset_class] = new_percentage

                new_metrics = calculate_metrics(simulated_allocations)

                return {
                    "type": "function_result",
                    "function_name": function_name,
                    "original_allocations": request.portfolio_data.allocations,
                    "simulated_allocations": simulated_allocations,
                    "original_metrics": request.portfolio_data.metrics,
                    "simulated_metrics": new_metrics,
                    "assistant_message": result
                }

            elif function_name == "analyze_historical_scenario":
                scenario = function_args["scenario"]
                performance_data = mock_data["historical_scenarios"].get(scenario, {}).get("asset_performance", {})

                impact = {
                    asset: round(
                        request.portfolio_data.allocations.get(asset, 0) * (performance_data.get(asset, 0) / 100), 2
                    )
                    for asset in request.portfolio_data.allocations
                }

                total_impact = round(sum(impact.values()), 2)

                return {
                    "type": "function_result",
                    "function_name": function_name,
                    "scenario": scenario,
                    "performance_data": performance_data,
                    "impact_by_asset": impact,
                    "total_portfolio_impact": total_impact,
                    "assistant_message": result
                }

            elif function_name == "optimize_allocation":
                returns = mock_data["asset_returns"]
                allocations = request.portfolio_data.allocations.copy()

                lowest = min(returns, key=lambda a: returns[a])
                highest = max(returns, key=lambda a: returns[a])

                shift_amount = min(allocations.get(lowest, 0), 5.0)
                allocations[lowest] -= shift_amount
                allocations[highest] = allocations.get(highest, 0) + shift_amount

                new_metrics = calculate_metrics(allocations)

                return {
                    "type": "function_result",
                    "function_name": function_name,
                    "original_allocations": request.portfolio_data.allocations,
                    "optimized_allocations": allocations,
                    "original_metrics": request.portfolio_data.metrics,
                    "optimized_metrics": new_metrics,
                    "shifted": {
                        "from": lowest,
                        "to": highest,
                        "amount": shift_amount
                    },
                    "assistant_message": result
                }

        return {
            "type": "assistant_result",
            "assistant_message": result
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ping")
async def ping():
    return {"ping": "pong"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)), reload=True)