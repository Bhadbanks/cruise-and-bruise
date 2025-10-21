// src/pages/admin.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { db } from '../utils/firebase';
import { doc, updateDoc, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { FiUserCheck, FiLink, FiPlusCircle, FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';

const AdminPanel = () => {
    const { currentUser, loading, isAdmin, userProfile, GC_LINK } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [newGCLink, setNewGCLink] = useState(GC_LINK);
    const [targetUsername, setTargetUsername] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && (!currentUser || !isAdmin)) {
            toast.error("Access Denied: Admin privileges required.");
            router.push('/');
        }
        if (isAdmin) {
            fetchUsers();
            setNewGCLink(GC_LINK);
        }
    }, [currentUser, loading, isAdmin, router, GC_LINK]);

    const fetchUsers = async () => {
        const usersCol = collection(db, 'users');
        const userSnapshot = await getDocs(usersCol);
        const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList.filter(user => user.uid !== userProfile.uid)); // Exclude self
    };

    const handleVerifyToggle = async (user) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        const newStatus = !user.isVerified;
        try {
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, {
                isVerified: newStatus
            });
            toast.success(`${user.username} is now ${newStatus ? 'Verified' : 'Unverified'}.`);
            fetchUsers();
        } catch (error) {
            console.error("Error toggling verification:", error);
            toast.error("Failed to update user status.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteUser = async (user) => {
        if (isSubmitting || !window.confirm(`Are you sure you want to delete user @${user.username}? This is irreversible!`)) return;
        setIsSubmitting(true);
        const batch = writeBatch(db);

        try {
            // 1. Delete user profile document
            const userRef = doc(db, 'users', user.id);
            batch.delete(userRef);

            // 2. Find and delete user's posts
            const q = query(collection(db, 'posts'), where('authorUid', '==', user.id));
            const postSnapshot = await getDocs(q);
            postSnapshot.docs.forEach(postDoc => {
                batch.delete(postDoc.ref);
            });

            // Note: Deleting the Firebase Auth user record must be done via a secure server function, 
            // but for this blueprint, we delete the profile and posts.
            
            await batch.commit();
            toast.success(`User @${user.username} and their posts have been deleted.`);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user and data:", error);
            toast.error("Failed to delete user and data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateGC = async (e) => {
        e.preventDefault();
        if (isSubmitting || newGCLink === GC_LINK) return;
        setIsSubmitting(true);
        
        try {
            const settingsRef = doc(db, 'settings', 'general');
            await updateDoc(settingsRef, {
                GC_LINK: newGCLink,
            });
            toast.success("WhatsApp GC link updated successfully!");
        } catch (error) {
            console.error("Error updating GC link:", error);
            toast.error("Failed to update GC link.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || !isAdmin) return <GlobalLoading />;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 lg:p-8 space-y-8 min-h-[calc(100vh-80px)]"
        >
            <Head><title>Admin Dashboard | Special Squad</title></Head>
            
            <motion.h1 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-3xl font-extrabold text-yellow-400 flex items-center space-x-3 border-b pb-4 border-gray-700"
            >
                <FaCrown className="w-8 h-8" />
                <span>Squad Admin Dashboard</span>
            </motion.h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Admin Actions */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1 bg-gray-800 p-6 rounded-xl shadow-xl border border-yellow-600"
                >
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2"><FiSettings /><span>Settings & Announcements</span></h2>
                    
                    {/* Update GC Link */}
                    <form onSubmit={handleUpdateGC} className="space-y-4 pt-2">
                        <label className="block text-gray-300 font-semibold">Update WhatsApp GC Link</label>
                        <div className="flex space-x-2">
                            <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="url"
                                value={newGCLink}
                                onChange={(e) => setNewGCLink(e.target.value)}
                                placeholder="https://chat.whatsapp.com/..."
                                className="flex-grow p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                required
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={isSubmitting || newGCLink === GC_LINK}
                                className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition duration-200 disabled:opacity-50"
                            >
                                Update
                            </motion.button>
                        </div>
                    </form>

                    <div className="mt-6 border-t border-gray-700 pt-4">
                        <h3 className="text-lg font-bold text-gray-300 mb-3">Admin Post/Announcement</h3>
                         <p className="text-sm text-gray-400 italic mb-4">
                            Use the **Create Post** component on the main feed (/) for announcements. They will be automatically highlighted because you are the Admin.
                        </p>
                        <motion.button
                            onClick={() => router.push('/')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center space-x-2 py-3 bg-gc-primary text-white rounded-lg font-semibold hover:bg-pink-700 transition duration-200"
                        >
                            <FiPlusCircle />
                            <span>Go to Post Announcement</span>
                        </motion.button>
                    </div>

                </motion.div>

                {/* 2. User Moderation List */}
                <motion.div 
                    initial={{ x: 20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-xl border border-gc-secondary"
                >
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2"><FiUsers /><span>User Moderation ({users.length})</span></h2>
                    
                    <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-3">
                        {users.length === 0 ? (
                            <p className="text-gray-400 italic">No other users found.</p>
                        ) : (
                            users.map(user => (
                                <div key={user.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <img src={user.profilePicUrl || '/default-avatar.png'} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                                        <div>
                                            <span className="font-semibold text-white block">@{user.username}</span>
                                            <span className={`text-xs ${user.isVerified ? 'text-green-400' : 'text-gray-400'}`}>
                                                {user.isVerified ? 'Verified' : 'Unverified'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleVerifyToggle(user)}
                                            disabled={isSubmitting}
                                            className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-full transition duration-200 ${
                                                user.isVerified ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'
                                            }`}
                                        >
                                            <FiUserCheck />
                                            <span>{user.isVerified ? 'Unverify' : 'Verify'}</span>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleDeleteUser(user)}
                                            disabled={isSubmitting}
                                            className="px-3 py-1 bg-red-800 hover:bg-red-900 text-white rounded-full text-sm transition duration-200"
                                            title="Delete User"
                                        >
                                            <FiTrash2 />
                                        </motion.button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
            
            {/* Moderation/Reported Posts Section - Placeholder */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700"
            >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2"><FiAlertTriangle className="text-red-400"/><span>Reported Content (Placeholder)</span></h2>
                <p className="text-gray-400">Future feature: This section will list reported posts for moderation actions (delete, mute user).</p>
            </motion.div>

        </motion.div>
    );
};

export default AdminPanel;
