import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const TickerItem = ({ symbol, price, change, isPositive }) => (
    <div className="flex items-center gap-3 px-6 py-2 border-r border-white/5">
        <span className="font-bold text-white">{symbol}</span>
        <span className="text-slate-300">₹{price.toLocaleString()}</span>
        <span className={`flex items-center text-xs font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
            {change}%
        </span>
    </div>
);

const LandingPageTicker = () => {
    // Mock data for the ticker - in a real app this could fetch live global stats
    const tickerData = [
        { symbol: "BTC", price: 5845000, change: 2.4, isPositive: true },
        { symbol: "ETH", price: 345000, change: 1.8, isPositive: true },
        { symbol: "SOL", price: 12500, change: -0.5, isPositive: false },
        { symbol: "BNB", price: 48000, change: 0.2, isPositive: true },
        { symbol: "ADA", price: 45, change: -1.2, isPositive: false },
        { symbol: "XRP", price: 52, change: 0.8, isPositive: true },
        { symbol: "DOT", price: 650, change: -2.1, isPositive: false },
        { symbol: "DOGE", price: 12, change: 5.4, isPositive: true },
    ];

    return (
        <div className="w-full bg-[#0B0F19] border-y border-white/5 overflow-hidden py-3 relative z-20">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0B0F19] to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0B0F19] to-transparent z-10"></div>

            <div className="flex">
                <motion.div
                    className="flex shrink-0"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 20
                    }}
                >
                    {/* Double the list for seamless loop */}
                    {[...tickerData, ...tickerData].map((item, index) => (
                        <TickerItem key={`${item.symbol}-${index}`} {...item} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPageTicker;
