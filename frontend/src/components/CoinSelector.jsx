import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const COINS = ['BTC', 'ETH', 'BNB', 'ADA', 'DOGE'];

const CoinSelector = ({ selectedCoin, onSelect }) => {
    return (
        <div className="relative group z-50">
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
            >
                <select
                    value={selectedCoin}
                    onChange={(e) => onSelect(e.target.value)}
                    className="appearance-none bg-white/10 backdrop-blur-md border border-white/10 text-white py-3 pl-6 pr-12 rounded-full leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-bold shadow-lg shadow-black/20 cursor-pointer hover:bg-white/20 transition-colors"
                >
                    {COINS.map(coin => (
                        <option key={coin} value={coin} className="bg-[#0B0F19] text-white">{coin} Network</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-cyan-400">
                    <ChevronDown size={20} strokeWidth={3} />
                </div>
            </motion.div>
        </div>
    );
};

export default CoinSelector;
