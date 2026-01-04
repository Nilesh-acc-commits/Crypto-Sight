import React from 'react';
import { LayoutDashboard, Wallet, ArrowRightLeft, Settings, LogOut, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Price Dashboard', active: true },
    ];

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed left-6 top-6 bottom-6 w-20 lg:w-64 glass-card rounded-[2rem] text-slate-300 flex flex-col p-6 z-50 border border-white/5"
        >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-cyan-500/30">
                    F
                </div>
                <span className="text-xl font-bold hidden lg:block tracking-wide text-white">OmniCast</span>
            </div>

            {/* Menu */}
            <nav className="flex-1 space-y-2">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group relative overflow-hidden
              ${item.active
                                ? 'bg-white/10 text-white shadow-lg shadow-cyan-500/10 border border-white/5'
                                : 'text-slate-500 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        {item.active && (
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-50" />
                        )}
                        {item.active && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-r-full shadow-[0_0_10px_#22d3ee]"></div>
                        )}
                        <item.icon size={20} className={`${item.active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}`} />
                        <span className="font-medium hidden lg:block">{item.label}</span>
                    </div>
                ))}
            </nav>

            {/* User / Logout */}
            <div className="mt-auto pt-6 border-t border-white/5 px-2">
                <div className="flex items-center gap-3 text-slate-500 hover:text-white cursor-pointer transition-colors group">
                    <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
                    <span className="font-medium hidden lg:block">Log Out</span>
                </div>
            </div>
        </motion.div>
    );
};

export default Sidebar;
