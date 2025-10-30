import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Zap, PieChart, ArrowRight, Sparkles, Target, BarChart3 } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-dark-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-neon-indigo/5 via-transparent to-neon-purple/5" />
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-dark-900 border border-neon-cyan/50 mb-6"
          >
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm text-gray-200 font-medium">Powered by Advanced DSA Algorithms</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Optimize Your</span>
            <br />
            <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent animate-glow-pulse">
              Stock Portfolio
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Build data-driven portfolios that <span className="text-neon-cyan font-semibold">maximize returns</span> while managing risk.
            Powered by cutting-edge optimization algorithms.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/register">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="relative px-8 py-4 rounded-xl font-bold text-lg overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink" />
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                <div className="relative z-10 flex items-center space-x-2 text-white">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </motion.div>
            </Link>
            
            <Link to="/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-bold text-lg bg-dark-900 border-2 border-neon-indigo/50 text-white hover:border-neon-cyan transition-colors"
              >
                Sign In
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24"
        >
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8 text-neon-cyan" />}
            title="Maximize Returns"
            description="Advanced algorithms select stocks with the best risk-adjusted returns"
            delay={0.1}
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-neon-purple" />}
            title="Risk Management"
            description="Customize portfolios based on your risk tolerance level"
            delay={0.2}
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-neon-pink" />}
            title="Fast Optimization"
            description="Get optimized portfolios in seconds using efficient algorithms"
            delay={0.3}
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8 text-neon-blue" />}
            title="Diversification"
            description="Automatic sector diversification for balanced portfolios"
            delay={0.4}
          />
        </motion.div>

        {/* How It Works */}
        <div className="mt-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-center mb-16"
          >
            <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              How It Works
            </span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Set Your Budget"
              description="Enter your investment budget and risk tolerance level"
              delay={0.1}
            />
            <StepCard
              number="2"
              title="Algorithm Optimization"
              description="Our algorithms analyze stocks and create optimal allocations"
              delay={0.2}
            />
            <StepCard
              number="3"
              title="Get Your Portfolio"
              description="Receive a diversified portfolio with expected returns and risk metrics"
              delay={0.3}
            />
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-32 mb-20 relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neon-indigo via-neon-purple to-neon-pink opacity-90" />
          <div className="absolute inset-0 bg-cyber-grid-bg opacity-20" />
          <div className="relative z-10 p-16 text-center">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4 text-white"
            >
              Ready to Optimize Your Investments?
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="text-xl mb-10 text-gray-100 max-w-2xl mx-auto"
            >
              Join thousands of investors making <span className="font-bold">smarter portfolio decisions</span> with AI-powered optimization
            </motion.p>
            <Link to="/register">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255, 255, 255, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-10 py-4 bg-white text-neon-indigo rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Create Free Account
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="relative group"
  >
    <div className="bg-dark-900 p-8 rounded-2xl border border-white/20 hover:border-neon-indigo/50 transition-all h-full">
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
        className="mb-6 inline-block"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-indigo/5 via-neon-purple/5 to-neon-pink/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </motion.div>
);

const StepCard = ({ number, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="text-center group"
  >
    <motion.div
      whileHover={{ scale: 1.1, rotate: 360 }}
      transition={{ duration: 0.6 }}
      className="relative w-20 h-20 mx-auto mb-6"
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple opacity-100 group-hover:opacity-80 transition-opacity" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10 w-full h-full flex items-center justify-center text-3xl font-bold text-white">
        {number}
      </div>
    </motion.div>
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed max-w-xs mx-auto">{description}</p>
  </motion.div>
);

export default HomePage;
