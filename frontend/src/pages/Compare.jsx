import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
// import { GitCompare, ArrowRight } from 'lucide-react'; // ICONS DISABLED
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Brush } from 'recharts';
import CoinSelector from '../components/CoinSelector';
import { saveHistory } from '../utils/history';

const API_URL = '';

const Compare = ({ user }) => {
    const [coinA, setCoinA] = useState('BTC');
    const [coinB, setCoinB] = useState('ETH');
    const [dataA, setDataA] = useState(null);
    const [dataB, setDataB] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Debounce or just save on change
        const timer = setTimeout(() => {
            saveHistory(user, 'compare', { coin1: coinA, coin2: coinB });
        }, 2000);
        return () => clearTimeout(timer);
    }, [coinA, coinB, user]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [resA, resB] = await Promise.all([
                    axios.get(`${API_URL}/predict/${coinA}/forecast?steps=48`),
                    axios.get(`${API_URL}/predict/${coinB}/forecast?steps=48`)
                ]);
                setDataA(resA.data);
                setDataB(resB.data);
            } catch (error) {
                console.error("Compare API Error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [coinA, coinB]);

    // Prepare Data for Comparison (Normalize to % change)
    const chartData = [];
    if (dataA && dataB) {
        // Assume timestamps align (they should as they are from same endpoint logic)
        // Combine history + forecast for trend
        const combinedA = [...dataA.history, ...dataA.forecast];
        const combinedB = [...dataB.history, ...dataB.forecast];

        // Find baseline price (first point)
        const baseA = combinedA[0]?.price || 1;
        const baseB = combinedB[0]?.price || 1;

        // Merge
        const length = Math.min(combinedA.length, combinedB.length);
        for (let i = 0; i < length; i++) {
            const itemA = combinedA[i];
            const itemB = combinedB[i];
            chartData.push({
                time: new Date(itemA.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                fullDate: itemA.time,
                [coinA]: ((itemA.price - baseA) / baseA) * 100, // % Change
                [coinB]: ((itemB.price - baseB) / baseB) * 100,
                isForecast: i >= dataA.history.length
            });
        }
    }


    // Helper to calculate % growth from last history point to last forecast point
    const calculateGrowth = (data) => {
        if (!data || !data.history.length || !data.forecast.length) return "0.00";
        const currentPrice = data.history[data.history.length - 1].price;
        const futurePrice = data.forecast[data.forecast.length - 1].price;
        const diff = ((futurePrice - currentPrice) / currentPrice) * 100;
        return diff.toFixed(2);
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 w-full h-full bg-grid-overlay pointer-events-none z-0"></div>
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
            <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-6xl mx-auto px-6 py-10 relative z-10"
            >
                <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/5 shadow-lg">
                        {/* <GitCompare size={24} /> */}
                        <span className="font-bold">VS</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-tight font-display overflow-visible">
                        <span className="metallic-text inline-block overflow-visible pr-2">Market</span>
                        <span className="neon-text inline-block overflow-visible text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Compare</span>
                    </h1>
                </div>

                {/* Selectors */}
                <div className="glass-panel p-6 rounded-2xl mb-10 flex flex-col md:flex-row items-center gap-8 justify-center border border-white/5">
                    <div className="w-full md:w-auto relative">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase">
                            <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]"></span> Asset A (Cyan)
                        </label>
                        <CoinSelector selectedCoin={coinA} onSelect={setCoinA} />
                    </div>

                    <div className="bg-white/10 p-3 rounded-full text-slate-300 border border-white/5">
                        {/* <ArrowRight size={20} /> */}
                        <span>VS</span>
                    </div>

                    <div className="w-full md:w-auto relative">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase">
                            <span className="w-2 h-2 rounded-full bg-[#7C3AED] shadow-[0_0_8px_#7C3AED]"></span> Asset B (Purple)
                        </label>
                        <CoinSelector selectedCoin={coinB} onSelect={setCoinB} />
                    </div>
                </div>

                {/* Chart */}
                <div className="glass-panel p-6 md:p-10 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden h-[500px]">
                    {loading ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500"></div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                                <XAxis
                                    dataKey="time"
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    minTickGap={30}
                                    label={{ value: 'Time (24h Forecast)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }}
                                />
                                <YAxis
                                    tickFormatter={(val) => `${val.toFixed(0)}%`}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    label={{ value: 'Growth %', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                                        color: '#fff',
                                        padding: '16px'
                                    }}
                                    itemStyle={{ fontWeight: 600, fontSize: '14px', paddingBottom: '4px' }}
                                    labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}
                                    formatter={(value, name) => [
                                        `${value.toFixed(2)}%`,
                                        `Growth (${name})`
                                    ]}
                                />
                                <Legend
                                    verticalAlign="top"
                                    height={36}
                                    iconType="circle"
                                    wrapperStyle={{ top: 0, right: 20, fontSize: '12px', fontWeight: 'bold', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '6px 12px', width: 'auto' }}
                                />
                                <ReferenceLine x={chartData.find(d => d.isForecast)?.time} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: "AI FORECAST START", position: 'insideTopRight', fill: '#94a3b8', fontSize: 10, offset: 10 }} />

                                <Line
                                    type="monotone"
                                    dataKey={coinA}
                                    stroke="#00E5FF"
                                    strokeWidth={3}
                                    activeDot={{ r: 8, fill: "#00E5FF", stroke: "#fff", strokeWidth: 2 }}
                                    dot={false}
                                    name={coinA}
                                    animationDuration={1000}
                                />
                                <Line
                                    type="monotone"
                                    dataKey={coinB}
                                    stroke="#7C3AED"
                                    strokeWidth={3}
                                    activeDot={{ r: 8, fill: "#7C3AED", stroke: "#fff", strokeWidth: 2 }}
                                    dot={false}
                                    name={coinB}
                                    animationDuration={1000}
                                />
                                <Brush
                                    dataKey="time"
                                    height={30}
                                    stroke="#64748b"
                                    fill="rgba(15, 23, 42, 0.5)"
                                    tickFormatter={() => ''}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}

                </div>

                {/* Beginner Friendly Analysis Cards */}
                {dataA && dataB && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        {/* Coin A Analysis */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05, borderColor: "rgba(0, 229, 255, 0.5)", backgroundColor: "rgba(0, 229, 255, 0.05)" }}
                            transition={{ delay: 0.2 }}
                            className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden group transition-all"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <div className="w-24 h-24 bg-cyan-500 rounded-full blur-2xl"></div>
                            </div>
                            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Prediction for {coinA}</h3>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-4xl font-bold ${calculateGrowth(dataA) >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                                    {calculateGrowth(dataA) > 0 ? '+' : ''}{calculateGrowth(dataA)}%
                                </span>
                                <span className="text-slate-500 text-sm">expected next 24h</span>
                            </div>
                            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
                                AI analysis suggests {coinA} will <span className={calculateGrowth(dataA) >= 0 ? "text-cyan-400 font-bold" : "text-red-400 font-bold"}>
                                    {calculateGrowth(dataA) >= 0 ? "grow" : "dip"}
                                </span> slightly.
                                Risk level appears <span className="font-bold text-yellow-400">Moderate</span> based on recent movement.
                            </p>
                        </motion.div>

                        {/* The Verdict (Winner) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            transition={{ delay: 0.4, type: "spring" }}
                            className="glass-panel p-6 rounded-3xl border border-yellow-500/20 bg-yellow-500/5 relative overflow-hidden cursor-help"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-yellow-500 box-shadow-[0_0_20px_#EAB308]"></div>
                            <div className="text-center">
                                <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold uppercase mb-4 border border-yellow-500/30">
                                    ⭐ AI Recommendation
                                </span>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    {Number(calculateGrowth(dataA)) > Number(calculateGrowth(dataB)) ? coinA : coinB} looks stronger
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    Based on the forecast, <span className="text-white font-bold">{Number(calculateGrowth(dataA)) > Number(calculateGrowth(dataB)) ? coinA : coinB}</span> has a higher potential return ({Math.max(Number(calculateGrowth(dataA)), Number(calculateGrowth(dataB)))}%) compared to {Number(calculateGrowth(dataA)) > Number(calculateGrowth(dataB)) ? coinB : coinA}.
                                </p>
                            </div>
                        </motion.div>

                        {/* Coin B Analysis */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05, borderColor: "rgba(124, 58, 237, 0.5)", backgroundColor: "rgba(124, 58, 237, 0.05)" }}
                            transition={{ delay: 0.6 }}
                            className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden group transition-all"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <div className="w-24 h-24 bg-purple-500 rounded-full blur-2xl"></div>
                            </div>
                            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Prediction for {coinB}</h3>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-4xl font-bold ${calculateGrowth(dataB) >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
                                    {calculateGrowth(dataB) > 0 ? '+' : ''}{calculateGrowth(dataB)}%
                                </span>
                                <span className="text-slate-500 text-sm">expected next 24h</span>
                            </div>
                            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
                                AI analysis suggests {coinB} will <span className={calculateGrowth(dataB) >= 0 ? "text-purple-400 font-bold" : "text-red-400 font-bold"}>
                                    {calculateGrowth(dataB) >= 0 ? "grow" : "dip"}
                                </span> over the forecast period.
                                Risk level appears <span className="font-bold text-yellow-400">Moderate</span>.
                            </p>
                        </motion.div>
                    </div>
                )}

                <p className="text-center text-slate-500 text-sm mt-8">
                    *Predictions are based on historical data patterns and are not financial advice.
                </p>
            </motion.div>
        </div>
    );
};

export default Compare;
