import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import axios from 'axios'; // Ensure axios is imported

const LoginPage = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSuccess = async (credentialResponse) => {
        console.log("Google Credential Received:", credentialResponse);
        try {
            // Send token to backend for verification
            const res = await axios.post('/auth/google', {
                token: credentialResponse.credential
            });

            console.log("Backend Verification Success:", res.data);
            onLoginSuccess(res.data.user); // Pass backend user object

        } catch (error) {
            console.error("Backend Verification Failed:", error);
            // Fallback or Alert User
            alert(error.response?.data?.detail || "Authentication Failed with Backend");
        }
    };

    const handleError = () => {
        console.log('Login Failed');
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) return;

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/signup';
            const res = await axios.post(endpoint, {
                email: email,
                password: password
            });

            console.log("Email Auth Success:", res.data);

            if (isLogin) {
                onLoginSuccess(res.data.user);
            } else {
                // After signup, automatically login or ask to login
                alert("Account created! Please log in.");
                setIsLogin(true); // Switch to login view
                setPassword('');
            }
        } catch (error) {
            console.error("Email Auth Failed:", error);
            alert(error.response?.data?.detail || "Authentication Failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen relative z-10 font-sans">
            <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-10 rounded-3xl shadow-2xl flex flex-col items-center max-w-md w-full"
            >
                <div className="mb-6 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                        OmniCast
                    </h1>
                    <h2 className="text-2xl font-semibold text-white mb-1">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        {isLogin ? 'Sign in to confirm your identity' : 'Join the AI-Driven Crypto Intelligence'}
                    </p>
                </div>

                {/* Google Login */}
                <div className="w-full flex justify-center mb-6">
                    <div className="p-1 bg-white/5 rounded-full">
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={handleError}
                            theme="filled_black"
                            shape="pill"
                            size="large"
                            text={isLogin ? "signin_with" : "signup_with"}
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full flex items-center justify-between mb-6">
                    <div className="h-px bg-slate-700 w-full"></div>
                    <span className="text-slate-500 text-xs px-2 uppercase">OR</span>
                    <div className="h-px bg-slate-700 w-full"></div>
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailLogin} className="w-full space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg transform transition-all active:scale-95"
                    >
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-slate-400 text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setEmail('');
                                setPassword('');
                            }}
                            className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-all"
                        >
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>

                <p className="text-slate-600 text-xs mt-8 text-center max-w-xs">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>

            </motion.div>
        </div>
    );
};

export default LoginPage;
