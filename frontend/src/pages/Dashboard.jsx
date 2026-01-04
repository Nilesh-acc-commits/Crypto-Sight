import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Hexagon, TrendingUp, Zap, Brain, Globe, Layers, Cpu } from 'lucide-react';
// import Tilt from 'react-parallax-tilt'; // Disabled for performance
import CryptoChart from '../components/CryptoChart';
import PredictionTable from '../components/PredictionTable';
import CoinSelector from '../components/CoinSelector';
import AnalyticsTable from '../components/AnalyticsTable';
import TraderInsights from '../components/TraderInsights';
import NewsFeed from '../components/NewsFeed';
import { saveHistory } from '../utils/history';

const API_URL = '';

const Dashboard = ({ user }) => {
    const [selectedCoin, setSelectedCoin] = useState('BTC');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_URL}/predict/${selectedCoin}/forecast?steps=168`);
                setData(response.data);

                // Save History with Price Details
                if (response.data) {
                    const currentPrice = response.data.current_price;
                    const predictedPrice = response.data.forecast && response.data.forecast.length > 0
                        ? response.data.forecast[0].price
                        : 0;

                    saveHistory(user, 'prediction', {
                        coin: selectedCoin,
                        current_price: currentPrice,
                        predicted_price: predictedPrice
                    });
                }

            } catch (err) {
                console.error("Dashboard Fetch Error", err);
                setError(err.response?.data?.detail || err.message || "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedCoin, user]);

    const currentPriceINR = data?.current_price ? data.current_price * 90 : 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-6 pb-20 relative z-10"
        >
            {/* Header Area */}
            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-xl mb-6">
                    <strong>Error:</strong> {error}
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 pt-4">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <h1 className="text-5xl lg:text-7xl font-bold text-white mb-2 tracking-tighter leading-tight font-display">
                        <span className="metallic-text">Omni</span><span className="neon-text">Cast</span>
                    </h1>
                    <p className="text-slate-400 text-lg">AI-Powered Market Intelligence</p>
                </motion.div>

                <div className="mb-2">
                    <CoinSelector selectedCoin={selectedCoin} onSelect={setSelectedCoin} />
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">

                {/* Main Price Card - Large */}
                <div className="md:col-span-3 animated-border rounded-[2rem]">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-panel rounded-[2rem] p-8 relative overflow-hidden group h-full"
                    >
                        {/* Scanner animation removed for performance */}
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="w-32 h-32 bg-cyan-400 rounded-full blur-2xl"></div>
                        </div>

                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-slate-400 font-medium tracking-wide uppercase text-xs">Current Price</span>
                                    <span className="w-2 h-2 rounded-full bg-green-500 live-pulse"></span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <AnimatePresence mode='popLayout'>
                                        <motion.span
                                            key={currentPriceINR}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="text-5xl font-bold text-white tracking-tight"
                                        >
                                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(currentPriceINR)}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                            </div>
                            <div className="p-3 rounded-full bg-white/5 border border-white/10">
                                <Activity className="text-cyan-400" size={24} />
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <div className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-bold flex items-center gap-2">
                                <TrendingUp size={16} /> Bullish
                            </div>

                        </div>
                    </motion.div>
                </div>

                {/* Stat Cards - Small */}
                {[
                    { label: '24h Volatility', value: 'Low', icon: Zap, color: 'text-yellow-400', border: 'border-yellow-500/20' },
                ].map((stat, i) => (
                    <div key={i} className="h-full">
                        <motion.div
                            key={stat.label} // Fixed unique key warning
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * (i + 1) }}
                            className={`glass-panel p-6 rounded-[2rem] flex flex-col justify-between hover:border-opacity-50 transition-colors ${stat.border} h-full`}
                        >
                            <div className="flex justify-between items-start">
                                <stat.icon className={stat.color} size={28} />
                                <span className="text-xs text-slate-500 uppercase font-bold text-right">{stat.label}</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mt-4">{stat.value}</h3>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
                <div className="lg:col-span-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel p-6 rounded-[2.5rem] relative"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Price Forecast</h3>
                            <div className="flex gap-2">
                                {['1H', '24H', '7D'].map(t => (
                                    <button key={t} className="px-3 py-1 text-xs font-bold rounded-md bg-white/5 hover:bg-white/10 text-slate-300 transition-colors">
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-[400px] w-full relative">
                            {loading ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500"></div>
                                </div>
                            ) : (
                                data && <CryptoChart history={data.history} forecast={data.forecast} />
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Predictions Side Panel */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="glass-panel p-6 rounded-[2rem] flex-1">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Cpu size={20} className="text-purple-400" />
                            Model Predictions
                        </h3>
                        {data && <PredictionTable forecast={data.forecast} currentPrice={data.current_price} />}
                    </div>
                </div>
            </div>

            {/* Additional Sections */}
            <div className="grid grid-cols-1 gap-6 mb-20">
                <div className="glass-panel p-6 rounded-[2rem]">
                    <h3 className="text-xl font-bold text-white mb-6">Market Insights</h3>
                    {data && data.technical_indicators && <TraderInsights indicators={data.technical_indicators} />}
                </div>
                <div className="glass-panel p-6 rounded-[2rem]">
                    <h3 className="text-xl font-bold text-white mb-6">Latest News</h3>
                    <NewsFeed selectedCoin={selectedCoin} />
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
