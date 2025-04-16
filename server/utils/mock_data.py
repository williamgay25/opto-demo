mock_data = {
    "portfolioType": "Balanced Portfolio",
    "metrics": {
        "return": { "value": 13.7, "change": 2 },
        "yield": { "value": 0.4, "change": 0.4 },
        "volatility": { "value": 10.8, "change": 0.2 }
    },
    "asset_returns": {
        "private_equity": 16.0,
        "venture_capital": 20.0,
        "real_estate_value": 12.0,
        "real_estate_core": 8.0,
        "public_bonds": 4.0,
        "public_equities": 8.0
    },
    "asset_volatility": {
        "private_equity": 18.0,
        "venture_capital": 30.0,
        "real_estate_value": 15.0,
        "real_estate_core": 10.0,
        "public_bonds": 5.0,
        "public_equities": 15.0
    },
    "asset_yield": {
        "private_equity": 0.0,
        "venture_capital": 0.0,
        "real_estate_value": 2.0,
        "real_estate_core": 4.0,
        "public_bonds": 4.0,
        "public_equities": 2.0
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
    "historical_scenarios": {
        "financial_crisis": {
            "description": "2007-2009 Financial Crisis",
            "asset_performance": {
                "private_equity": -25.0,
                "venture_capital": -30.0,
                "real_estate_value": -35.0,
                "real_estate_core": -20.0,
                "public_bonds": 5.0,
                "public_equities": -40.0
            }
        },
        "inflation": {
            "description": "2007-2024 Inflation and Rising Rates",
            "asset_performance": {
                "private_equity": 12.0,
                "venture_capital": 15.0,
                "real_estate_value": 8.0,
                "real_estate_core": 6.0,
                "public_bonds": -2.0,
                "public_equities": 5.0
            }
        },
        "european_debt_crisis": {
            "description": "2010-2012 European Debt Crisis",
            "asset_performance": {
                "private_equity": -5.0,
                "venture_capital": -8.0,
                "real_estate_value": -10.0,
                "real_estate_core": -3.0,
                "public_bonds": 8.0,
                "public_equities": -15.0
            }
        }
    }
}
