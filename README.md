# opto-demo


## Example Questions
"What would happen to my projected returns and volatility if I doubled my venture capital allocation?"

Function Call: simulate_allocation_change("venture_capital", current_allocation * 2)

This temporarily adjusts the venture capital allocation, recalculates all metrics, and updates the charts while keeping the interface in "simulation mode". The AI will explain the impact on returns (13.7%), yield (0.4%), and volatility (10.8%).

"How did portfolios with this asset mix perform during the 2008 financial crisis?"

Function: analyze_historical_scenario("financial_crisis_2008", current_allocations)

This highlights the "Financial crisis" section already on the page (2007-2009) and provides deeper analysis. The AI will explain the drawdown percentages, recovery time, and which assets provided the best protection.

"Can you optimize my private allocations to achieve higher returns with the same volatility?"

Function: optimize_allocation(target_metric="return", constraint_metric="volatility", constraint_value=current_volatility)

This recalculates optimal percentages across the four private asset classes (venture capital, private equity, real estate value add, real estate core). The charts update to show the optimized allocation and projected performance.