curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Can you increase the Venture Capital allocation by 10 percent?"
      }
    ],
    "portfolio_data": {
      "allocations": {
        "private_equity": 2.5,
        "venture_capital": 2.5,
        "real_estate_value": 2.5,
        "real_estate_core": 2.5,
        "public_bonds": 54.0,
        "public_equities": 36.0
      },
      "metrics": {
        "return": 13.7,
        "yield": 0.4,
        "volatility": 10.8
      }
    }
  }'