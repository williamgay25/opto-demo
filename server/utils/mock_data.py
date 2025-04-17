mock_data = {
    "portfolio_type": "Balanced Portfolio",
    "portfolio_size": 25.0,
    "metrics": {
        "return": { "value": 13.7, "change": 0.0 },
        "yield": { "value": 0.4, "change": 0.0 },
        "volatility": { "value": 10.8, "change": 0.0 }
    },
    "asset_allocation": {
        "private": {
            "total": 10.0,
            "change": 0.0,
            "categories": [
                { "name": "Venture capital - early stage", "value": 3.5, "change": 0.0 },
                { "name": "Private equity - buyout", "value": 1.5, "change": 0.0 },
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
    },
    "projected_value": {
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
        "all_time": {
            "period": "2007-2024",
            "value": 1,
            "projections": [
                { "year": 2007, "value": 0 },
                { "year": 2009, "value": 10 },
                { "year": 2011, "value": 20 },
                { "year": 2013, "value": 30 },
                { "year": 2015, "value": 45 },
                { "year": 2017, "value": 60 },
                { "year": 2019, "value": 70 },
                { "year": 2021, "value": 75 },
                { "year": 2023, "value": 68 },
            ],
        },
        "financial_crisis": {
            "period": "2007-2009",
            "value": 2
        },
        "inflation": {
            "period": "2007-2024",
            "value": 2,
        },
        "european_debt_crisis": {
            "period": "2010-2012",
            "value": 2,
        }
    }
}
