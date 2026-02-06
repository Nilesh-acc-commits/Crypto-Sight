import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, ShieldCheck, Clock, Activity, Calculator, ArrowRightLeft } from 'lucide-react';
import { db } from '../firebase-config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const Profile = ({ user }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user?.uid) return;
            try {
                const historyRef = collection(db, "users", user.uid, "history");
                const q = query(historyRef, orderBy("timestamp", "desc"));
                const querySnapshot = await getDocs(q);

                const historyData = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    // Convert Firestore timestamp to seconds for compatibility with existing format
                    timestamp: doc.data().timestamp?.seconds || Date.now() / 1000
                }));

                setHistory(historyData);
            } catch (err) {
                console.error("Failed to fetch history from Firestore", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user]);

    const getIcon = (type) => {
        switch (type) {
            case 'prediction': return <Activity size={16} className="text-cyan-400" />;
            case 'calculation': return <Calculator size={16} className="text-purple-400" />;
            case 'compare': return <ArrowRightLeft size={16} className="text-green-400" />;
            default: return <Clock size={16} className="text-slate-400" />;
        }
    };

    const formatTime = (ts) => {
        return new Date(ts * 1000).toLocaleString();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto px-6 py-10"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="md:col-span-1 glass-panel p-8 rounded-[2rem] relative overflow-hidden h-fit">
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <div className="w-64 h-64 bg-cyan-400 rounded-full blur-[100px]"></div>
                    </div>

                    <div className="relative z-10 text-center">
                        {/* Avatar */}
                        <div className="w-24 h-24 mx-auto mb-6 relative">
                            {user.picture ? (
                                <img
                                    src={user.picture}
                                    alt={user.name}
                                    className="w-full h-full object-cover rounded-full border-4 border-white/10 shadow-xl"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 border-white/10 shadow-xl">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-[#0B0F19]"></div>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
                        <p className="text-slate-400 text-sm flex items-center justify-center gap-2 mb-6 break-all">
                            <Mail size={14} /> {user.email}
                        </p>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-left">
                            <span className="text-xs text-slate-500 uppercase font-bold block mb-2">Account Type</span>
                            <div className="flex items-center gap-2 text-white font-medium text-sm">
                                <ShieldCheck size={18} className={user.picture ? "text-green-400" : "text-blue-400"} />
                                <span>{user.picture ? "Google Account" : "Email Account"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div className="md:col-span-2 glass-panel p-8 rounded-[2rem] relative overflow-hidden min-h-[400px]">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Clock size={20} className="text-cyan-400" />
                        Activity History
                    </h3>

                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center text-slate-500 py-10">
                            <p>No activity recorded yet.</p>
                            <p className="text-sm mt-2">Start exploring the dashboard to build your history!</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {history.map((item, index) => (
                                <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-start gap-4 hover:bg-white/10 transition-colors">
                                    <div className="p-2 bg-black/20 rounded-lg">
                                        {getIcon(item.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-medium capitalize">
                                                {item.type === 'prediction' && `Viewed ${item.details.coin} Forecast`}
                                                {item.type === 'calculation' && `Wealth Calculation`}
                                                {item.type === 'compare' && `Compared Coins`}
                                            </h4>
                                            <span className="text-xs text-slate-500">{formatTime(item.timestamp)}</span>
                                        </div>
                                        <p className="text-slate-400 text-sm mt-1">
                                            {item.type === 'prediction' && (
                                                <span>
                                                    Checked {item.details.coin}.
                                                    <span className="ml-2 text-slate-500">
                                                        Act: {item.details.current_price ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.details.current_price * 90) : 'N/A'} |
                                                        Pred: {item.details.predicted_price ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.details.predicted_price * 90) : 'N/A'}
                                                    </span>
                                                </span>
                                            )}
                                            {item.type === 'calculation' && `Calculated returns for ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.details.investment)} investment`}
                                            {item.type === 'compare' && `Compared ${item.details.coin1} vs ${item.details.coin2}`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
