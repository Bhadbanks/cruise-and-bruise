// src/pages/settings/profile.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiSave, FiUser } from 'react-icons/fi';
import { useAuth } from '../../utils/AuthContext';
import toast from 'react-hot-toast';
import GlobalLoading from '../../components/GlobalLoading';

const ProfileSettingsPage = () => {
    const { userProfile, updateProfileData, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState(userProfile || {});
    const [isSaving, setIsSaving] = useState(false);

    // Populate form data once userProfile is available
    React.useEffect(() => {
        if (userProfile) {
            setFormData(userProfile);
        }
    }, [userProfile]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        try {
            // NOTE: The actual Firebase update logic for profile data is required in AuthContext.js 
            // This assumes you've added an `updateProfileData` function to AuthContext that interacts with Firestore.
            // await updateProfileData(formData); 

            toast.success("Profile saved successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error("Failed to save profile. Check the console.");
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading || !userProfile) {
        return <GlobalLoading />;
    }
    
    const inputClass = "w-full p-3 bg-gc-vibe border border-gc-border rounded-lg text-white placeholder-gray-500 focus:ring-1 focus:ring-gc-primary focus:border-gc-primary transition";

    return (
        <div className="w-full p-4">
            <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-extrabold text-white mb-6 flex items-center space-x-3 border-b border-gc-border pb-3"
            >
                <FiSettings className="text-gc-primary" />
                <span>Profile Settings</span>
            </motion.h1>

            <motion.form 
                onSubmit={handleSubmit}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-gc-card p-6 rounded-xl shadow-2xl border border-gc-secondary/50 max-w-3xl mx-auto space-y-4"
            >
                <h2 className="text-xl font-bold text-gc-secondary mb-4 flex items-center space-x-2">
                    <FiUser /> <span>Basic Vibe Details</span>
                </h2>

                <label className="block">
                    <span className="text-gray-400">Bio</span>
                    <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows="3" className={inputClass} />
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                        <span className="text-gray-400">Age</span>
                        <input type="number" name="age" value={formData.age || ''} onChange={handleChange} className={inputClass} />
                    </label>
                    <label className="block">
                        <span className="text-gray-400">Location</span>
                        <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className={inputClass} />
                    </label>
                    <label className="block">
                        <span className="text-gray-400">Sex</span>
                        <select name="sex" value={formData.sex || ''} onChange={handleChange} className={inputClass}>
                            <option value="">Select Sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>
                    <label className="block">
                        <span className="text-gray-400">Relationship Status</span>
                        <select name="relationshipStatus" value={formData.relationshipStatus || ''} onChange={handleChange} className={inputClass}>
                            <option value="">Select Status</option>
                            <option value="Single">Single</option>
                            <option value="In a Relationship">In a Relationship</option>
                            <option value="Married">Married</option>
                            <option value="It's Complicated">It's Complicated</option>
                        </select>
                    </label>
                </div>
                
                <label className="block">
                    <span className="text-gray-400">Interests</span>
                    <input type="text" name="interests" value={formData.interests || ''} onChange={handleChange} placeholder="e.g., coding, gaming, music" className={inputClass} />
                </label>

                <div className="flex justify-end pt-4">
                    <motion.button
                        type="submit"
                        disabled={isSaving}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-6 py-3 bg-gc-primary text-white font-bold rounded-full disabled:opacity-50 transition duration-300"
                    >
                        <FiSave />
                        <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
};

export default ProfileSettingsPage;
