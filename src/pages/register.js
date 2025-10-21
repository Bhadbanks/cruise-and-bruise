// src/pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../utils/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiPlusCircle } from 'react-icons/fi';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [location, setLocation] = useState('');
    const [interests, setInterests] = useState('');
    const [sex, setSex] = useState('');
    const [relationshipStatus, setRelationshipStatus] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [whatsappConvoLink, setWhatsappConvoLink] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userData = {
            username: username.trim(),
            age,
            location,
            interests,
            sex,
            relationshipStatus,
            whatsappNumber,
            whatsappConvoLink,
        };

        try {
            await register(email, password, userData);
            
            // Redirect to the mandatory GC Join page (handled by AppShell on successful registration)
            router.push('/gc-join'); 
            
        } catch (error) {
            let message = "Registration failed. Please try again.";
            if (error.message.includes("Username already taken")) {
                message = error.message;
            } else if (error.code === 'auth/email-already-in-use') {
                message = "This email is already registered.";
            } else if (error.code === 'auth/weak-password') {
                message = "Password should be at least 6 characters.";
            }
            toast.error(message);
            setLoading(false);
        }
    };

    const inputClass = "w-full pl-10 pr-4 py-3 bg-gc-vibe border border-gc-border rounded-lg text-white placeholder-gray-500 focus:ring-1 focus:ring-gc-primary focus:border-gc-primary transition";

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
                className="max-w-lg w-full bg-gc-card p-8 rounded-xl shadow-2xl border-2 border-gc-primary/80"
            >
                <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-white mb-2 text-center">
                    Join the Squad
                </h1>
                <p className="text-gray-400 mb-6 text-center">
                    Create your profile and start the vibe.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Core Auth Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))} 
                                placeholder="Username (Unique, no spaces)" required className={inputClass} />
                        </div>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Email" required className={inputClass} />
                        </div>
                    </div>
                    <div className="relative">
                        <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Password (Min 6 characters)" required className={inputClass} />
                    </div>
                    
                    {/* Additional Profile Fields */}
                    <h2 className="text-lg font-semibold text-gc-secondary pt-4">Optional Vibe Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" className={inputClass} />
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className={inputClass} />
                        
                        <select value={sex} onChange={(e) => setSex(e.target.value)} className={inputClass}>
                            <option value="">Select Sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <select value={relationshipStatus} onChange={(e) => setRelationshipStatus(e.target.value)} className={inputClass}>
                            <option value="">Relationship Status</option>
                            <option value="Single">Single</option>
                            <option value="In a Relationship">In a Relationship</option>
                            <option value="Married">Married</option>
                            <option value="It's Complicated">It's Complicated</option>
                        </select>
                    </div>
                    <textarea value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="Interests (e.g., coding, gaming, music)" rows="2" className={inputClass.replace("pl-10", "pl-4")} />
                    
                    <h2 className="text-lg font-semibold text-gc-secondary pt-4">WhatsApp Link (For Profile)</h2>
                    <div className="relative">
                        <input type="text" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} 
                            placeholder="WhatsApp Number (e.g., +23480...)" className={inputClass.replace("pl-10", "pl-4")} />
                    </div>
                    <div className="relative">
                        <input type="url" value={whatsappConvoLink} onChange={(e) => setWhatsappConvoLink(e.target.value)} 
                            placeholder="WhatsApp Chat Link (wa.me/...) - Optional" className={inputClass.replace("pl-10", "pl-4")} />
                    </div>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading || !username.trim()}
                        className="w-full py-3 mt-6 bg-gc-primary text-white font-bold rounded-lg shadow-lg hover:bg-gc-secondary transition duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                        <FiPlusCircle />
                        <span>{loading ? 'Creating Squad Profile...' : 'Create Account'}</span>
                    </motion.button>
                </form>

                <p className="text-center text-gray-500 mt-6 text-sm">
                    Already a Squad Member?{' '}
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
