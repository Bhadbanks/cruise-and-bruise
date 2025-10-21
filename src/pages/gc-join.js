// src/pages/gc-join.js
import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import GlobalLoading from '../components/GlobalLoading';

const GcJoinPage = () => {
    const { currentUser, userProfile, GC_LINK } = useAuth();
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!currentUser || !userProfile) return;

        // If user has already joined, redirect to home
        if (userProfile.hasJoinedGC) {
            router.replace('/');
        }
    }, [currentUser, userProfile, router]);
    
    // Fallback: If no user or profile, AuthContext is still loading/redirecting
    if (!currentUser || !userProfile || userProfile.hasJoinedGC) {
        return <GlobalLoading />;
    }


    const handleJoinAndContinue = async () => {
        if (isUpdating) return;
        setIsUpdating(true);

        try {
            // 1. Redirect to the group chat link first
            window.open(GC_LINK, '_blank');
            
            // 2. Mark user as having joined the GC in Firestore
            const userRef = doc(db, 'users', userProfile.uid);
            await updateDoc(userRef, {
                hasJoinedGC: true,
            });

            // 3. Redirect to the home page after a brief delay
            setTimeout(() => {
                router.replace('/');
            }, 1000); // Give user time for WhatsApp redirect to initiate

        } catch (error) {
            console.error("Error updating GC status:", error);
            setIsUpdating(false);
            // Optionally, still redirect home if update fails to let them retry later
            router.replace('/'); 
        }
    };
    
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center p-4 bg-gc-vibe"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="max-w-md w-full bg-gc-card p-8 rounded-xl shadow-2xl border-2 border-gc-primary/80"
            >
                <FiAlertTriangle className="w-12 h-12 text-gc-primary mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-white mb-4 text-center">
                    Squad Membership Required
                </h1>
                <p className="text-gray-400 mb-6 text-center">
                    **Action Required:** You must join the **👑✨💥 𝕊𝕡𝕖𝕔𝕚𝕒𝕝 𝕊𝕢𝕦𝕒𝕕 💥✨👑ᵀʰᵉ ᵁˡᵗᶦᵐᵃᵗᵘᵐ** WhatsApp group to access the social platform.
                </p>
                
                <motion.button 
                    onClick={handleJoinAndContinue}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isUpdating}
                    className="block w-full text-center py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                    <FaWhatsapp />
                    <span>{isUpdating ? 'Redirecting...' : 'Join WhatsApp Group & Continue'}</span>
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default GcJoinPage;
