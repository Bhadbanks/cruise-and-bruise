// src/pages/gc-join.js
import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import Link from 'next/link';

const GcJoinPage = () => {
    const { currentUser, loading, userProfile, GC_LINK } = useAuth();
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (loading) return;

        // If not logged in, redirect to login
        if (!currentUser) {
            router.push('/login');
            return;
        }

        // If user has already joined, redirect to home
        if (userProfile && userProfile.hasJoinedGC) {
            router.push('/');
            return;
        }
    }, [currentUser, loading, userProfile, router]);

    const handleJoinAndContinue = async () => {
        if (!userProfile || isUpdating) return;
        setIsUpdating(true);

        try {
            // Mark user as having joined the GC in Firestore
            const userRef = doc(db, 'users', userProfile.uid);
            await updateDoc(userRef, {
                hasJoinedGC: true,
            });

            // Redirect to the group chat link first
            window.open(GC_LINK, '_blank');
            
            // Wait briefly before redirecting home
            setTimeout(() => {
                router.push('/');
            }, 1500);

        } catch (error) {
            console.error("Error updating GC status:", error);
            setIsUpdating(false);
            // Even if update fails, we can still redirect home
            router.push('/'); 
        }
    };
    
    // Fallback loading check
    if (loading || !userProfile || userProfile.hasJoinedGC) {
        return <div className="min-h-screen bg-gc-vibe flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl border-2 border-gc-primary"
            >
                <FiAlertTriangle className="w-12 h-12 text-gc-primary mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-white mb-4 text-center">
                    Mandatory Group Join
                </h1>
                <p className="text-gray-400 mb-6 text-center">
                    You must join the **👑✨💥 𝕊𝕡𝕖𝕔𝕚𝕒𝕝 𝕊𝕢𝕦𝕒𝕕 💥✨👑ᵀʰᵉ ᵁˡᵗᶦᵐᵃᵗᵘᵐ** WhatsApp group to proceed.
                </p>
                
                <motion.button 
                    onClick={handleJoinAndContinue}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isUpdating}
                    className="block w-full text-center py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300 disabled:opacity-50 flex items-center justify-center"
                >
                    {isUpdating ? 'Redirecting...' : 'Join WhatsApp Group & Continue'}
                </motion.button>
            </motion.div>
        </div>
    );
};

export default GcJoinPage;
