import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

    useEffect(() => {
        // Interactive Matrix/Network effect with Canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (vantaRef.current) {
            vantaRef.current.innerHTML = '';
            vantaRef.current.appendChild(canvas);
        }

        let width, height;
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 3 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
                this.color = Math.random() > 0.5 ? '#00E5FF' : '#7C3AED';
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
            }
            update() {
                // Mouse Interaction Physics
                if (mouse.x) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let maxDistance = mouse.radius;
                    let force = (maxDistance - distance) / maxDistance;
                    let directionX = forceDirectionX * force * this.density;
                    let directionY = forceDirectionY * force * this.density;

                    if (distance < mouse.radius) {
                        this.x -= directionX;
                        this.y -= directionY;
                    } else {
                        this.x += this.speedX;
                        this.y += this.speedY;
                    }
                } else {
                    this.x += this.speedX;
                    this.y += this.speedY;
                }

                // Boundary check
                if (this.x > width) this.x = width;
                if (this.x < 0) this.x = 0;
                if (this.y > height) this.y = height;
                if (this.y < 0) this.y = 0;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = 0.8;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < 100; i++) particles.push(new Particle());
        };

        const animate = () => {
            if (!vantaRef.current) return;
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();

                // Draw connections if close
                particles.forEach(p2 => {
                    let dx = p.x - p2.x;
                    let dy = p.y - p2.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = p.color;
                        ctx.lineWidth = 0.2;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });

                // Connect to mouse
                if (mouse.x) {
                    let dx = p.x - mouse.x;
                    let dy = p.y - mouse.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = p.color;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        };

        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
        animate();

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (canvas.remove) canvas.remove();
        };
    }, []);

    useEffect(() => {
        // Log sequencing
        if (logIndex < systemLogs.length - 1) {
            const timeout = setTimeout(() => {
                setLogIndex(prev => prev + 1);
            }, 800);
            return () => clearTimeout(timeout);
        } else {
            const finalTimeout = setTimeout(() => {
                setLoading(false);
            }, 1000);
            return () => clearTimeout(finalTimeout);
        }
    }, [logIndex, setLoading]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F19] overflow-hidden font-mono cursor-pointer"
            onClick={() => setLoading(false)} // Skip on click
            exit={{
                opacity: 0,
                scale: 1.1,
                filter: "blur(10px)",
                transition: { duration: 0.8, ease: "easeInOut" }
            }}
        >
            {/* Background Container for Canvas */}
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
                        CRYPTO SIGHT
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

                <p className="mt-4 text-[10px] text-slate-500 animate-pulse">
                    [ Click anywhere to initialize instantly ]
                </p>

                {/* Footer ID */}
                <div className="absolute bottom-10 text-[10px] text-slate-600 tracking-[0.2em]">
                    SYSTEM_ID: CRYPTO_SIGHT_V3.0
                </div>
            </div>
        </motion.div>
    );
};

export default Loader;
