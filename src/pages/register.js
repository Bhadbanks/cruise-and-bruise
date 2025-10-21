import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import { redirectToWhatsApp, uploadFile } from '../utils/helpers';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiUserPlus, FiLock, FiMail, FiPhone, FiMapPin, FiHeart, FiGlobe, FiCalendar, FiUpload } from 'react-icons/fi';
import { FaVenusMars } from 'react-icons/fa';

const Register = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        bio: '',
        location: '',
        age: '',
        sex: '',
        relationshipStatus: '',
        whatsappNumber: '',
        profilePic: null,
        coverImg: null,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const { username, email, password, confirmPassword, profilePic, coverImg, ...profileData } = formData;

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match.");
        }
        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters.");
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
             return toast.error("Please enter a valid email address.");
        }

        setLoading(true);

        try {
            // 1. Create User in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let profilePicUrl = '';
            let coverImgUrl = '';

            // 2. Upload Profile Picture
            if (profilePic) {
                profilePicUrl = await uploadFile(profilePic, `profiles/${user.uid}/profilePic`);
            }
            
            // 3. Upload Cover Image
            if (coverImg) {
                coverImgUrl = await uploadFile(coverImg, `profiles/${user.uid}/coverImg`);
            }

            // 4. Create User Document in Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                username: username.toLowerCase(), 
                email: email,
                createdAt: serverTimestamp(),
                profilePicUrl: profilePicUrl || '/default-avatar.png',
                coverImgUrl: coverImgUrl || '/default-cover.jpg',
                isVerified: false,
                isAdmin: false,
                followers: [],
                following: [],
                ...profileData, // Include age, location, whatsapp, etc.
            });

            toast.success("Registration successful! Welcome to the Squad.");
            
            // 5. Redirect and Auto-Join GC
            router.push('/');
            redirectToWhatsApp();

        } catch (error) {
            console.error("Registration error:", error);
            let errorMessage = "Registration failed. Please try again.";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already in use.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password is too weak.";
            }
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const InputField = ({ label, name, type = 'text', icon: Icon, placeholder, required = false }) => (
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />}
            <input
                type={type}
                name={name}
                placeholder={placeholder || label}
                value={type !== 'file' ? formData[name] : undefined}
                onChange={handleChange}
                required={required}
                className={`w-full p-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-gc-primary focus:outline-none transition duration-200 ${Icon ? 'pl-10' : 'pl-4'}`}
            />
        </div>
    );

    const FileUploadField = ({ label, name, required = false }) => (
        <label className="block bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition duration-200">
            <input type="file" name={name} onChange={handleChange} required={required} className="hidden" accept="image/*" />
            <div className="flex items-center space-x-3 text-gray-300">
                <FiUpload className="w-5 h-5" />
                <span>{formData[name]?.name || `Upload ${label}`}</span>
            </div>
        </label>
    );

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="min-h-screen flex items-center justify-center p-4"
        >
            <Head><title>Register | Special Squad</title></Head>
            <motion.div 
                initial={{ y: -50, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700"
            >
                <h1 className="text-3xl font-extrabold mb-2 text-white flex items-center space-x-2">
                    <FiUserPlus className="w-6 h-6 text-gc-primary" />
                    <span>Join The Squad</span>
                </h1>
                <p className="text-gray-400 mb-6">Create your account and start connecting!</p>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField name="username" icon={FiUserPlus} placeholder="Unique Username" required />
                        <InputField name="email" type="email" icon={FiMail} placeholder="Email" required />
                        <InputField name="password" type="password" icon={FiLock} placeholder="Password (min 6 chars)" required />
                        <InputField name="confirmPassword" type="password" icon={FiLock} placeholder="Confirm Password" required />
                        
                        {/* Custom Profile Fields */}
                        <InputField name="whatsappNumber" icon={FiPhone} placeholder="WhatsApp Number" />
                        <InputField name="location" icon={FiMapPin} placeholder="Location" />
                        <InputField name="age" type="number" icon={FiCalendar} placeholder="Age" min="16" />
                        
                        <div className="relative">
                            <FaVenusMars className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-gc-primary focus:outline-none transition duration-200 pl-10"
                            >
                                <option value="">Select Sex</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <div className="relative">
                            <FiHeart className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                name="relationshipStatus"
                                value={formData.relationshipStatus}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-gc-primary focus:outline-none transition duration-200 pl-10"
                            >
                                <option value="">Relationship Status</option>
                                <option value="Single">Single</option>
                                <option value="In a Relationship">In a Relationship</option>
                                <option value="Married">Married</option>
                            </select>
                        </div>
                        
                        {/* Image Uploads */}
                        <FileUploadField name="profilePic" label="Profile Picture" />
                        <FileUploadField name="coverImg" label="Cover Image" />

                    </div>
                    
                    <textarea
                        name="bio"
                        placeholder="Tell us a little about yourself (Bio)"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="3"
                        className="w-full p-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-gc-primary focus:outline-none transition duration-200"
                    />

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gc-primary text-white font-bold rounded-lg hover:bg-pink-700 transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Registering...' : 'Register & Join WhatsApp GC'}
                    </motion.button>
                </form>

                <p className="text-center text-gray-400 mt-6">
                    Already a member? <Link href="/login" legacyBehavior><a className="text-gc-primary hover:underline">Log in here</a></Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Register;
