import React from 'react';
import { motion } from 'framer-motion';
import { History, TrendingUp } from 'lucide-react';

const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val * 90);
};

const formatDate = (dateObj) => {
    return dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

const AnalyticsTable = ({ history, forecast }) => {
    if (!history || !forecast) return null;

    // Take last 5 history points and next 10 forecast points
    const recentHistory = history.slice(-5).map((h, i) => ({
        ...h,
        type: 'Historical',
        timestamp: new Date(Date.now() - (5 - i) * 3600000) // Fake past timestamps for demo
    }));

    const upcomingForecast = forecast.slice(0, 10).map((f, i) => ({
        ...f,
        type: 'Forecast',
        timestamp: new Date(Date.now() + (i + 1) * 3600000)
    }));

    const combinedData = [...recentHistory, ...upcomingForecast];

    return (
        <div className="glass-panel rounded-[2rem] p-8 overflow-hidden border border-white/5">
            <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Detailed Market Ledger</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-slate-400 text-sm uppercase tracking-wider border-b border-white/10">
                            <th className="pb-4 font-semibold pl-4">Time Horizon</th>
                            <th className="pb-4 font-semibold">Status</th>
                            <th className="pb-4 font-semibold text-right pr-4">Price Assessment (INR)</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-300">
                        {combinedData.map((row, index) => (
                            <motion.tr
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                            >
                                <td className="py-4 pl-4 font-medium flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${row.type === 'Forecast' ? 'bg-purple-400 animate-pulse shadow-[0_0_8px_#c084fc]' : 'bg-slate-500'}`} />
                                    {formatDate(row.timestamp)}
                                </td>
                                <td className="py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${row.type === 'Forecast'
                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                        : 'bg-slate-500/20 text-slate-400 border border-slate-500/20'
                                        }`}>
                                        {row.type}
                                    </span>
                                </td>
                                <td className="py-4 text-right pr-4 font-bold font-mono text-slate-400 group-hover:text-white transition-colors">
                                    {formatCurrency(row.price)}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AnalyticsTable;
