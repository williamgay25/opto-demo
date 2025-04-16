import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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
    return {"status": "ok", "message": "Opto AI Assistant API is running"}

@app.get("/portfolio-data")
async def get_portfolio_data():
    try:
        return JSONResponse(content={
            "portfolioType": "Balanced Portfolio",
            "metrics": {
                "return": { "value": 13.7, "change": 2 },
                "yield": { "value": 0.4, "change": 0.4 },
                "volatility": { "value": 10.8, "change": 0.2 }
            },
            "assetAllocation": {
                "private": {
                    "total": 10.0,
                    "categories": [
                        { "name": "Venture capital - early stage", "value": 2.5, "change": 2.5 },
                        { "name": "Private equity - buyout", "value": 2.5, "change": 2.5 },
                        { "name": "Real estate - value add", "value": 2.5, "change": 2.5 },
                        { "name": "Real estate - core", "value": 2.5, "change": 2.5 }
                    ]
                },
                "public": {
                    "total": 90.0,
                    "categories": [
                        { "name": "Public bonds", "value": 54.0, "change": 6.0 },
                        { "name": "Public equities", "value": 36.0, "change": 4.0 }
                    ]
                }
            },
            "projectedValue": {
                "current": [
                    { "year": 2024, "value": 5 },
                    { "year": 2026, "value": 8 },
                    { "year": 2028, "value": 12 },
                    { "year": 2030, "value": 20 },
                    { "year": 2032, "value": 30 },
                    { "year": 2034, "value": 38 },
                    { "year": 2036, "value": 45 },
                    { "year": 2038, "value": 50 }
                ],
                "target": [
                    { "year": 2024, "value": 5 },
                    { "year": 2026, "value": 10 },
                    { "year": 2028, "value": 15 },
                    { "year": 2030, "value": 25 },
                    { "year": 2032, "value": 35 },
                    { "year": 2034, "value": 45 },
                    { "year": 2036, "value": 52 },
                    { "year": 2038, "value": 60 }
                ]
            },
            "historicalAnalysis": {
                "allTime": { "period": "2007-2024", "value": 1 },
                "financialCrisis": { "period": "2007-2009", "value": 2 },
                "europeanDebtCrisis": { "period": "2010-2012", "value": 2 },
                "inflationData": [
                    { "year": 2007, "value": 0 },
                    { "year": 2008, "value": -10 },
                    { "year": 2009, "value": -15 },
                    { "year": 2010, "value": 0 },
                    { "year": 2011, "value": 10 },
                    { "year": 2012, "value": 15 },
                    { "year": 2013, "value": 20 },
                    { "year": 2014, "value": 25 },
                    { "year": 2015, "value": 30 },
                    { "year": 2016, "value": 35 },
                    { "year": 2017, "value": 40 },
                    { "year": 2018, "value": 45 },
                    { "year": 2019, "value": 60 },
                    { "year": 2020, "value": 75 },
                    { "year": 2021, "value": 65 }
                ]
            }
        })
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