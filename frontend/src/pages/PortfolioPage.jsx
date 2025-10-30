import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { portfolioAPI, stockAPI } from '../utils/api';
import { AllocationPieChart, ReturnsBarChart, SectorDistributionChart } from '../components/PortfolioChart';
import StockCard from '../components/StockCard';
import { Loader, ArrowLeft, TrendingUp, DollarSign, Shield, Target, Trash2, AlertCircle } from 'lucide-react';

const PortfolioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id === 'create') {
      setLoading(false);
      return;
    }
    fetchPortfolio();
  }, [id]);

  const fetchPortfolio = async () => {
    try {
      const [portfolioRes, statsRes] = await Promise.all([
        portfolioAPI.getById(id),
        portfolioAPI.getStats(id),
      ]);

      setPortfolio(portfolioRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this portfolio?')) {
      return;
    }

    setDeleting(true);
    try {
      await portfolioAPI.delete(id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      alert('Failed to delete portfolio');
    } finally {
      setDeleting(false);
    }
  };

  if (id === 'create') {
    return <CreatePortfolioForm />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-neon-cyan" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Portfolio Not Found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-xl hover:shadow-lg hover:shadow-neon-cyan/50 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 pt-20">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-300 hover:text-neon-cyan mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mb-2">{portfolio.name}</h1>
              <p className="text-gray-300">
                Created on {new Date(portfolio.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/20 hover:border-red-400 transition flex items-center space-x-2 disabled:opacity-50"
            >
              <Trash2 className="w-5 h-5" />
              <span>{deleting ? 'Deleting...' : 'Delete'}</span>
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Total Budget"
            value={`$${portfolio.totalBudget.toLocaleString()}`}
            color="blue"
          />
          <SummaryCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Expected Return"
            value={`$${portfolio.totalExpectedReturn.toFixed(2)}`}
            color="green"
          />
          <SummaryCard
            icon={<Shield className="w-6 h-6" />}
            title="Risk Score"
            value={portfolio.totalRisk.toFixed(2)}
            color="orange"
          />
          <SummaryCard
            icon={<Target className="w-6 h-6" />}
            title="Diversification"
            value={`${portfolio.diversificationScore}/100`}
            color="purple"
          />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <AllocationPieChart allocations={portfolio.allocations} />
          <ReturnsBarChart allocations={portfolio.allocations} />
        </div>

        {stats?.sectorDistribution && Object.keys(stats.sectorDistribution).length > 0 && (
          <div className="mb-8">
            <SectorDistributionChart sectorData={stats.sectorDistribution} />
          </div>
        )}

        {/* Holdings */}
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mb-6">Portfolio Holdings</h2>
          <div className="bg-dark-900 rounded-2xl border border-white/20 overflow-hidden">
            <table className="w-full">
              <thead className="bg-dark-950 border-b border-white/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Shares
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Invested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Expected Return
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Weight
                  </th>
                </tr>
              </thead>
              <tbody className="bg-dark-900 divide-y divide-white/10">
                {portfolio.allocations.map((allocation, index) => (
                  <tr key={index} className="hover:bg-dark-950 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-semibold text-white">{allocation.symbol}</div>
                        <div className="text-sm text-gray-300">{allocation.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {allocation.shares}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      ${allocation.investedAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-400 font-semibold">
                      ${allocation.expectedReturn.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {allocation.weight.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: 'bg-neon-cyan/10 text-neon-cyan',
    green: 'bg-green-500/10 text-green-400',
    orange: 'bg-orange-500/10 text-orange-400',
    purple: 'bg-neon-purple/10 text-neon-purple',
  };

  return (
    <div className="bg-dark-900 rounded-2xl border border-white/20 p-6 hover:border-neon-cyan/50 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-300 mb-1">{title}</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
};

// Create Portfolio Form Component
const CreatePortfolioForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    totalBudget: '',
    riskLevel: 'medium',
    algorithm: 'greedy',
  });
  const [stocks, setStocks] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await stockAPI.getAll({ limit: 50 });
      setStocks(response.data.stocks || []);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const handleStockSelect = (stock) => {
    if (selectedStocks.includes(stock.symbol)) {
      setSelectedStocks(selectedStocks.filter((s) => s !== stock.symbol));
    } else {
      setSelectedStocks([...selectedStocks, stock.symbol]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate budget
    const budget = parseFloat(formData.totalBudget);
    if (isNaN(budget) || budget < 100) {
      setError('Please enter a valid budget amount (minimum $100)');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        totalBudget: budget,
        riskLevel: formData.riskLevel,
        algorithm: formData.algorithm,
      };

      // Only add stockSymbols if stocks are selected
      if (selectedStocks.length > 0) {
        payload.stockSymbols = selectedStocks;
      }

      const response = await portfolioAPI.optimize(payload);

      navigate(`/portfolio/${response.data.portfolio._id}`);
    } catch (error) {
      console.error('Portfolio creation error:', error);
      setError(error.response?.data?.message || 'Failed to create portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-300 hover:text-neon-cyan mb-6 transition-colors pt-20"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mb-8">Create New Portfolio</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center space-x-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-dark-900 rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mb-6">Portfolio Settings</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Portfolio Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-950 border border-white/20 rounded-xl focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan text-white placeholder-gray-400 transition-all"
                  placeholder="My Portfolio"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Total Budget ($)
                </label>
                <input
                  type="number"
                  value={formData.totalBudget}
                  onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-950 border border-white/20 rounded-xl focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan text-white placeholder-gray-400 transition-all"
                  placeholder="10000"
                  min="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Risk Level
                </label>
                <select
                  value={formData.riskLevel}
                  onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-950 border border-white/20 rounded-xl focus:ring-2 focus:ring-neon-purple focus:border-neon-purple text-white transition-all"
                >
                  <option value="low" className="bg-dark-950">Low - Conservative</option>
                  <option value="medium" className="bg-dark-950">Medium - Balanced</option>
                  <option value="high" className="bg-dark-950">High - Aggressive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Optimization Algorithm
                </label>
                <select
                  value={formData.algorithm}
                  onChange={(e) => setFormData({ ...formData, algorithm: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-950 border border-white/20 rounded-xl focus:ring-2 focus:ring-neon-purple focus:border-neon-purple text-white transition-all"
                >
                  <option value="greedy" className="bg-dark-950">Greedy (Fast)</option>
                  <option value="knapsack" className="bg-dark-950">Knapsack (Optimal)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-dark-900 rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mb-4">
              Select Stocks (Optional - Leave empty to use all)
            </h2>
            <p className="text-gray-300 mb-6">
              Selected: <span className="text-neon-cyan font-semibold">{selectedStocks.length}</span> stocks
            </p>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {stocks.map((stock) => (
                <StockCard
                  key={stock._id}
                  stock={stock}
                  onSelect={handleStockSelect}
                  selected={selectedStocks.includes(stock.symbol)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-white/20 text-gray-300 rounded-xl hover:bg-dark-900 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-xl hover:shadow-lg hover:shadow-neon-cyan/50 transition disabled:opacity-50 font-semibold"
            >
              {loading ? 'Optimizing...' : 'Create Portfolio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortfolioPage;
