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
    }
]