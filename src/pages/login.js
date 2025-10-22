// src/pages/login.js
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../utils/AuthContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import GlobalLoading from '../components/GlobalLoading';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, loading } = useAuth();
    const router = useRouter();

    if (loading) return <GlobalLoading />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await login(email, password);
            toast.success("Login successful! Welcome back to the Vibe.");
            // AuthContext handles redirect based on profile completion (/feed or /gc-join)
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Login failed. Check your credentials.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full p-3 bg-gc-vibe border border-gc-border rounded-lg text-white placeholder-gray-500 focus:ring-1 focus:ring-gc-primary transition";

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gc-vibe">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="w-full max-w-md bg-gc-card p-8 rounded-xl shadow-2xl border-2 border-gc-primary/80"
            >
                <h1 className="text-3xl font-extrabold text-gc-primary mb-6 text-center">
                    Squad Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 mb-1 flex items-center space-x-1"><FiMail /> <span>Email</span></label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="vibe@squad.com" required />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1 flex items-center space-x-1"><FiLock /> <span>Password</span></label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" required />
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center justify-center space-x-2 px-8 py-3 bg-gc-primary text-white font-bold rounded-full disabled:opacity-50 transition duration-300 shadow-gc-glow"
                    >
                        <FiLogIn />
                        <span>{isSubmitting ? 'Entering Vibe...' : 'Log In'}</span>
                    </motion.button>
                </form>

                <p className="text-center text-gray-500 mt-6 text-sm">
                    New to the Squad?{' '}
                    <Link href="/register" className="text-gc-secondary hover:underline font-semibold">
                        Join the Vibe
                    </Link>
                </p>
                <p className="text-center text-gray-500 mt-2 text-xs">
                    <Link href="/splash" className="text-gc-primary hover:underline">
                        Back to Splash Page
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

LoginPage.displayName = 'login'; 

export default LoginPage;
