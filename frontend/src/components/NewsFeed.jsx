import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, ExternalLink } from 'lucide-react';

const API_URL = ''; // Ensure this matches App.jsx

const NewsFeed = ({ selectedCoin }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                // If selectedCoin is something like "BTC", this endpoint works.
                const response = await axios.get(`${API_URL}/news/${selectedCoin}`);
                setNews(response.data.news || []);
            } catch (error) {
                console.error("Failed to fetch news", error);
                setNews([]);
            } finally {
                setLoading(false);
            }
        };

        if (selectedCoin) {
            fetchNews();
        }
    }, [selectedCoin]);

    return (
        <div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {news.map((item, index) => (
                            <motion.a
                                key={item.id}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group block glass-card p-0 rounded-2xl overflow-hidden hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-white/5"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 to-transparent z-10" />
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1518546305927-5a42099435d5?auto=format&fit=crop&q=80&w=500'; }} // Fallback
                                    />
                                    <span className="absolute bottom-3 left-4 z-20 text-xs font-bold text-white bg-cyan-500/80 px-2 py-1 rounded-md backdrop-blur-sm shadow-lg shadow-cyan-500/20">
                                        {item.source}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <h4 className="font-bold text-slate-200 mb-2 line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors">
                                        {item.title}
                                    </h4>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-xs text-slate-500">
                                            {new Date(item.published_on * 1000).toLocaleDateString()}
                                        </span>
                                        <ExternalLink size={14} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!loading && news.length === 0 && (
                <div className="text-center py-12 text-slate-400 bg-white/30 rounded-2xl">
                    No relevant news found for {selectedCoin} at this moment.
                </div>
            )}
        </div>
    );
};

export default React.memo(NewsFeed);
