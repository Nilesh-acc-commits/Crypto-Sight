import React, { useState } from 'react';
import { motion } from 'framer-motion';
// Firebase Imports
import { auth, googleProvider, db } from '../firebase-config';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const LoginPage = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Sync user to Firestore on Login/Signup
    const syncUserToFirestore = async (user) => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // Create new user profile
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                name: user.displayName || user.email.split('@')[0],
                photoURL: user.photoURL,
                createdAt: new Date(),
                plan: "free"
            });
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            await syncUserToFirestore(user);

            // Standardize user object for App
            onLoginSuccess({
                email: user.email,
                name: user.displayName || user.email.split('@')[0],
                uid: user.uid,
                photoURL: user.photoURL
            });
        } catch (error) {
            console.error("Google Auth Error:", error);
            alert(error.message);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let userCredential;
            if (isLogin) {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            } else {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
            }
            const user = userCredential.user;
            await syncUserToFirestore(user);

            onLoginSuccess({
                email: user.email,
                name: user.displayName || user.email.split('@')[0],
                uid: user.uid,
                photoURL: user.photoURL
            });

        } catch (error) {
            console.error("Auth Error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
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
                        Crypto Sight
                    </h1>
                    <h2 className="text-2xl font-semibold text-white mb-1">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        {isLogin ? 'Sign in to confirm your identity' : 'Join the AI-Driven Crypto Intelligence'}
                    </p>
                </div>

                {/* Google Login Button (Custom UI triggering Firebase Popup) */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-medium py-3 rounded-full hover:bg-slate-100 transition-all mb-6"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    {isLogin ? "Sign in with Google" : "Sign up with Google"}
                </button>

                {/* Divider */}
                <div className="w-full flex items-center justify-between mb-6">
                    <div className="h-px bg-slate-700 w-full"></div>
                    <span className="text-slate-500 text-xs px-2 uppercase">OR</span>
                    <div className="h-px bg-slate-700 w-full"></div>
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailAuth} className="w-full space-y-4">
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
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
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
