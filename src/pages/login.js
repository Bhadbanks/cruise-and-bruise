// src/pages/login.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiLogIn, FiLock, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Link from 'next/link';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordReset, setIsPasswordReset] = useState(false);
    const { currentUser, loading, login, resetPassword } = useAuth();
    const router = useRouter();

    // Redirect logic: If logged in, go to home
    useEffect(() => {
        if (!loading && currentUser) {
            router.push('/');
        }
    }, [currentUser, loading, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isPasswordReset) {
            try {
                await resetPassword(email);
                toast.success('Password reset link sent to email!');
                setIsPasswordReset(false);
            } catch (error) {
                toast.error(error.message);
            }
        } else {
            await login(email, password);
        }
    };

    if (loading || currentUser) return null;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center p-4 bg-gray-900"
        >
            <Head><title>{isPasswordReset ? 'Reset Password' : 'Login'} | Special Squad</title></Head>
            
            <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gc-secondary"
            >
                <img 
                    src="/logo.png" 
                    alt="Logo" 
                    className="w-20 h-20 mx-auto mb-6 object-contain"
                />
                <h1 className="text-3xl font-extrabold text-white text-center mb-6 flex items-center justify-center space-x-2">
                    <FiLogIn className="text-gc-primary" />
                    <span>{isPasswordReset ? 'Reset Password' : 'Squad Login'}</span>
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-gc-primary focus:outline-none transition duration-200"
                            required
                        />
                    </div>
                    
                    {!isPasswordReset && (
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-gc-primary focus:outline-none transition duration-200"
                                required
                            />
                        </div>
                    )}
                    
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-3 bg-gc-gradient text-white font-bold rounded-full shadow-lg transition duration-300"
                    >
                        {isPasswordReset ? 'Send Reset Email' : 'Log In'}
                    </motion.button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-400">
                        {isPasswordReset ? (
                            <button 
                                onClick={() => setIsPasswordReset(false)} 
                                className="text-gc-primary hover:underline"
                            >
                                Back to Login
                            </button>
                        ) : (
                            <>
                                Don't have an account?{' '}
                                <Link href="/register" legacyBehavior>
                                    <a className="text-gc-secondary hover:underline">Register Here</a>
                                </Link>
                            </>
                        )}
                    </p>
                    {!isPasswordReset && (
                        <p className="mt-2">
                            <button 
                                onClick={() => setIsPasswordReset(true)} 
                                className="text-gc-primary hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </p>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Login;
