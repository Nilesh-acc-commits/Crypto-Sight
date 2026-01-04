import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Layers, ArrowRight } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center text-center px-6">

            {/* Background Effects */}
            <div className="absolute inset-0 w-full h-full bg-grid-overlay pointer-events-none z-0"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-4xl mx-auto"
            >
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-8 flex justify-center"
                >
                    <img src="/logo.png" alt="OmniCast Logo" className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]" />
                </motion.div>

                {/* Hero Text */}
                <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-6 font-display">
                    <span className="metallic-text">Omni</span><span className="neon-text">Cast</span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                    The Next Generation of <span className="text-cyan-400 font-semibold">AI-Powered</span> Cryptocurrency Intelligence.
                </p>

                {/* Feature Grid - Mini */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
                    {[
                        { icon: Activity, title: "Precise Predictions", desc: "Advanced ML models forecasting market moves." },
                        { icon: Zap, title: "Real-time Analysis", desc: "Live market data processed instantly." },
                        { icon: Layers, title: "Wealth Calculator", desc: "Simulate future portfolio growth." }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (idx * 0.1) }}
                            className="glass-panel p-6 rounded-2xl hover:bg-white/5 transition-colors border border-white/5"
                        >
                            <feature.icon className="text-cyan-400 mb-3" size={32} />
                            <h3 className="text-white font-bold text-lg mb-1">{feature.title}</h3>
                            <p className="text-slate-400 text-sm">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onGetStarted}
                    className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-full flex items-center gap-3 mx-auto"
                >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity blur-md"></div>
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10 text-white font-bold text-lg tracking-wide uppercase">Launch Terminal</span>
                    <ArrowRight className="relative z-10 text-white group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <p className="mt-6 text-slate-500 text-sm">Powered by Advanced Machine Learning</p>
            </motion.div>
        </div>
    );
};

export default LandingPage;
