import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val * 90);
};

const PredictionTable = ({ forecast, currentPrice }) => {
    if (!forecast || forecast.length === 0) return null;

    // Show next 4 steps as cards
    const nextSteps = forecast.slice(0, 4);

    return (
        <div className="grid grid-cols-2 gap-4">
            {nextSteps.map((item, i) => {
                const prevPrice = i === 0 ? currentPrice : nextSteps[i - 1].price;
                const change = ((item.price - prevPrice) / prevPrice) * 100;
                const isPositive = change >= 0;

                // Calculate future time
                const futureTime = new Date();
                futureTime.setHours(futureTime.getHours() + (i + 1));
                const timeString = futureTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });

                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + (i * 0.1), type: "spring", stiffness: 100 }}
                        whileHover={{ y: -10, rotateX: 5, rotateY: 5, scale: 1.02 }}
                        className="glass-card p-6 rounded-[2rem] flex flex-col justify-between h-40 cursor-pointer group border border-white/5 hover:border-cyan-500/30 transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider group-hover:text-cyan-400 transition-colors">
                                {timeString}
                            </span>
                            <div className={`p-2 rounded-full ${isPositive ? 'bg-green-500/20 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)]' : 'bg-red-500/20 text-red-400 shadow-[0_0_10px_rgba(248,113,113,0.2)]'}`}>
                                {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-2xl font-bold text-white tracking-tight group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-shadow">
                                {formatCurrency(item.price)}
                            </h4>
                            <span className={`text-sm font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                {isPositive ? '+' : ''}{change.toFixed(2)}%
                            </span>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default PredictionTable;
