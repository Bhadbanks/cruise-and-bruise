import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useAuth } from '../utils/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { isAdmin } = useAuth(); // Use isAdmin from context

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Login successful!");
            
            // Redirect based on Admin status (Handled by AuthContext listener updating isAdmin)
            if (isAdmin) {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } catch (error) {
            console.error("Login error:", error);
            let errorMessage = "Login failed. Check your email and password.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = "Invalid email or password.";
            }
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="min-h-screen flex items-center justify-center p-4"
        >
            <Head><title>Login | Special Squad</title></Head>
            <motion.div 
                initial={{ y: -50, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700"
            >
                <h1 className="text-3xl font-extrabold mb-2 text-white flex items-center space-x-2">
                    <FiLogIn className="w-6 h-6 text-gc-primary" />
                    <span>Welcome Back</span>
                </h1>
                <p className="text-gray-400 mb-6">Log in to your Special Squad account.</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-gc-primary focus:outline-none transition duration-200"
                        />
                    </div>
                    
                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-gc-primary focus:outline-none transition duration-200"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gc-primary text-white font-bold rounded-lg hover:bg-pink-700 transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Logging In...' : 'Log In'}
                    </motion.button>
                </form>

                <p className="text-center text-gray-400 mt-6">
                    Don't have an account? <Link href="/register" legacyBehavior><a className="text-gc-primary hover:underline">Register here</a></Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Login;
