tools = [
    {
        "type": "function",
        "function": {
            "name": "simulate_allocation_change",
            "description": "Simulate a change to portfolio allocation and calculate new metrics",
            "parameters": {
                "type": "object",
                "properties": {
                    "asset_class": {
                        "type": "string",
                        "description": "The asset class to modify"
                    },
                    "new_percentage": {
                        "type": "number",
                        "description": "The new allocation percentage"
                    }
                },
                "required": ["asset_class", "new_percentage"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "analyze_historical_scenario",
            "description": "Analyze how the portfolio would perform in a historical scenario",
            "parameters": {
                "type": "object",
                "properties": {
                    "scenario": {
                        "type": "string",
                        "enum": ["financial_crisis", "inflation", "european_debt_crisis"],
                        "description": "The historical scenario to analyze"
                    }
                },
                "required": ["scenario"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "optimize_allocation",
            "description": "Optimize the allocation of a portfolio based on a constraint metric and value",
            "parameters": {
                "type": "object",
                "properties": {
                    "target_metric": {
                        "type": "string",
                        "enum": ["return"],
                        "description": "The target metric to optimize"
                    },
                    "constrain_metric": {
                        "type": "string",
                        "enum": ["volatility"],
                        "description": "The constraint metric"
                    },
                    "constraint_value": {
                        "type": "string",
                        "description": "The constraint value"
                    },
                },
                "required": ["target_metric", "constrain_metrics", "constraint_value"]
            }
        }
    }
]