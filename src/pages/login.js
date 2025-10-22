// src/pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../utils/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import FeedPreview from '../components/FeedPreview'; // NEW

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast.success("Login successful! Welcome back.");
            // Redirection is now handled robustly by AuthContext and AppShell
        } catch (error) {
            let message = "Failed to log in. Check your credentials.";
            if (error.code === 'auth/user-not-found') {
                message = "No account found with this email.";
            } else if (error.code === 'auth/wrong-password') {
                message = "Incorrect password.";
            }
            toast.error(message);
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-4 bg-gc-vibe bg-gc-gradient space-y-8 lg:space-y-0 lg:space-x-12"
        >
            {/* Login Form */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="max-w-sm w-full bg-gc-card p-8 rounded-xl shadow-2xl border-2 border-gc-secondary/80"
            >
                <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                <h1 className="text-3xl font-bold text-white mb-2 text-center">
                    Squad Login
                </h1>
                <p className="text-gray-400 mb-6 text-center">
                    Sign in to join the **Premium** vibe.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-gc-vibe border border-gc-border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-gc-primary focus:border-gc-primary transition"
                        />
                    </div>
                    <div className="relative">
                        <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-gc-vibe border border-gc-border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-gc-primary focus:border-gc-primary transition"
                        />
                    </div>
                    
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full py-3 mt-4 bg-gc-primary text-white font-bold rounded-lg shadow-gc-glow-primary hover:bg-gc-primary/90 transition duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                        <FiLogIn />
                        <span>{loading ? 'Logging In...' : 'Log In'}</span>
                    </motion.button>
                </form>

                <p className="text-center text-gray-500 mt-6 text-sm">
                    New to the Squad?{' '}
                    <Link href="/register" legacyBehavior>
                        <a className="text-gc-secondary font-semibold hover:underline">
                            Register Here
                        </a>
                    </Link>
                </p>
            </motion.div>
            
            {/* Live Feed Preview (NEW) */}
            <FeedPreview />
        </motion.div>
    );
};

export default LoginPage;
