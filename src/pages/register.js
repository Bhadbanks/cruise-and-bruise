// src/pages/register.js
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../utils/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiPlusCircle, FiMapPin, FiCalendar } from 'react-icons/fi';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, currentUser } = useAuth();
    
    if (currentUser) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const initialData = { username: username.trim(), age, location };

        try {
            await register(email, password, initialData);
            toast.success("Registration successful! Complete your full profile now.");
            // AuthContext handles push to /gc-join
            
        } catch (error) {
            let message = error.message.includes("Username already taken") ? "Username already taken." : "Registration failed. Try again.";
            if (error.code === 'auth/email-already-in-use') message = "This email is already registered.";
            else if (error.code === 'auth/weak-password') message = "Password should be at least 6 characters.";
            toast.error(message);
            setLoading(false);
        }
    };

    const inputClass = "w-full pl-10 pr-4 py-3 bg-gc-vibe border border-gc-border rounded-lg text-white placeholder-gray-500 transition";

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center p-4 bg-gc-vibe bg-gc-gradient"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="max-w-sm w-full bg-gc-card p-8 rounded-xl shadow-2xl border-2 border-gc-secondary/80"
            >
                <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-white mb-2 text-center">
                    Create Your Squad Profile
                </h1>
                <p className="text-gray-400 mb-6 text-center">
                    Just the essentials to get started.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))} 
                            placeholder="Username (e.g., @SquadBhad)" required className={inputClass} />
                    </div>
                    <div className="relative">
                        <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email" required className={inputClass} />
                    </div>
                    <div className="relative">
                        <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Password (Min 6 characters)" required className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />
                            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" className={inputClass.replace("pl-10", "pl-4")} />
                        </div>
                        <div className="relative">
                            <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className={inputClass.replace("pl-10", "pl-4")} />
                        </div>
                    </div>
                    

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading || !username.trim()}
                        className="w-full py-3 mt-6 bg-gc-secondary text-white font-bold rounded-lg shadow-gc-glow hover:bg-gc-secondary/90 transition duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                        <FiPlusCircle />
                        <span>{loading ? 'Signing Up...' : 'Create Account'}</span>
                    </motion.button>
                </form>

                <p className="text-center text-gray-500 mt-6 text-sm">
                    Already a member?{' '}
                    <Link href="/login" legacyBehavior>
                        <a className="text-gc-primary font-semibold hover:underline">
                            Log In
                        </a>
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default RegisterPage;
