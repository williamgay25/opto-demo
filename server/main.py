import os
import json
import copy
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
    """
    Modify one asset class and prorate changes proportionally across others
    to maintain 100% allocation and avoid negative values.
    
    Args:
        portfolio_data: Current portfolio data with flat allocation structure
        function_args: Contains asset_class and new_percentage
    
    Returns:
        Tuple of (new_allocations, new_metrics)
    """
    
    original_allocations = portfolio_data.allocations
    new_allocations = copy.deepcopy(original_allocations)
    
    asset_characteristics = {
        "venture_capital": {"return": 25.0, "yield": 0.1, "volatility": 35.0},
        "private_equity": {"return": 18.0, "yield": 0.3, "volatility": 25.0},
        "real_estate_value": {"return": 12.0, "yield": 3.5, "volatility": 15.0},
        "real_estate_core": {"return": 8.0, "yield": 5.0, "volatility": 10.0},
        "public_bonds": {"return": 5.0, "yield": 4.0, "volatility": 5.0},
        "public_equities": {"return": 10.0, "yield": 2.0, "volatility": 15.0}
    }
    
    asset_class_mapping = {
        "Venture capital": "venture_capital",
        "Private equity": "private_equity",
        "Real estate - value add": "real_estate_value",
        "Real estate - core": "real_estate_core",
        "Public bonds": "public_bonds",
        "Public equities": "public_equities"
    }
    
    target_asset_display = function_args.get("asset_class")
    new_percentage = function_args.get("new_percentage")
    
    target_asset_key = None
    for display_name, key in asset_class_mapping.items():
        if target_asset_display.lower() in display_name.lower():
            target_asset_key = key
            break
    
    if not target_asset_key:

        for key in original_allocations:
            if target_asset_display.lower() in key.lower():
                target_asset_key = key
                break
    
    if not target_asset_key or target_asset_key not in original_allocations:

        return original_allocations, portfolio_data.metrics
    
    old_value = original_allocations[target_asset_key]
    delta = new_percentage - old_value
    
    new_allocations[target_asset_key] = new_percentage

    other_keys = [key for key in new_allocations.keys() if key != target_asset_key]
    
    if delta > 0:
        total_other = sum(new_allocations[key] for key in other_keys)
        
        for key in other_keys:
            proportion = new_allocations[key] / total_other
            reduction = delta * proportion
            new_allocations[key] = round(new_allocations[key] - reduction, 1)

    elif delta < 0:
        total_other = sum(new_allocations[key] for key in other_keys)
        
        for key in other_keys:
            proportion = new_allocations[key] / total_other
            increase = -delta * proportion
            new_allocations[key] = round(new_allocations[key] + increase, 1)
    
    new_metrics = {
        "return": 0,
        "yield": 0,
        "volatility": 0
    }
    
    for key, value in new_allocations.items():
        weight = value / 100.0
        
        if key in asset_characteristics:
            new_metrics["return"] += weight * asset_characteristics[key]["return"]
            new_metrics["yield"] += weight * asset_characteristics[key]["yield"]
            new_metrics["volatility"] += weight * asset_characteristics[key]["volatility"]
    
    for metric in new_metrics:
        new_metrics[metric] = round(new_metrics[metric], 1)
    
    formatted_metrics = {
        "return": {"value": new_metrics["return"], "change": round(new_metrics["return"] - portfolio_data.metrics["return"], 1)},
        "yield": {"value": new_metrics["yield"], "change": round(new_metrics["yield"] - portfolio_data.metrics["yield"], 1)},
        "volatility": {"value": new_metrics["volatility"], "change": round(new_metrics["volatility"] - portfolio_data.metrics["volatility"], 1)}
    }
    
    nested_allocations = transform_to_output_format(new_allocations, original_allocations)
    
    return nested_allocations, formatted_metrics

def transform_to_output_format(new_allocations, original_allocations):
    """
    Transform flat allocation structure to nested format for the response
    """
    private_categories = [
        {"name": "Venture capital - early stage", "key": "venture_capital"},
        {"name": "Private equity - buyout", "key": "private_equity"},
        {"name": "Real estate - value add", "key": "real_estate_value"},
        {"name": "Real estate - core", "key": "real_estate_core"}
    ]
    
    public_categories = [
        {"name": "Public bonds", "key": "public_bonds"},
        {"name": "Public equities", "key": "public_equities"}
    ]
    
    nested_allocations = {
        "private": {
            "total": 0,
            "change": 0,
            "categories": []
        },
        "public": {
            "total": 0,
            "change": 0,
            "categories": []
        }
    }
    
    for cat in private_categories:
        value = new_allocations.get(cat["key"], 0)
        change = value - original_allocations.get(cat["key"], 0)
        nested_allocations["private"]["categories"].append({
            "name": cat["name"],
            "value": value,
            "change": round(change, 1)
        })
        nested_allocations["private"]["total"] += value
    
    for cat in public_categories:
        value = new_allocations.get(cat["key"], 0)
        change = value - original_allocations.get(cat["key"], 0)
        nested_allocations["public"]["categories"].append({
            "name": cat["name"],
            "value": value,
            "change": round(change, 1)
        })
        nested_allocations["public"]["total"] += value

    original_private_total = sum(original_allocations.get(cat["key"], 0) for cat in private_categories)
    original_public_total = sum(original_allocations.get(cat["key"], 0) for cat in public_categories)
    
    nested_allocations["private"]["change"] = round(nested_allocations["private"]["total"] - original_private_total, 1)
    nested_allocations["public"]["change"] = round(nested_allocations["public"]["total"] - original_public_total, 1)
    
    return nested_allocations

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
                print(allocation)
                print(metrics)

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