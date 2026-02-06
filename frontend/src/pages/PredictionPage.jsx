import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap, Brain, Activity, Target, Sparkles, ArrowRight } from 'lucide-react';
import CoinSelector from '../components/CoinSelector';
import CryptoChart from '../components/CryptoChart';
import { saveHistory } from '../utils/history';

const API_URL = 'http://127.0.0.1:8000';

const PredictionPage = ({ user }) => {
    const [selectedCoin, setSelectedCoin] = useState('BTC');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [predicting, setPredicting] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState(null);

    // Fetch prediction data
    const fetchPrediction = async () => {
        setPredicting(true);
        setShowResults(false);
        setError(null);

        try {
            const response = await axios.get(`${API_URL}/predict/${selectedCoin}/forecast?steps=24`);
            console.log('API Response:', response.data);
            console.log('Current Price:', response.data.current_price);
            console.log('Forecast:', response.data.forecast);
            setData(response.data);

            // Save to history
            if (response.data && user) {
                saveHistory(user, 'prediction', {
                    coin: selectedCoin,
                    current_price: response.data.current_price,
                    predicted_price: response.data.forecast?.[0]?.price || 0
                });
            }

            // Delay to show animation
            setTimeout(() => {
                setShowResults(true);
                setPredicting(false);
            }, 1500);

        } catch (err) {
            console.error("Prediction Error", err);
            setError(err.response?.data?.detail || err.message || "Failed to fetch prediction");
            setPredicting(false);
        }
    };

    // Auto-fetch on mount and coin change
    useEffect(() => {
        fetchPrediction();
    }, [selectedCoin]);

    // Calculate prediction metrics
    const getPredictionMetrics = () => {
        if (!data || !data.forecast || data.forecast.length === 0) {
            return { change: 0, changePercent: 0, nextPrice: 0, isPositive: true };
        }

        const currentPrice = data.current_price;
        const nextPrice = data.forecast[0].price;
        const change = nextPrice - currentPrice;
        const changePercent = (change / currentPrice) * 100;

        return {
            change,
            changePercent,
            nextPrice,
            isPositive: change >= 0
        };
    };

    const metrics = getPredictionMetrics();
    const currentPriceINR = data?.current_price ? data.current_price * 90 : 0;
    const nextPriceINR = metrics.nextPrice * 90;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen px-6 py-8 pb-24 relative z-10"
        >
            {/* Hero Section */}
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                        <Sparkles className="text-purple-400" size={16} />
                        <span className="text-purple-300 text-sm font-bold">AI-Powered Predictions</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
                        <span className="metallic-text">Crypto</span>{' '}
                        <span className="neon-text">Forecast</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Machine learning predictions for the next 24 hours
                    </p>
                </motion.div>

                {/* Main Prediction Card */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel rounded-[3rem] p-8 md:p-12 mb-8 relative overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 ${metrics.isPositive ? 'bg-green-500' : 'bg-red-500'} transition-all duration-1000`}></div>

                    {/* Coin Selector */}
                    <div className="relative z-10 mb-8">
                        <label className="block text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">
                            Select Cryptocurrency
                        </label>
                        <CoinSelector selectedCoin={selectedCoin} onSelect={setSelectedCoin} />
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 mb-6 relative z-10">
                            <p className="text-red-300 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Current Price */}
                    <div className="relative z-10 mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-slate-400 text-sm font-medium uppercase tracking-wide">Current Price</span>
                            <span className="w-2 h-2 rounded-full bg-green-500 live-pulse"></span>
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPriceINR}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="text-5xl md:text-6xl font-bold text-white"
                            >
                                {new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    maximumFractionDigits: 0
                                }).format(currentPriceINR)}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Predict Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={fetchPrediction}
                        disabled={predicting}
                        className={`relative z-10 w-full py-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${predicting
                            ? 'bg-purple-500/50 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500'
                            }`}
                    >
                        {predicting ? (
                            <>
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                <span>Analyzing Market Data...</span>
                            </>
                        ) : (
                            <>
                                <Brain size={24} />
                                <span>Generate AI Prediction</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </motion.button>
                </motion.div>

                {/* Prediction Results */}
                <AnimatePresence>
                    {showResults && data && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            className="space-y-6"
                        >
                            {/* Prediction Summary */}
                            <div className={`animated-border rounded-[2.5rem] ${metrics.isPositive ? 'border-green-500' : 'border-red-500'}`}>
                                <div className="glass-panel rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden">
                                    {/* Animated Background */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.1 }}
                                        className={`absolute inset-0 ${metrics.isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                                    />

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className={`p-3 rounded-full ${metrics.isPositive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                                {metrics.isPositive ? (
                                                    <TrendingUp className="text-green-400" size={28} />
                                                ) : (
                                                    <TrendingDown className="text-red-400" size={28} />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">Next Hour Prediction</h3>
                                                <p className="text-slate-400">Based on technical analysis</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Predicted Price */}
                                            <div>
                                                <p className="text-slate-400 text-sm mb-2">Predicted Price</p>
                                                <motion.p
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="text-4xl md:text-5xl font-bold text-white"
                                                >
                                                    {new Intl.NumberFormat('en-IN', {
                                                        style: 'currency',
                                                        currency: 'INR',
                                                        maximumFractionDigits: 0
                                                    }).format(nextPriceINR)}
                                                </motion.p>
                                            </div>

                                            {/* Change */}
                                            <div>
                                                <p className="text-slate-400 text-sm mb-2">Expected Change</p>
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                    className="flex items-baseline gap-3"
                                                >
                                                    <span className={`text-4xl md:text-5xl font-bold ${metrics.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                                        {metrics.isPositive ? '+' : ''}{metrics.changePercent.toFixed(2)}%
                                                    </span>
                                                    <span className="text-xl text-slate-400">
                                                        ({metrics.isPositive ? '+' : ''}₹{Math.abs(metrics.change * 90).toLocaleString('en-IN', { maximumFractionDigits: 0 })})
                                                    </span>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Technical Indicators */}
                            {data.technical_indicators && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="glass-panel rounded-[2rem] p-6 md:p-8"
                                >
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Activity className="text-cyan-400" size={20} />
                                        Technical Indicators
                                    </h3>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {/* RSI */}
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <p className="text-slate-400 text-xs mb-2 uppercase tracking-wide">RSI</p>
                                            <p className="text-2xl font-bold text-white">
                                                {data.technical_indicators.rsi.toFixed(1)}
                                            </p>
                                            <p className={`text-xs mt-1 ${data.technical_indicators.rsi > 70 ? 'text-red-400' :
                                                data.technical_indicators.rsi < 30 ? 'text-green-400' :
                                                    'text-yellow-400'
                                                }`}>
                                                {data.technical_indicators.rsi > 70 ? 'Overbought' :
                                                    data.technical_indicators.rsi < 30 ? 'Oversold' :
                                                        'Neutral'}
                                            </p>
                                        </div>

                                        {/* Volatility */}
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <p className="text-slate-400 text-xs mb-2 uppercase tracking-wide">Volatility</p>
                                            <p className="text-2xl font-bold text-white">
                                                {data.technical_indicators.volatility.toFixed(0)}
                                            </p>
                                            <p className="text-xs mt-1 text-yellow-400">20-Period</p>
                                        </div>

                                        {/* MACD */}
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <p className="text-slate-400 text-xs mb-2 uppercase tracking-wide">MACD</p>
                                            <p className={`text-2xl font-bold ${data.technical_indicators.macd_hist >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {data.technical_indicators.macd_hist >= 0 ? '+' : ''}{data.technical_indicators.macd_hist.toFixed(2)}
                                            </p>
                                            <p className={`text-xs mt-1 ${data.technical_indicators.macd_hist >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {data.technical_indicators.macd_hist >= 0 ? 'Bullish' : 'Bearish'}
                                            </p>
                                        </div>

                                        {/* BB Width */}
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <p className="text-slate-400 text-xs mb-2 uppercase tracking-wide">BB Width</p>
                                            <p className="text-2xl font-bold text-white">
                                                {(data.technical_indicators.bb_width * 100).toFixed(2)}%
                                            </p>
                                            <p className="text-xs mt-1 text-purple-400">Bands</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* 24-Hour Forecast Chart */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="glass-panel rounded-[2rem] p-6 md:p-8"
                            >
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Target className="text-purple-400" size={20} />
                                    24-Hour Price Forecast
                                </h3>

                                <div className="h-[400px] w-full">
                                    {data.history && data.forecast && (
                                        <CryptoChart
                                            history={data.history.slice(-12)}
                                            forecast={data.forecast}
                                        />
                                    )}
                                </div>
                            </motion.div>

                            {/* Confidence Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-center"
                            >
                                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30">
                                    <Zap className="text-yellow-400" size={18} />
                                    <span className="text-white font-medium">
                                        Powered by Linear Regression ML Model
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default PredictionPage;
