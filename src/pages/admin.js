// src/pages/admin.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaCheckCircle, FaFeatherAlt } from 'react-icons/fa';
import { FiAlertCircle, FiUserCheck, FiSend } from 'react-icons/fi';
import { useAuth } from '../utils/AuthContext';
import { db } from '../utils/firebase';
import { collection, query, getDocs, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import UserCard from '../components/UserCard'; // Reused for user moderation

const AdminPage = () => {
    const { isAdmin, userProfile } = useAuth();
    const [users, setUsers] = useState([]);
    const [announcementContent, setAnnouncementContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
        } else if (!isAdmin && userProfile) {
            toast.error("Access Denied: Admin privileges required.");
        }
    }, [isAdmin, userProfile]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'users'));
            const snapshot = await getDocs(q);
            const fetchedUsers = snapshot.docs.map(doc => doc.data());
            setUsers(fetchedUsers.filter(u => !u.isAdmin)); // Filter out admin user(s)
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load user list.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleVerified = async (uid, status) => {
        try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, { isVerified: status });
            toast.success(status ? "User verified!" : "Verification removed.");
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error("Error updating verification:", error);
            toast.error("Failed to update user status.");
        }
    };

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        if (announcementContent.trim() === '') return;

        try {
            await addDoc(collection(db, 'posts'), {
                uid: userProfile.uid,
                username: userProfile.username,
                userProfilePic: userProfile.profilePicUrl || '/default-avatar.png',
                content: announcementContent.trim(),
                timestamp: serverTimestamp(),
                likes: 0,
                comments: 0,
                shares: 0,
                isVerified: true,
                isAdmin: true,
                isAnnouncement: true, // Key marker for announcements
            });

            setAnnouncementContent('');
            toast.success("Squad Announcement posted successfully!");
        } catch (error) {
            console.error("Error posting announcement:", error);
            toast.error("Failed to post announcement.");
        }
    };

    if (!isAdmin) {
        return <motion.div className="p-8 text-center text-red-500">You must be the 👑 Admin 👑 to view this page.</motion.div>;
    }

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading Admin Panel...</div>;
    }

    return (
        <div className="w-full p-4">
            <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-extrabold text-gc-admin mb-6 flex items-center space-x-3"
            >
                <FaCrown /> <span>Admin Control Panel</span>
            </motion.h1>

            {/* Announcement Section */}
            <div className="mb-8 p-6 bg-gc-card rounded-xl border-2 border-gc-admin/50 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2"><FiAlertCircle className="text-red-500" /> <span>Post Global Announcement</span></h2>
                <form onSubmit={handlePostAnnouncement} className="space-y-4">
                    <textarea
                        value={announcementContent}
                        onChange={(e) => setAnnouncementContent(e.target.value)}
                        placeholder="Type your official message for all Squad members..."
                        rows="4"
                        className="w-full p-3 bg-gc-vibe border border-gc-border rounded-lg text-white placeholder-gray-500 focus:ring-1 focus:ring-red-500 transition"
                        maxLength={500}
                    />
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={announcementContent.trim() === ''}
                        className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white font-bold rounded-full disabled:opacity-50 transition duration-300"
                    >
                        <FiSend />
                        <span>Post Announcement</span>
                    </motion.button>
                </form>
            </div>


            {/* User Moderation Section */}
            <div className="p-6 bg-gc-card rounded-xl border border-gc-border shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2"><FiUserCheck className="text-gc-verified" /> <span>User Verification & Moderation ({users.length} members)</span></h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <p className="col-span-2 text-center text-gray-500 py-10">No non-admin users found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
