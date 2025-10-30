import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

const StockCard = ({ stock, onSelect, selected }) => {
  const isPositive = stock.expectedReturn > 0;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect && onSelect(stock)}
      className={`relative p-5 rounded-2xl cursor-pointer transition-all group ${
        selected
          ? 'bg-dark-950 border-2 border-neon-cyan shadow-lg shadow-neon-cyan/20'
          : 'bg-dark-950 border border-white/20 hover:border-neon-indigo/50'
      }`}
    >
      {/* Animated background glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-indigo/5 via-neon-purple/5 to-neon-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-xl text-white">{stock.symbol}</h3>
              {selected && <Zap className="w-4 h-4 text-neon-cyan animate-pulse" />}
            </div>
            <p className="text-sm text-gray-300 truncate">{stock.name}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              ${stock.price.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 p-2 rounded-xl bg-dark-950 border border-white/20"
          >
            {isPositive ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
            <div>
              <p className="text-xs text-gray-300">Return</p>
              <p className={`font-bold text-sm ${
                isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                {stock.expectedReturn.toFixed(2)}%
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 p-2 rounded-xl bg-dark-950 border border-white/20"
          >
            <Activity className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-xs text-gray-300">Volatility</p>
              <p className="font-bold text-sm text-orange-400">
                {stock.volatility.toFixed(2)}%
              </p>
            </div>
          </motion.div>
        </div>

        {stock.sector && (
          <div className="pt-3 border-t border-white/20">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-dark-950 border border-neon-indigo/50 text-neon-cyan">
              {stock.sector}
            </span>
          </div>
        )}
      </div>

      {/* Selection indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-3 h-3 rounded-full bg-neon-cyan shadow-neon-cyan"
        />
      )}
    </motion.div>
  );
};

export default StockCard;
