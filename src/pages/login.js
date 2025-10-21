import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, checkAdminStatus } from '../utils/firebase';
import { useAuth } from '../utils/AuthContext';
import { FiMail, FiLock } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
    const router = useRouter();
    const { userProfile } = useAuth(); // Use AuthContext to check if user is already logged in
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect already logged-in users to the homepage
    if (userProfile && typeof window !== 'undefined') {
        router.push(userProfile.isAdmin ? '/admin' : '/');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // On successful login, the AuthContext listener will fetch the user profile.
            // We can determine the redirection based on the profile data it fetches.
            
            // For immediate redirection, check if the email belongs to the admin based on stored profile data.
            // Note: The most reliable check is done inside the AuthContext listener, but this provides a quick UX.
            
            toast.success("Login successful! Redirecting...");
            
            // The AuthContext will handle the final redirection after it fetches the profile, 
            // but we can push to the home page for a smooth transition.
            router.push('/'); 

        } catch (error) {
            console.error('Login Error:', error);
            // Translate common Firebase errors
            if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                toast.error('Invalid email or password.');
            } else {
                toast.error(`Login failed: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-gray-100">
            <Head><title>Login - Special Squad</title></Head>
            <Toaster />
            <div className="w-full max-w-sm p-8 bg-gray-800 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700">
                <motion.h1 
                    initial={{ y: -50, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-bold text-center mb-8 text-pink-400 flex items-center justify-center"
                >
                    <FaCrown className="w-6 h-6 mr-2" />
                    Special Squad Login
                </motion.h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField Icon={FiMail} name="email" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <InputField Icon={FiLock} name="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gc-primary text-white font-bold rounded-lg shadow-md hover:bg-pink-700 transition duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </motion.button>
                </form>
                <p className="text-center mt-6 text-gray-400">
                    New to the Squad?{' '}
                    <Link href="/register" legacyBehavior>
                        <a className="text-purple-400 hover:text-purple-300 font-medium transition duration-200">
                            Register here
                        </a>
                    </Link>
                </p>
            </div>
        </div>
    );
};

// Reusable InputField component (as used in register.js)
const InputField = ({ Icon, name, placeholder, value, onChange, required, type = 'text' }) => (
    <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg placeholder-gray-400 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none transition duration-300"
        />
    </div>
);

export default Login;
