/**
 * Portfolio Optimization Algorithms
 * Uses Data Structures & Algorithms (Knapsack & Greedy) to optimize stock selection
 */

/**
 * Calculate risk-adjusted return (Sharpe-like ratio)
 * Higher is better
 */
const calculateRiskAdjustedReturn = (expectedReturn, volatility, riskLevel) => {
  const riskPenalty = {
    low: 2.0,    // High penalty for volatility
    medium: 1.0, // Moderate penalty
    high: 0.5,   // Low penalty (risk-tolerant)
  };

  const penalty = riskPenalty[riskLevel] || 1.0;
  return expectedReturn / (1 + volatility * penalty / 100);
};

/**
 * Greedy Algorithm for Portfolio Optimization
 * Selects stocks with best risk-adjusted returns until budget is exhausted
 * Time Complexity: O(n log n) where n is number of stocks
 */
export const greedyOptimization = (stocks, budget, riskLevel) => {
  // Convert Mongoose documents to plain objects and calculate risk-adjusted return
  const stocksWithScore = stocks.map((stock) => {
    // Convert to plain object if it's a Mongoose document
    let stockObj;
    if (stock.toObject) {
      stockObj = stock.toObject();
    } else if (stock._doc) {
      stockObj = { ...stock._doc };
    } else {
      stockObj = { ...stock };
    }
    
    return {
      _id: stockObj._id,
      symbol: stockObj.symbol,
      name: stockObj.name,
      price: stockObj.price,
      expectedReturn: stockObj.expectedReturn,
      volatility: stockObj.volatility,
      sector: stockObj.sector,
      score: calculateRiskAdjustedReturn(stockObj.expectedReturn, stockObj.volatility, riskLevel),
      pricePerShare: stockObj.price,
    };
  });

  // Sort by score in descending order (greedy choice)
  stocksWithScore.sort((a, b) => b.score - a.score);

  console.log(`Greedy optimization: ${stocksWithScore.length} stocks, budget: $${budget}`);
  console.log(`Top 3 stocks: ${stocksWithScore.slice(0, 3).map(s => `${s.symbol}($${s.pricePerShare})`).join(', ')}`);

  const selectedStocks = [];
  let remainingBudget = budget;
  let totalExpectedReturn = 0;
  let totalRisk = 0;

  // Greedily select stocks
  for (const stock of stocksWithScore) {
    if (remainingBudget < stock.pricePerShare) {
      continue; // Can't afford even 1 share
    }

    // Calculate how many shares we can buy
    const maxShares = Math.floor(remainingBudget / stock.pricePerShare);
    
    // Limit shares to avoid over-concentration (max 30% of budget per stock)
    const maxAllowedInvestment = budget * 0.3;
    const shares = Math.min(maxShares, Math.floor(maxAllowedInvestment / stock.pricePerShare));

    if (shares === 0) continue;

    const investedAmount = shares * stock.pricePerShare;
    const expectedReturn = (investedAmount * stock.expectedReturn) / 100;

    // Validate calculations
    if (isNaN(investedAmount) || isNaN(expectedReturn)) {
      console.warn(`Skipping stock ${stock.symbol} due to invalid calculations`);
      continue;
    }

    // Get the stock ID - handle both Mongoose documents and plain objects
    const stockId = stock._id || stock.id;
    
    selectedStocks.push({
      stock: stockId,
      symbol: stock.symbol,
      name: stock.name,
      shares: shares,
      investedAmount: investedAmount,
      expectedReturn: expectedReturn,
      weight: 0, // Will calculate after selection
    });

    console.log(`Selected: ${stock.symbol} - ${shares} shares @ $${stock.pricePerShare} = $${investedAmount.toFixed(2)}`);

    remainingBudget -= investedAmount;
    totalExpectedReturn += expectedReturn;
    totalRisk += stock.volatility * (investedAmount / budget);

    // Stop if we've selected enough stocks (diversification)
    if (selectedStocks.length >= 10) break;
  }

  // Calculate weights
  selectedStocks.forEach((allocation) => {
    allocation.weight = (allocation.investedAmount / budget) * 100;
  });

  // Calculate diversification score
  const diversificationScore = calculateDiversificationScore(selectedStocks, stocks);

  // Ensure no NaN values
  const safeTotalRisk = isNaN(totalRisk) ? 0 : totalRisk;
  const safeTotalExpectedReturn = isNaN(totalExpectedReturn) ? 0 : totalExpectedReturn;
  const safeDiversificationScore = isNaN(diversificationScore) ? 0 : diversificationScore;

  return {
    allocations: selectedStocks,
    totalExpectedReturn: safeTotalExpectedReturn,
    totalRisk: safeTotalRisk,
    diversificationScore: safeDiversificationScore,
    usedBudget: budget - remainingBudget,
    remainingBudget: remainingBudget,
  };
};

/**
 * Knapsack-based Portfolio Optimization (0/1 Knapsack variant)
 * Uses dynamic programming to find optimal combination
 * Time Complexity: O(n * W) where n is stocks and W is budget
 */
export const knapsackOptimization = (stocks, budget, riskLevel) => {
  // For large budgets, we'll discretize to make DP feasible
  const scaleFactor = budget > 10000 ? 100 : 1;
  const scaledBudget = Math.floor(budget / scaleFactor);

  // Prepare items for knapsack
  const items = [];
  stocks.forEach((stock) => {
    const score = calculateRiskAdjustedReturn(stock.expectedReturn, stock.volatility, riskLevel);
    const price = Math.ceil(stock.price / scaleFactor);
    
    // Allow multiple shares (bounded knapsack)
    const maxShares = Math.min(10, Math.floor(scaledBudget / price));
    
    for (let i = 1; i <= maxShares; i++) {
      items.push({
        stock: stock,
        shares: i,
        weight: price * i,
        value: score * i,
        expectedReturn: (stock.expectedReturn * stock.price * i) / 100,
      });
    }
  });

  // Dynamic Programming - Knapsack
  const n = items.length;
  const dp = Array(n + 1)
    .fill(null)
    .map(() => Array(scaledBudget + 1).fill(0));

  // Track selected items
  const selected = Array(n + 1)
    .fill(null)
    .map(() => Array(scaledBudget + 1).fill(null));

  // Fill DP table
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= scaledBudget; w++) {
      const item = items[i - 1];
      
      if (item.weight <= w) {
        const includeValue = dp[i - 1][w - item.weight] + item.value;
        const excludeValue = dp[i - 1][w];
        
        if (includeValue > excludeValue) {
          dp[i][w] = includeValue;
          selected[i][w] = i - 1;
        } else {
          dp[i][w] = excludeValue;
        }
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtrack to find selected items
  const selectedItems = [];
  let w = scaledBudget;
  for (let i = n; i > 0 && w > 0; i--) {
    if (selected[i][w] !== null) {
      const itemIndex = selected[i][w];
      selectedItems.push(items[itemIndex]);
      w -= items[itemIndex].weight;
      i = itemIndex + 1; // Move to the item before this one
    }
  }

  // Aggregate by stock symbol
  const stockMap = new Map();
  selectedItems.forEach((item) => {
    const symbol = item.stock.symbol;
    if (stockMap.has(symbol)) {
      const existing = stockMap.get(symbol);
      existing.shares += item.shares;
      existing.investedAmount += item.stock.price * item.shares;
      existing.expectedReturn += item.expectedReturn;
    } else {
      stockMap.set(symbol, {
        stock: item.stock._id,
        symbol: item.stock.symbol,
        name: item.stock.name,
        shares: item.shares,
        investedAmount: item.stock.price * item.shares,
        expectedReturn: item.expectedReturn,
        weight: 0,
      });
    }
  });

  const allocations = Array.from(stockMap.values());
  
  // Calculate totals
  let totalExpectedReturn = 0;
  let totalRisk = 0;
  let usedBudget = 0;

  allocations.forEach((allocation) => {
    totalExpectedReturn += allocation.expectedReturn;
    usedBudget += allocation.investedAmount;
    
    const stock = stocks.find((s) => s.symbol === allocation.symbol);
    if (stock) {
      totalRisk += stock.volatility * (allocation.investedAmount / budget);
    }
  });

  // Calculate weights
  allocations.forEach((allocation) => {
    allocation.weight = (allocation.investedAmount / usedBudget) * 100;
  });

  const diversificationScore = calculateDiversificationScore(allocations, stocks);

  // Ensure no NaN values
  const safeTotalRisk = isNaN(totalRisk) ? 0 : totalRisk;
  const safeTotalExpectedReturn = isNaN(totalExpectedReturn) ? 0 : totalExpectedReturn;
  const safeDiversificationScore = isNaN(diversificationScore) ? 0 : diversificationScore;

  return {
    allocations: allocations,
    totalExpectedReturn: safeTotalExpectedReturn,
    totalRisk: safeTotalRisk,
    diversificationScore: safeDiversificationScore,
    usedBudget: usedBudget,
    remainingBudget: budget - usedBudget,
  };
};

/**
 * Calculate diversification score based on sector distribution
 * Returns a score from 0-100 (higher is better)
 */
const calculateDiversificationScore = (allocations, allStocks) => {
  if (allocations.length === 0) return 0;

  // Count sectors
  const sectorMap = new Map();
  allocations.forEach((allocation) => {
    const stock = allStocks.find((s) => s.symbol === allocation.symbol);
    if (stock && stock.sector) {
      const count = sectorMap.get(stock.sector) || 0;
      sectorMap.set(stock.sector, count + 1);
    }
  });

  const numSectors = sectorMap.size;
  const numStocks = allocations.length;

  // More sectors and more stocks = better diversification
  const sectorScore = Math.min(numSectors * 15, 60); // Max 60 points
  const stockScore = Math.min(numStocks * 4, 40); // Max 40 points

  return Math.min(sectorScore + stockScore, 100);
};

/**
 * Main optimization function - chooses algorithm based on parameters
 */
export const optimizePortfolio = (stocks, budget, riskLevel, algorithm = 'greedy') => {
  if (!stocks || stocks.length === 0) {
    throw new Error('No stocks provided for optimization');
  }

  if (budget <= 0) {
    throw new Error('Budget must be greater than 0');
  }

  // Filter stocks that are affordable AND have valid data
  const affordableStocks = stocks.filter((stock) => {
    // Check if stock has valid price, expectedReturn, and volatility
    const hasValidPrice = stock.price > 0 && !isNaN(stock.price);
    const hasValidReturn = typeof stock.expectedReturn === 'number' && !isNaN(stock.expectedReturn);
    const hasValidVolatility = typeof stock.volatility === 'number' && !isNaN(stock.volatility);
    const isAffordable = stock.price <= budget;
    
    return hasValidPrice && hasValidReturn && hasValidVolatility && isAffordable;
  });

  if (affordableStocks.length === 0) {
    throw new Error('No affordable stocks with valid data for the given budget. Please ensure stocks have valid price, expected return, and volatility values.');
  }

  // Choose algorithm
  if (algorithm === 'knapsack' && budget <= 100000) {
    // Use knapsack for smaller budgets (more optimal but slower)
    return knapsackOptimization(affordableStocks, budget, riskLevel);
  } else {
    // Use greedy for larger budgets or by default (faster)
    return greedyOptimization(affordableStocks, budget, riskLevel);
  }
};
