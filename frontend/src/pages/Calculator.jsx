import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
// import { DollarSign, clock, TrendingUp, Wallet } from 'lucide-react'; // ICONS DISABLED
import CoinSelector from '../components/CoinSelector';
import { saveHistory } from '../utils/history';

const API_URL = '';

const Calculator = ({ user }) => {
    const [selectedCoin, setSelectedCoin] = useState('BTC');
    const [amount, setAmount] = useState(10000);
    const [days, setDays] = useState(7); // Max 7
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch full week forecast (168 hours)
                const response = await axios.get(`${API_URL}/predict/${selectedCoin}/forecast?steps=168`);
                setData(response.data);
            } catch (error) {
                console.error("Calc API Error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedCoin]);

    // Calculate ROI
    const calculateReturns = () => {
        if (!data || !data.forecast) return { finalValue: 0, profit: 0, percent: 0 };

        const currentPrice = data.current_price;
        // Get price at (days * 24) hours index.
        const targetIndex = Math.min((days * 24) - 1, data.forecast.length - 1);
        const futurePrice = targetIndex >= 0 ? data.forecast[targetIndex].price : currentPrice;

        const percentChange = ((futurePrice - currentPrice) / currentPrice); // e.g. 0.05 for 5%
        const profit = amount * percentChange;
        const finalValue = amount + profit;

        return { finalValue, profit, percent: percentChange * 100 };
    };

    const result = calculateReturns();
    const isProfit = result.profit >= 0;

    useEffect(() => {
        const timer = setTimeout(() => {
            saveHistory(user, 'calculation', {
                coin: selectedCoin,
                amount: amount,
                days: days,
                investment: amount
            });
        }, 2000); // 2 second debounce to capture final value logic
        return () => clearTimeout(timer);
    }, [amount, selectedCoin, days, user]);


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto px-6 py-10"
        >
            <h1 className="text-4xl font-bold text-white mb-2">Future Wealth Calculator 💸</h1>
            <p className="text-slate-400 mb-12">See how your investment grows with AI-predicted market moves.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Controls */}
                <div className="space-y-8">
                    <motion.div
                        whileHover={{ scale: 1.02, borderColor: "rgba(255, 255, 255, 0.2)" }}
                        whileTap={{ scale: 0.98 }}
                        className="glass-panel p-6 rounded-2xl border border-white/5 transition-colors"
                    >
                        <label className="block text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Select Asset</label>
                        <CoinSelector selectedCoin={selectedCoin} onSelect={setSelectedCoin} />
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02, borderColor: "rgba(255, 255, 255, 0.2)" }}
                        className="glass-panel p-6 rounded-2xl border border-white/5 transition-colors"
                    >
                        <label className="block text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Investment Amount (INR)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full bg-white/10 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder-slate-400 hover:bg-white/20"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02, borderColor: "rgba(255, 255, 255, 0.2)" }}
                        className="glass-panel p-6 rounded-2xl border border-white/5 transition-colors"
                    >
                        <label className="block text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Duration: {days} Days</label>
                        <input
                            type="range"
                            min="1"
                            max="7"
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                            <span>1 Day</span>
                            <span>1 Week</span>
                        </div>
                    </motion.div>
                </div>

                {/* Result Card */}
                <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${isProfit ? 'from-teal-400 to-emerald-500' : 'from-red-400 to-orange-500'} rounded-[2.5rem] blur-xl opacity-20 animate-pulse`} />
                    <motion.div
                        key={result.finalValue} // Trigger animation on value change
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl h-full flex flex-col justify-center items-center text-center overflow-hidden"
                    >
                        {/* Background flash effect */}
                        <motion.div
                            key={`flash-${result.finalValue}`}
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`absolute inset-0 ${isProfit ? 'bg-green-500' : 'bg-red-500'}`}
                        />

                        {loading ? (
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
                        ) : (
                            <>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 z-10 ${isProfit ? 'bg-teal-500/20 text-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.3)]' : 'bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(248,113,113,0.3)]'}`}>
                                    <span className="text-2xl font-bold">₹</span>
                                </div>

                                <h3 className="text-slate-400 font-medium text-lg mb-2 z-10">Projected Value</h3>

                                {/* Animated Count Up using layout animation */}
                                <motion.div
                                    className="text-6xl font-bold text-white mb-4 tracking-tight z-10"
                                >
                                    ₹{result.finalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </motion.div>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className={`text-xl font-bold ${isProfit ? 'text-green-400 border-green-500/30' : 'text-red-400 border-red-500/30'} bg-white/5 px-4 py-2 rounded-full shadow-sm border z-10`}
                                >
                                    {isProfit ? '+' : ''}{result.profit.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({result.percent.toFixed(2)}%)
                                </motion.div>

                                <p className="text-slate-500 text-sm mt-8 max-w-xs z-10">
                                    Based on AI analysis of recent {selectedCoin} trends for the next {days * 24} hours. Past performance is not indicative of future results.
                                </p>
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Calculator;
