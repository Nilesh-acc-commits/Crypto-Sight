import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Layers, ArrowRight, Shield, Globe, Cpu, Lock } from 'lucide-react';
import LandingPageTicker from '../components/LandingPageTicker';

const LandingPage = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen relative overflow-x-hidden flex flex-col items-center bg-[#0B0F19] text-center w-full">

            {/* Background Effects */}
            <div className="fixed inset-0 w-full h-full bg-grid-overlay pointer-events-none z-0"></div>
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
            <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000 pointer-events-none"></div>

            {/* Navbar Placeholder/Logo Area */}
            <div className="w-full flex justify-between items-center px-6 md:px-12 py-6 relative z-30">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Crypto Sight Logo" className="w-8 h-8 object-contain" />
                    <span className="font-bold text-white tracking-wide text-lg">Crypto Sight</span>
                </div>
                <button onClick={onGetStarted} className="px-4 py-2 rounded-full border border-white/10 text-sm font-medium hover:bg-white/5 text-slate-300 transition-colors">
                    Login
                </button>
            </div>

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-5xl mx-auto pt-20 pb-32 px-6"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-8 flex justify-center"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500/30 blur-3xl rounded-full"></div>
                        <img src="/logo.png" alt="Crypto Sight Logo" className="w-32 h-32 object-contain relative z-10 drop-shadow-2xl" />
                    </div>
                </motion.div>

                <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-6 font-display overflow-visible leading-[1.1]">
                    <span className="metallic-text inline-block overflow-visible pr-4 pb-2">Crypto</span>
                    <span className="neon-text inline-block overflow-visible pb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Sight</span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                    The Next Generation of <span className="text-cyan-400 font-semibold">AI-Powered</span> Cryptocurrency Intelligence.
                </p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onGetStarted}
                    className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-full flex items-center gap-3 mx-auto shadow-2xl shadow-cyan-500/20"
                >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10 text-white font-bold text-lg tracking-wide uppercase">Launch Terminal</span>
                    <ArrowRight className="relative z-10 text-white group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </motion.div>

            {/* Live Ticker */}
            <div className="w-full relative z-20 mb-32 transform -skew-y-1">
                <LandingPageTicker />
            </div>

            {/* Deep Dive Features */}
            <div className="w-full max-w-7xl mx-auto px-6 mb-32 relative z-10">
                <div className="text-left mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Engineered for <span className="text-cyan-400">Alpha</span>.</h2>
                    <p className="text-xl text-slate-400 max-w-2xl">Stop guessing. Start knowing. Our neural networks process millions of data points to give you the edge.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Feature 1: AI Prediction */}
                    <div className="md:col-span-2 glass-panel p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden group border border-white/5 bg-[#0F1523]/50">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-6 border border-purple-500/30">
                                    <BrainIcon />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">Neural Predictive Modeling</h3>
                                <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                                    Proprietary LSTM & Transformer architecture trained on 5 years of OHLCV data.
                                    Our models detect non-linear patterns invisible to traditional technical analysis.
                                </p>
                            </div>
                            <div className="mt-8 flex gap-4">
                                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300">Bi-Directional LSTM</div>
                                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300">Attention Mechanisms</div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: Sentiment */}
                    <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden group border border-white/5 bg-[#0F1523]/50">
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 border border-cyan-500/30">
                                <Globe size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Global Sentiment</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Real-time NLP analysis of thousands of news sources and social signals. We quantify the market's "Fear & Greed" instantly.
                            </p>
                        </div>
                    </div>

                    {/* Feature 3: Wealth Calc */}
                    <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden group border border-white/5 bg-[#0F1523]/50">
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-400 mb-6 border border-green-500/30">
                                <Layers size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Portfolio Simulation</h3>
                            <p className="text-slate-400 leading-relaxed">
                                "What if" scenarios made easy. Project potential returns based on our AI's confidence intervals and volatility forecasts.
                            </p>
                        </div>
                    </div>

                    {/* Feature 4: Security */}
                    <div className="md:col-span-2 glass-panel p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden group border border-white/5 bg-[#0F1523]/50 flex items-center">
                        <div className="flex-1 pr-6 relative z-10">
                            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6 border border-blue-500/30">
                                <Shield size={28} />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">Enterprise-Grade Security</h3>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Your data never leaves the encrypted fortress. Built on Firebase's robust infrastructure with strict RLS policies and secure OAuth authentication.
                            </p>
                        </div>
                        <div className="hidden md:flex w-1/3 justify-center items-center relative h-full min-h-[160px]">
                            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full transform translate-x-4"></div>
                            <div className="relative z-10 bg-[#0B0F19]/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-500/30 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <Shield size={64} className="text-blue-400" />
                                <div className="absolute -bottom-3 -right-3 bg-green-500 p-2 rounded-xl border-4 border-[#0B0F19] shadow-lg">
                                    <Lock size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="w-full bg-black/20 py-32 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Workflow Simplified</h2>
                        <p className="text-slate-400">From setup to insight in less than 60 seconds.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 border-t border-dashed border-slate-700 z-0"></div>

                        {[
                            { step: "01", title: "Authenticate", desc: "Securely sign in via Google or Email to create your persistent profile.", icon: Shield },
                            { step: "02", title: "Select Asset", desc: "Choose from top market-cap coins to instantly generate AI forecasts.", icon: Activity },
                            { step: "03", title: "Strategize", desc: "Use data-backed insights to inform your entry and exit points.", icon: Zap }
                        ].map((s, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-[#0B0F19] border border-white/10 rounded-full flex items-center justify-center mb-8 shadow-xl group-hover:border-cyan-500/50 transition-colors duration-500">
                                    <s.icon className="text-cyan-400" size={32} />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-3">{s.title}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full border-t border-white/5 bg-[#05080F] pt-20 pb-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                    <div className="text-left">
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/logo.png" alt="Crypto Sight Logo" className="w-8 h-8 object-contain opacity-80" />
                            <span className="font-bold text-white text-lg">Crypto Sight</span>
                        </div>
                        <p className="text-slate-500 text-sm max-w-xs">
                            Empowering traders with institutional-grade AI analytics.
                        </p>
                    </div>
                    <div className="flex gap-8 text-slate-400 text-sm font-medium">
                        <a href="#" className="hover:text-cyan-400 transition-colors">Methodology</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
                    </div>
                </div>
                <div className="text-center md:text-left text-slate-600 text-xs pt-8 border-t border-white/5 max-w-7xl mx-auto">
                    &copy; 2026 Crypto Sight. All rights reserved. Data provided for informational purposes only.
                </div>
            </footer>
        </div>
    );
};

// Simple internal icon component for Brain if lucide doesn't have it explicitly or if we want custom
const BrainIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
);

export default LandingPage;
