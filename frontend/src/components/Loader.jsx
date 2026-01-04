import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CLOUDS from 'vanta/dist/vanta.clouds.min';
import * as THREE from 'three';

const systemLogs = [
    "INITIALIZING_NEURAL_NET...",
    "CONNECTING_TO_BLOCKCHAIN_NODES...",
    "DECRYPTING_MARKET_VECTORS...",
    "LOADING_PREDICTIVE_MODELS [v4.2]...",
    "OPTIMIZING_GPU_CLUSTERS...",
    "ACCESS_GRANTED."
];

const Loader = ({ setLoading }) => {
    const [logIndex, setLogIndex] = useState(0);
    const vantaRef = useRef(null);
    const [vantaEffect, setVantaEffect] = useState(null);

    useEffect(() => {
        if (!vantaEffect && vantaRef.current) {
            /* Vanta Disabled for performance
            setVantaEffect(CLOUDS({
                el: vantaRef.current,
                THREE: THREE,
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                skyColor: 0x0b0f19, // Deep Navy base
                cloudColor: 0x2a3b55, // Matches our accented panels
                cloudShadowColor: 0x001220,
                sunColor: 0x00e5ff, // Cyan glow
                sunGlareColor: 0x7c3aed, // Purple glare
                sunlightColor: 0x00e5ff,
                speed: 1.0
            }));
            */
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    useEffect(() => {
        // Log sequencing
        if (logIndex < systemLogs.length - 1) {
            const timeout = setTimeout(() => {
                setLogIndex(prev => prev + 1);
            }, 800); // Speed of logs
            return () => clearTimeout(timeout);
        } else {
            // Final delay before entry
            const finalTimeout = setTimeout(() => {
                setLoading(false);
            }, 1000);
            return () => clearTimeout(finalTimeout);
        }
    }, [logIndex, setLoading]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F19] overflow-hidden font-mono"
            exit={{
                opacity: 0,
                scale: 1.1,
                filter: "blur(10px)",
                transition: { duration: 0.8, ease: "easeInOut" }
            }}
        >
            {/* Vanta Cloud Background - Absolute & Behind Text */}
            <div ref={vantaRef} className="absolute inset-0 z-0 opacity-40"></div>

            {/* Overlay Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(11,15,25,0.2)_0%,_#0B0F19_90%)] z-0"></div>
            <div className="absolute inset-0 bg-grid-overlay opacity-20 z-0"></div>

            <div className="relative flex flex-col items-center z-10 w-full max-w-md px-6">

                {/* Reactor Core Animation */}
                <div className="relative w-24 h-24 mb-12 flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-t-2 border-l-2 border-cyan-400 opacity-60"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 rounded-full border-b-2 border-r-2 border-purple-500 opacity-60"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white]"
                    />
                </div>

                {/* Main Text Reveal */}
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, letterSpacing: "10px" }}
                        animate={{ opacity: 1, letterSpacing: "2px" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="text-3xl font-bold text-white metallic-text"
                    >
                        OMNI CAST
                    </motion.h1>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                        className="h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-4 mx-auto"
                    />
                </div>

                {/* Terminal Logs */}
                <div className="h-12 flex flex-col items-center justify-start overflow-hidden w-full">
                    <AnimatePresence mode='wait'>
                        <motion.p
                            key={logIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="text-xs text-cyan-400/80 tracking-widest"
                        >
                            {">"} {systemLogs[logIndex]} <span className="animate-pulse">_</span>
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Loading Bar */}
                <div className="w-64 h-1 bg-white/5 rounded-full mt-8 overflow-hidden">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 4.8, ease: "linear" }}
                        className="h-full bg-cyan-500 shadow-[0_0_10px_#00E5FF]"
                    />
                </div>

                {/* Footer ID */}
                <div className="absolute bottom-10 text-[10px] text-slate-600 tracking-[0.2em]">
                    SYSTEM_ID: OMNI_V3.0
                </div>
            </div>
        </motion.div>
    );
};

export default Loader;
