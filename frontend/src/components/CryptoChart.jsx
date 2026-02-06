import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CryptoChart = ({ history, forecast }) => {
    if (!history || !forecast) return null;

    // Prepare data with distinct keys for History vs Forecast
    const lastHistory = history[history.length - 1];

    const processedHistory = history.map(d => ({
        time: d.time || d.timestamp,
        priceHistory: d.price * 90,
        priceForecast: null
    }));

    // Start forecast from the last history point to ensure continuity
    const processedForecast = forecast.map(d => ({
        time: d.time || d.timestamp,
        priceHistory: null,
        priceForecast: d.price * 90
    }));

    if (lastHistory) {
        processedForecast.unshift({
            time: lastHistory.time || lastHistory.timestamp,
            priceHistory: null,
            priceForecast: lastHistory.price * 90,
            isConnector: true // Marker for potential styling if needed
        });
    }

    const chartData = [...processedHistory, ...processedForecast];

    return (
        <div style={{ width: '100%', height: '100%', minHeight: '350px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%" debounce={100}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="time"
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={40}
                        tickFormatter={(time) => {
                            const date = new Date(time);
                            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                        }}
                    />
                    <YAxis
                        domain={['auto', 'auto']}
                        orientation="right"
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value.toLocaleString()}`}
                        width={70}
                    />
                    <Tooltip
                        cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                            padding: '12px'
                        }}
                        labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontSize: '12px' }}
                        formatter={(value, name) => [
                            `₹${value.toLocaleString()}`,
                            name // Recharts passes the 'name' prop from <Area>, so we can just use it directly.
                        ]}
                        labelFormatter={(label) => {
                            const date = new Date(label);
                            return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                        }}
                    />

                    {/* Past Data Line (Solid, Grey/White) */}
                    <Area
                        type="monotone"
                        dataKey="priceHistory"
                        name="Past Price"
                        stroke="#cbd5e1"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#historyGradient)"
                        animationDuration={1000}
                    />

                    {/* Forecast Data Line (Dashed, Cyan) */}
                    <Area
                        type="monotone"
                        dataKey="priceForecast"
                        name="AI Forecast"
                        stroke="#00E5FF"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        fillOpacity={1}
                        fill="url(#forecastGradient)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default React.memo(CryptoChart);
