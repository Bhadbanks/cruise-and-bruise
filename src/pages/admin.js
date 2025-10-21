// src/pages/admin.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaCheckCircle, FaFeather, FaBullhorn } from 'react-icons/fa';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/router';
import { db } from '../utils/firebase';
import { collection, query, getDocs, doc, updateDoc, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import UserCard from '../components/UserCard';
import toast from 'react-hot-toast';
import GlobalLoading from '../components/GlobalLoading';

const AdminPage = () => {
    const { isAdmin, userProfile } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [announcementContent, setAnnouncementContent] = useState('');

    useEffect(() => {
        // Redirection check is primarily in AppShell, but this ensures client-side protection
        if (!userProfile) return;
        if (!isAdmin) {
            toast.error("Access Denied: Admin privileges required.");
            router.push('/');
        } else {
            fetchUsers();
        }
    }, [isAdmin, userProfile, router]);

    // --- Fetch Users List ---
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'users'), orderBy('username'));
            const querySnapshot = await getDocs(q);
            
            const usersList = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                // Exclude the admin from the verification list
                .filter(user => user.uid !== userProfile.uid); 

            setUsers(usersList);

        } catch (error) {
            console.error("Error fetching users for admin:", error);
            toast.error("Failed to load user list.");
        }
        setLoading(false);
    };

    // --- Toggle Verification Status ---
    const handleToggleVerified = async (uid, isVerified) => {
        const userRef = doc(db, 'users', uid);
        try {
            await updateDoc(userRef, {
                isVerified: isVerified,
            });
            // Update local state without full reload
            setUsers(prevUsers => prevUsers.map(user => 
                user.uid === uid ? { ...user, isVerified: isVerified } : user
            ));

            toast.success(`User verification status updated: ${isVerified ? 'Verified' : 'Unverified'}`);

        } catch (error) {
            console.error("Error updating verification status:", error);
            toast.error("Failed to update verification status.");
        }
    };
    
    // --- Post Announcement ---
    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        if (!announcementContent.trim()) {
            toast.error("Announcement cannot be empty.");
            return;
        }

        try {
            await addDoc(collection(db, 'posts'), {
                uid: userProfile.uid,
                username: userProfile.username,
                userProfilePic: userProfile.profilePicUrl || '/logo.png',
                content: announcementContent.trim(),
                timestamp: serverTimestamp(),
                likes: 0,
                comments: 0,
                shares: 0,
                isVerified: true,
                isAdmin: true,
                isAnnouncement: true, // Key flag for announcements
            });
            
            setAnnouncementContent('');
            toast.success("Official Announcement Posted!");

        } catch (error) {
            console.error("Error posting announcement: ", error);
            toast.error("Failed to post announcement.");
        }
    };

    if (loading || !isAdmin) {
        return <GlobalLoading />;
    }

    return (
        <div className="w-full p-4">
            <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-3xl font-extrabold text-gc-admin mb-6 flex items-center space-x-3 border-b border-gc-border pb-3"
            >
                <FaCrown />
                <span>Squad Admin Dashboard</span>
            </motion.h1>

            <div className="space-y-8">
                {/* 1. Announcement Panel */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gc-card p-6 rounded-xl shadow-2xl border border-gc-admin/50"
                >
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                        <FaBullhorn className="text-gc-primary" /> <span>Post Announcement</span>
                    </h2>
                    <form onSubmit={handlePostAnnouncement} className="space-y-3">
                        <textarea
                            value={announcementContent}
                            onChange={(e) => setAnnouncementContent(e.target.value)}
                            placeholder="Type the official announcement here..."
                            rows="4"
                            className="w-full p-3 bg-gc-vibe border border-gc-admin/50 rounded-xl text-white placeholder-gray-500 focus:ring-1 focus:ring-gc-admin transition"
                        />
                        <div className="flex justify-end">
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center space-x-2 px-6 py-2 bg-gc-admin text-gc-vibe font-bold rounded-full transition duration-300"
                            >
                                <FaFeather />
                                <span>Publish Globally</span>
                            </motion.button>
                        </div>
                    </form>
                </motion.div>

                {/* 2. User Verification/Moderation Panel */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gc-card p-6 rounded-xl shadow-2xl border border-gc-secondary/50"
                >
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                        <FaCheckCircle className="text-gc-verified" /> <span>Manage Verification Badges</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 gap-4">
                        {users.length > 0 ? (
                            users.map(user => (
                                <UserCard 
                                    key={user.uid} 
                                    user={user} 
                                    showAdminActions={true} 
                                    onToggleVerified={handleToggleVerified}
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-4">No other users found.</p>
                        )}
                    </div>
                </motion.div>
                
                {/* Placeholder for Moderation (Reported Posts) - Feature to be built */}
                {/* <motion.div>...</motion.div> */}
            </div>
        </div>
    );
};

export default AdminPage;
