import axios from 'axios';

const API_URL = '';

export const saveHistory = async (user, type, details) => {
    if (!user || !user.email) return;

    try {
        await axios.post(`${API_URL}/history/add`, {
            email: user.email,
            type: type, // 'prediction', 'calculation', 'compare'
            details: details,
            timestamp: Date.now() / 1000
        });
        console.log(`History saved: ${type}`);
    } catch (error) {
        console.error("Failed to save history:", error);
    }
};
