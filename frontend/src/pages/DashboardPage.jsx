import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { portfolioAPI, stockAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StockCard from '../components/StockCard';
import { Loader, TrendingUp, DollarSign, Shield, Search, Plus } from 'lucide-react';

const DashboardPage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [portfoliosRes, stocksRes] = await Promise.all([
        portfolioAPI.getAll({ status: 'active' }),
        stockAPI.getAll({ limit: 20 }),
      ]);

      setPortfolios(portfoliosRes.data.portfolios || []);
      setStocks(stocksRes.data.stocks || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchData();
      return;
    }

    try {
      const response = await stockAPI.search(searchQuery);
      setStocks(response.data.stocks || []);
    } catch (error) {
      console.error('Error searching stocks:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-neon-cyan" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 pt-13 justify-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mb-2 justify-center">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-300 justify-center">Manage your portfolios and discover new opportunities</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Active Portfolios"
            value={portfolios.length}
            color="blue"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Total Invested"
            value={`$${portfolios.reduce((sum, p) => sum + p.totalBudget, 0).toLocaleString()}`}
            color="green"
          />
          <StatCard
            icon={<Shield className="w-6 h-6" />}
            title="Risk Level"
            value={user?.riskTolerance?.toUpperCase()}
            color="purple"
          />
        </div>

        {/* Create Portfolio Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-xl hover:shadow-lg hover:shadow-neon-cyan/50 transition font-semibold flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Portfolio</span>
          </button>
        </div>

        {/* Create Portfolio Form */}
        {showCreateForm && (
          <div className="bg-dark-950 rounded-2xl border border-white/20 p-6 mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mb-4">Create Portfolio</h2>
            <button
              onClick={() => navigate('/portfolio/create')}
              className="px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-xl hover:shadow-lg hover:shadow-neon-cyan/50 transition"
            >
              Go to Portfolio Builder
            </button>
          </div>
        )}

        {/* Portfolios */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mb-6">Your Portfolios</h2>
          {portfolios.length === 0 ? (
            <div className="bg-dark-950 rounded-2xl border border-white/20 p-12 text-center">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No portfolios yet</h3>
              <p className="text-gray-300 mb-6">Create your first optimized portfolio to get started</p>
              <button
                onClick={() => navigate('/portfolio/create')}
                className="px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-xl hover:shadow-lg hover:shadow-neon-cyan/50 transition"
              >
                Create Portfolio
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map((portfolio) => (
                <PortfolioCard key={portfolio._id} portfolio={portfolio} />
              ))}
            </div>
          )}
        </div>

        {/* Available Stocks */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">Available Stocks</h2>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search stocks..."
                className="px-4 py-2 bg-dark-950 border border-white/20 rounded-xl focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan text-white placeholder-gray-400"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-xl hover:shadow-lg hover:shadow-neon-cyan/50 transition"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stocks.map((stock) => (
              <StockCard key={stock._id} stock={stock} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: 'bg-neon-cyan/10 text-neon-cyan',
    green: 'bg-green-500/10 text-green-400',
    purple: 'bg-neon-purple/10 text-neon-purple',
  };

  return (
    <div className="bg-dark-950 rounded-2xl border border-white/20 p-6 hover:border-neon-cyan/50 transition-all">
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

const PortfolioCard = ({ portfolio }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/portfolio/${portfolio._id}`)}
      className="bg-dark-950 rounded-2xl border border-white/20 p-6 hover:border-neon-cyan/50 hover:shadow-lg hover:shadow-neon-cyan/20 transition cursor-pointer"
    >
      <h3 className="text-xl font-bold text-white mb-3">{portfolio.name}</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-300">Budget:</span>
          <span className="font-semibold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">${portfolio.totalBudget.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Expected Return:</span>
          <span className="font-semibold text-green-400">
            ${portfolio.totalExpectedReturn.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Risk Level:</span>
          <span className="font-semibold text-white capitalize">{portfolio.riskLevel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Stocks:</span>
          <span className="font-semibold text-white">{portfolio.allocations.length}</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Diversification</span>
          <span className="text-sm font-semibold text-neon-cyan">
            {portfolio.diversificationScore}/100
          </span>
        </div>
        <div className="mt-2 w-full bg-dark-950 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-neon-cyan to-neon-purple h-2 rounded-full"
            style={{ width: `${portfolio.diversificationScore}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
