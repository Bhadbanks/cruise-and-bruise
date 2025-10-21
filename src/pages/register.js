import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, checkAdminStatus } from '../utils/firebase';
import { autoJoinWhatsAppGC, showWelcomeNotification } from '../utils/helpers';
import { FiUser, FiMail, FiLock, FiStar, FiMapPin, FiHeart, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast'; // Install react-hot-toast

const Register = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        age: '',
        location: '',
        interests: '',
        sex: 'male', 'female', 'others',
        relationshipStatus: 'single', 'in a relationship', 'its complicated',
        whatsappNumber: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { username, email, password, interests, ...profileData } = formData;
        
        // 1. Basic Form Validation (Add more robust validation as needed)
        if (!username || !email || !password) {
            toast.error('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        try {
            // 2. Firebase Authentication: Create User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 3. Determine Admin/Verified Status
            const isAdmin = checkAdminStatus(username);
            const isVerified = isAdmin; // Admin is automatically verified

            // 4. Firestore Profile Creation (Users Collection)
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                username: username,
                email: email,
                ...profileData, // age, location, sex, status, whatsappNumber
                interests: interests.split(',').map(i => i.trim()), // convert string to array
                bio: 'Hey there! I just joined the Special Squad.',
                profilePicUrl: '/default-avatar.png', // Placeholder
                coverImgUrl: '/default-cover.jpg',  // Placeholder
                socialLinks: {},
                followers: [],
                following: [],
                isVerified: isVerified,
                isAdmin: isAdmin,
                createdAt: new Date(),
            });

            // 5. Success Notifications and Redirection
            showWelcomeNotification(username);
            autoJoinWhatsAppGC(); // Crucial: Auto-join WhatsApp GC
            
            // Redirect admin to dashboard, others to home/feed
            router.push(isAdmin ? '/admin' : '/');

        } catch (error) {
            console.error('Registration Error:', error);
            // Translate common Firebase errors for better UX
            if (error.code === 'auth/email-already-in-use') {
                toast.error('This email is already registered.');
            } else if (error.code === 'auth/weak-password') {
                toast.error('Password should be at least 6 characters.');
            } else {
                toast.error(`Registration failed: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-gray-100">
            <Head>
                <title>Register - Special Squad</title>
            </Head>
            <Toaster />
            <div className="w-full max-w-lg p-8 bg-gray-800 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700">
                <motion.h1 
                    initial={{ y: -50, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-bold text-center mb-6 text-pink-400"
                >
                    Join the Special Squad 👑
                </motion.h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Account Fields */}
                    <InputField Icon={FiUser} name="username" placeholder="Unique Username" value={formData.username} onChange={handleChange} required />
                    <InputField Icon={FiMail} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                    <InputField Icon={FiLock} name="password" type="password" placeholder="Password (min 6 chars)" value={formData.password} onChange={handleChange} required />

                    <h2 className="text-xl font-semibold mt-6 pt-4 border-t border-gray-700 text-purple-400">Personal Details</h2>
                    
                    {/* Additional Required Fields */}
                    <InputField Icon={FiStar} name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} required />
                    <InputField Icon={FiMapPin} name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
                    <InputField Icon={FiHeart} name="interests" placeholder="Interests (e.g., coding, games, music)" value={formData.interests} onChange={handleChange} hint="Comma separated list." />
                    <InputField Icon={FaWhatsapp} name="whatsappNumber" placeholder="WhatsApp Number (+234...)" value={formData.whatsappNumber} onChange={handleChange} type="tel" required />

                    {/* Select Fields */}
                    <SelectField name="sex" label="Sex" value={formData.sex} onChange={handleChange} options={['male', 'female', 'other']} />
                    <SelectField name="relationshipStatus" label="Relationship Status" value={formData.relationshipStatus} onChange={handleChange} options={['single', 'in a relationship', 'married', 'complicated']} />

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-pink-600 text-white font-bold rounded-lg shadow-md hover:bg-pink-700 transition duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Registering...' : 'Register & Join GC!'}
                    </motion.button>
                </form>
                <p className="text-center mt-4 text-gray-400">
                    Already a member?{' '}
                    <button onClick={() => router.push('/login')} className="text-purple-400 hover:text-purple-300 font-medium transition duration-200">
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
};

// --- Reusable Component Snippets (move to components/ or utils/ for production) ---

const InputField = ({ Icon, name, placeholder, value, onChange, required, type = 'text', hint }) => (
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
        {hint && <p className="text-xs text-gray-500 mt-1 ml-1">{hint}</p>}
    </div>
);

const SelectField = ({ name, label, value, onChange, options }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium mb-1 text-gray-300">
            {label}
        </label>
        <select
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className="w-full pl-3 pr-4 py-3 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none transition duration-300 appearance-none"
        >
            {options.map(option => (
                <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
            ))}
        </select>
    </div>
);

export default Register;
