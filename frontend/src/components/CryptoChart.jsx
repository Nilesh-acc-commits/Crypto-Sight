import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CryptoChart = ({ history, forecast }) => {
    if (!history || !forecast) return null;

    const chartData = [
        ...history.map(d => ({ ...d, price: d.price * 90 })),
        ...forecast.map(d => ({ ...d, price: d.price * 90 }))
    ];

    return (
        <div style={{ width: '100%', height: '100%', minHeight: '350px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%" debounce={100}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="kineticGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="time"
                        hide={true}  // Clean minimalist look (no labels)
                    />
                    <YAxis
                        domain={['auto', 'auto']}
                        hide={true} // Clean minimalist look
                    />
                    <Tooltip
                        cursor={{ stroke: '#00E5FF', strokeWidth: 2, strokeDasharray: '4 4' }}
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
                            color: '#f8fafc',
                            padding: '12px 20px'
                        }}
                        itemStyle={{ color: '#00E5FF' }}
                        formatter={(value) => [`₹${value.toLocaleString()}`, '']}
                        labelFormatter={() => ''} // Hide label for cleaner look
                    />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#00E5FF"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#kineticGradient)"
                        isAnimationActive={false}
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default React.memo(CryptoChart);
