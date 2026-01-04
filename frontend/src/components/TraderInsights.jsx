import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Gauge, Zap } from 'lucide-react';

const TraderInsights = ({ indicators }) => {
    if (!indicators) return null;

    const { rsi, volatility, macd_hist, bb_width } = indicators;

    // Determine Signal Status
    let rsiStatus = "Neutral";
    let rsiColor = "text-slate-500";
    if (rsi > 70) { rsiStatus = "Overbought"; rsiColor = "text-red-500"; }
    else if (rsi < 30) { rsiStatus = "Oversold"; rsiColor = "text-teal-500"; }

    const macdStatus = macd_hist > 0 ? "Bullish" : "Bearish";
    const macdColor = macd_hist > 0 ? "text-green-500" : "text-red-500";

    const volStatus = bb_width > 0.1 ? "High Volatility" : "Stable";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
            {/* RSI Gauge */}
            <div className="glass-panel p-6 rounded-[2rem] relative overflow-hidden flex flex-col items-center justify-center group hover:bg-white/5 transition-colors border border-white/5">
                <div className="absolute top-4 left-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Momentum (RSI)</div>

                <div className="relative mt-4 w-32 h-16 overflow-hidden">
                    <div className="w-32 h-32 rounded-full border-8 border-white/5 border-t-white/10"></div>
                    <motion.div
                        initial={{ rotate: -90 }}
                        animate={{ rotate: -90 + (rsi / 100) * 180 }}
                        transition={{ duration: 1.5, type: "spring" }}
                        className="absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-transparent border-t-cyan-400 origin-center drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                    />
                </div>
                <div className="mt-[-10px] text-3xl font-bold text-white">{Math.round(rsi)}</div>
                <div className={`mt-1 text-sm font-bold ${rsiColor}`}>{rsiStatus}</div>
            </div>

            {/* MACD Trend */}
            <div className="glass-panel p-6 rounded-[2rem] flex flex-col justify-center items-center group hover:bg-white/5 transition-colors border border-white/5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Market Trend</div>

                <div className="flex items-center gap-3">
                    {macd_hist > 0 ? <TrendingUp size={32} className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]" /> : <TrendingDown size={32} className="text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.4)]" />}
                    <div className="flex flex-col">
                        <span className={`text-2xl font-bold ${macdColor}`}>{macdStatus}</span>
                        <span className="text-xs text-slate-500">MACD Histogram</span>
                    </div>
                </div>

                <div className="w-full bg-white/5 h-2 rounded-full mt-4 overflow-hidden relative">
                    <motion.div
                        className={`h-full absolute left-1/2 ${macd_hist > 0 ? 'bg-green-400 shadow-[0_0_10px_#4ade80]' : 'bg-red-400 shadow-[0_0_10px_#f87171]'}`}
                        initial={{ width: 0 }}
                        animate={{ width: Math.min(Math.abs(macd_hist) * 500, 50) + "%", x: macd_hist > 0 ? 0 : "-100%" }}
                        transition={{ duration: 1.5 }}
                    />
                </div>
            </div>

            {/* Volatility Pulse */}
            <div className="glass-panel p-6 rounded-[2rem] flex flex-col justify-center items-center group hover:bg-white/5 transition-colors relative overflow-hidden border border-white/5">
                <div className="absolute top-4 left-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Market Energy</div>

                <div className="relative flex items-center justify-center mt-2">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: bb_width > 0.1 ? 0.5 : 2, repeat: Infinity }}
                        className={`w-20 h-20 rounded-full blur-xl absolute ${bb_width > 0.1 ? 'bg-red-500/30' : 'bg-blue-500/30'}`}
                    />
                    <Zap size={40} className={`z-10 ${bb_width > 0.1 ? 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]' : 'text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]'}`} />
                </div>

                <div className="mt-4 text-lg font-bold text-white">{volStatus}</div>
                <div className="text-xs text-slate-500">Bollinger Band Width: {bb_width.toFixed(4)}</div>
            </div>

        </motion.div>
    );
};

export default TraderInsights;
