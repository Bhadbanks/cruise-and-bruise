// src/pages/gc-join.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '../utils/AuthContext';
import toast from 'react-hot-toast';
import { FiUserCheck, FiSave, FiMapPin, FiHeart, FiPhone, FiUser, FiGlobe, FiFeather, FiCalendar } from 'react-icons/fi'; // Added FiUser, FiCalendar
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import GlobalLoading from '../components/GlobalLoading';

const GcJoinPage = () => {
    const { userProfile, currentUser, loading } = useAuth();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        bio: userProfile?.bio || '',
        location: userProfile?.location || '',
        age: userProfile?.age || '',
        sex: userProfile?.sex || '',
        relationshipStatus: userProfile?.relationshipStatus || '',
        interests: userProfile?.interests || '',
        whatsappNumber: userProfile?.whatsappNumber || '',
        // Removed whatsappConvoLink from state as it will be derived
    });
    
    // AuthContext handles initial redirects, but ensure the page does not render if complete
    if (!loading && userProfile && userProfile.bio) {
        router.push('/feed');
        return <GlobalLoading />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        if (!formData.bio || !formData.location || !formData.age) {
            toast.error("Please fill in Bio, Location, and Age.");
            setIsSaving(false);
            return;
        }
        
        // --- 🏆 FIX: Automatically generate WhatsApp Link ---
        let whatsappConvoLink = '';
        if (formData.whatsappNumber) {
            // Cleans number and formats for wa.me link. E.g., +23480... -> wa.me/23480...
            const cleanNumber = formData.whatsappNumber.replace(/[^0-9+]/g, '');
            whatsappConvoLink = `https://wa.me/${cleanNumber.replace('+', '')}`;
        }
        // ---------------------------------------------------

        try {
            const userRef = doc(db, 'users', currentUser.uid);
            // Include the generated link in the final data sent to Firebase
            await updateDoc(userRef, {
                ...formData,
                whatsappConvoLink: whatsappConvoLink,
            });
            
            toast.success("Profile setup complete! Welcome to the Squad.");
            router.push('/feed'); 
        } catch (error) {
            console.error("Error completing profile:", error);
            toast.error("Failed to complete profile setup.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || !currentUser) {
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
                            <label className="block text-gray-300 mb-1 flex items-center space-x-1"><FiCalendar /> <span>Age</span></label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputClass} placeholder="25" required />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1 flex items-center space-x-1"><FiUser /> <span>Sex</span></label>
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

                    {/* WhatsApp Details (Now only Number is visible) */}
                    <h2 className='text-lg font-semibold text-gc-secondary mt-6 border-t border-gc-border pt-4'>Private Contact Details</h2>
                    <p className='text-xs text-gray-500 -mt-4'>Only visible to authenticated members. The WhatsApp link will be auto-generated.</p>
                    <div className="grid grid-cols-1">
                         <div>
                            <label className="block text-gray-300 mb-1 flex items-center space-x-1"><FiPhone /> <span>WhatsApp Number (e.g., +23480...)</span></label>
                            <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className={inputClass} placeholder="+234..." />
                        </div>
                         {/* 🏆 FIX: Removed the separate Convo Link input field */}
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

GcJoinPage.displayName = 'gc-join';

export default GcJoinPage;
