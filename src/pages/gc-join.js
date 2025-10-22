// src/pages/gc-join.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '../utils/AuthContext';
import toast from 'react-hot-toast';
import { FiUserCheck, FiSave, FiMapPin, FiHeart, FiPhone, FiGlobe, FiFeather } from 'react-icons/fi';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import GlobalLoading from '../components/GlobalLoading';

const GcJoinPage = () => {
    const { userProfile, currentUser, loading, login } = useAuth();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    // Initial state based on AuthContext data (must be defined in AuthContext register)
    const [formData, setFormData] = useState({
        bio: userProfile?.bio || '',
        location: userProfile?.location || '',
        age: userProfile?.age || '',
        sex: userProfile?.sex || '',
        relationshipStatus: userProfile?.relationshipStatus || '',
        interests: userProfile?.interests || '',
        whatsappNumber: userProfile?.whatsappNumber || '',
        whatsappConvoLink: userProfile?.whatsappConvoLink || '',
        // NOTE: Profile pic upload is handled separately by the user in settings
    });
    
    // Protection: If not logged in or profile is complete, redirect
    React.useEffect(() => {
        if (!loading && !currentUser) {
            router.push('/login');
        } else if (!loading && userProfile && userProfile.bio) {
            router.push('/');
        }
    }, [userProfile, currentUser, router, loading]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Simple validation
        if (!formData.bio || !formData.location || !formData.age) {
            toast.error("Please fill in Bio, Location, and Age.");
            setIsSaving(false);
            return;
        }

        try {
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, formData);
            
            toast.success("Profile setup complete! Welcome to the Squad.");
            router.push('/'); 
        } catch (error) {
            console.error("Error completing profile:", error);
            toast.error("Failed to complete profile setup.");
        } finally {
            setIsSaving(false);
        }
    };

    // Show loading if still checking auth or if user is logged out (redirect handled above)
    if (loading || !currentUser || (userProfile && userProfile.bio)) {
        return <GlobalLoading />;
    }

    const inputClass = "w-full p-3 bg-gc-vibe border border-gc-border rounded-lg text-white placeholder-gray-500 focus:ring-1 focus:ring-gc-primary focus:border-gc-primary transition";

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gc-vibe bg-gc-gradient">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="w-full max-w-2xl bg-gc-card p-8 rounded-xl shadow-2xl border-2 border-gc-primary/80"
            >
                <h1 className="text-3xl font-extrabold text-gc-primary mb-2 flex items-center space-x-2">
                    <FiUserCheck /> <span>Complete Your Vibe Setup</span>
                </h1>
                <p className="text-gray-400 mb-6">
                    @{userProfile?.username || 'user'} - Tell the Squad about yourself! This profile is public.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Bio */}
                    <div>
                        <label className="block text-gray-300 mb-1 flex items-center space-x-1"><FiFeather /> <span>Short Bio (Required)</span></label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className={inputClass} placeholder="A brief description of your vibe..." required />
                    </div>

                    {/* Personal Details Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-gray-300 mb-1 flex items-center space-x-1"><FiMapPin /> <span>Location</span></label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputClass} placeholder="City, Country" required />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputClass} placeholder="25" required />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Sex</label>
                            <select name="sex" value={formData.sex} onChange={handleChange} className={inputClass}>
                                <option value="">Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Relationship/Interests Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-300 mb-1 flex items-center space-x-1"><FiHeart /> <span>Relationship Status</span></label>
                            <select name="relationshipStatus" value={formData.relationshipStatus} onChange={handleChange} className={inputClass}>
                                <option value="">Select...</option>
                                <option value="Single">Single</option>
                                <option value="In a Relationship">In a Relationship</option>
                                <option value="Married">Married</option>
                                <option value="It's Complicated">It's Complicated</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Interests (Keywords)</label>
                            <input type="text" name="interests" value={formData.interests} onChange={handleChange} className={inputClass} placeholder="e.g., coding, gaming, music" />
                        </div>
                    </div>

                    {/* WhatsApp Details (Your Custom Fields) */}
                    <h2 className='text-lg font-semibold text-gc-secondary mt-6 border-t border-gc-border pt-4'>Private Contact Details</h2>
                    <p className='text-xs text-gray-500 -mt-4'>Only visible to authenticated members on your profile.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-gray-300 mb-1 flex items-center space-x-1"><FiPhone /> <span>WhatsApp Number</span></label>
                            <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className={inputClass} placeholder="+234..." />
                        </div>
                         <div>
                            <label className="block text-gray-300 mb-1 flex items-center space-x-1"><FiGlobe /> <span>WhatsApp Group/Convo Link</span></label>
                            <input type="url" name="whatsappConvoLink" value={formData.whatsappConvoLink} onChange={handleChange} className={inputClass} placeholder="https://chat.whatsapp.com/..." />
                        </div>
                    </div>


                    <div className="flex justify-end pt-4">
                        <motion.button
                            type="submit"
                            disabled={isSaving}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-2 px-8 py-3 bg-gc-primary text-white font-bold rounded-full disabled:opacity-50 transition duration-300 shadow-gc-glow-primary"
                        >
                            <FiSave />
                            <span>{isSaving ? 'Saving...' : 'Finish Setup & Enter Squad'}</span>
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default GcJoinPage;
