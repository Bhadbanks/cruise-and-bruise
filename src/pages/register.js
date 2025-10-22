// src/pages/register.js
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../utils/AuthContext';
import toast from 'react-hot-toast';
import GlobalLoading from '../components/GlobalLoading';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, loading } = useAuth();

    if (loading) return <GlobalLoading />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await register(email, password, { username });
            toast.success("Registration successful! Now, complete your mandatory GC profile.");
            // AuthContext handles redirect to /gc-join
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Registration failed. Try a different username/email.");
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
                className="w-full max-w-md bg-gc-card p-8 rounded-xl shadow-2xl border-2 border-gc-secondary/80"
            >
                <h1 className="text-3xl font-extrabold text-gc-secondary mb-6 text-center">
                    Join the Special Squad
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 mb-1 flex items-center space-x-1"><FiUser /> <span>Username</span></label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} placeholder="squad_master_123" required />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1 flex items-center space-x-1"><FiMail /> <span>Email</span></label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="vibe@squad.com" required />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1 flex items-center space-x-1"><FiLock /> <span>Password (min 6 characters)</span></label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" required />
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center justify-center space-x-2 px-8 py-3 bg-gc-secondary text-white font-bold rounded-full disabled:opacity-50 transition duration-300 shadow-lg shadow-gc-secondary/30"
                    >
                        <FiUserPlus />
                        <span>{isSubmitting ? 'Registering...' : 'Sign Up'}</span>
                    </motion.button>
                </form>

                <p className="text-center text-gray-500 mt-6 text-sm">
                    Already part of the Vibe?{' '}
                    <Link href="/login" className="text-gc-primary hover:underline font-semibold">
                        Log In
                    </Link>
                </p>
                <p className="text-center text-gray-500 mt-2 text-xs">
                    <Link href="/splash" className="text-gc-secondary hover:underline">
                        Back to Splash Page
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

RegisterPage.displayName = 'register'; 

export default RegisterPage;
