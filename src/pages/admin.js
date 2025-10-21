// src/pages/admin.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/router';
import { collection, addDoc, serverTimestamp, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { FiCrown, FiSend, FiUserCheck, FiXCircle, FiUserPlus, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminPanel = () => {
    const { currentUser, loading, isAdmin } = useAuth();
    const router = useRouter();
    const [announcementContent, setAnnouncementContent] = useState('');
    const [users, setUsers] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [announcementLoading, setAnnouncementLoading] = useState(false);

    // Security Check: Redirect if not an Admin
    useEffect(() => {
        if (!loading && !currentUser) {
            router.push('/login');
        } else if (!loading && currentUser && !isAdmin) {
            // If logged in but not admin, redirect to home
            router.push('/'); 
            toast.error("Access Denied: Admin privileges required.");
        }
    }, [loading, currentUser, isAdmin, router]);

    // Fetch All Users for Management
    useEffect(() => {
        if (isAdmin) {
            const fetchUsers = async () => {
                const q = query(collection(db, "users"));
                const snapshot = await getDocs(q);
                const userList = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
                setUsers(userList);
                setDataLoading(false);
            };
            fetchUsers();
        }
    }, [isAdmin]);

    // Handle Admin Announcement Post
    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        const content = announcementContent.trim();
        if (!content) return;

        setAnnouncementLoading(true);
        try {
            await addDoc(collection(db, 'posts'), {
                authorUid: currentUser.uid,
                authorUsername: 'Admin', // Use a special Admin name
                authorAvatar: '/logo.png', // Use the logo for admin posts
                title: "Official Squad Announcement",
                content: content,
                timestamp: serverTimestamp(),
                type: 'admin_announcement', // Unique type for highlight
                likes: [],
                commentCount: 0,
                isVerified: true,
                isHighlighted: true,
            });

            setAnnouncementContent('');
            toast.success("Announcement posted successfully to the feed!");
        } catch (error) {
            console.error("Error posting announcement:", error);
            toast.error("Failed to post announcement.");
        } finally {
            setAnnouncementLoading(false);
        }
    };
    
    // Toggle Verified Status for a User
    const toggleVerified = async (user) => {
        const userDocRef = doc(db, 'users', user.uid);
        const newStatus = !user.isVerified;
        try {
            await updateDoc(userDocRef, { isVerified: newStatus });
            setUsers(prev => prev.map(u => 
                u.uid === user.uid ? { ...u, isVerified: newStatus } : u
            ));
            toast.success(`${user.username} is now ${newStatus ? 'Verified' : 'Unverified'}.`);
        } catch (error) {
            console.error("Error updating user status:", error);
            toast.error("Failed to update verification status.");
        }
    };

    if (loading || !currentUser || !isAdmin) return null;

    return (
        <div className="min-h-screen">
            <Head><title>Admin Panel | Special Squad</title></Head>
            <Header />

            <main className="pl-0 lg:pl-72 py-8 px-4 lg:px-6">
                <div className="max-w-6xl mx-auto space-y-10">
                    <h1 className="text-4xl font-extrabold text-white flex items-center space-x-3 border-b pb-2 border-gray-700">
                        <FiCrown className="text-yellow-400" />
                        <span>👑 Admin Dashboard</span>
                    </h1>

                    {/* Announcement Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 p-6 rounded-xl shadow-2xl border-2 border-yellow-500/50"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center">
                            <FiSend className="mr-2" /> Post Announcement
                        </h2>
                        <form onSubmit={handlePostAnnouncement} className="space-y-4">
                            <textarea
                                placeholder="Type your official, highlighted announcement here..."
                                value={announcementContent}
                                onChange={(e) => setAnnouncementContent(e.target.value)}
                                rows="4"
                                className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400 text-white focus:ring-2 focus:ring-yellow-400 focus:outline-none transition duration-300"
                                required
                            ></textarea>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={announcementLoading || !announcementContent.trim()}
                                className="flex items-center space-x-2 px-6 py-2 bg-yellow-600 text-white rounded-full font-bold hover:bg-yellow-700 transition duration-200 disabled:opacity-50"
                            >
                                <FiCrown />
                                <span>{announcementLoading ? 'Sending...' : 'Publish Official Announcement'}</span>
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* User Management Section */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                        <h2 className="text-2xl font-bold mb-6 text-gc-primary flex items-center">
                            <FiUsers className="mr-2" /> User Management
                        </h2>
                        {dataLoading ? (
                            <p className="text-gray-400">Loading user list...</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Username</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">UID</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-300 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {users.map((user) => (
                                            <tr key={user.uid} className="hover:bg-gray-700">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white flex items-center">
                                                    @{user.username}
                                                    {user.isAdmin && <FaCrown className="w-3 h-3 ml-2 text-yellow-400" />}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400 truncate">{user.uid}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {user.isVerified ? 'Verified' : 'Normal'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => toggleVerified(user)}
                                                        disabled={user.isAdmin}
                                                        className={`p-2 rounded-full transition duration-150 ${user.isVerified ? 'text-red-500 hover:bg-red-900/50' : 'text-green-500 hover:bg-green-900/50'} disabled:opacity-30`}
                                                        title={user.isVerified ? "Remove Verified" : "Promote to Verified"}
                                                    >
                                                        {user.isVerified ? <FiXCircle /> : <FiUserCheck />}
                                                    </motion.button>
                                                    {/* Additional moderation controls (Delete/Ban) can be added here */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Placeholder for Reported Posts (Future Feature) */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                        <h2 className="text-2xl font-bold text-red-400">Reported Posts Moderation (Future Feature)</h2>
                        <p className="text-gray-400 mt-2">Space reserved for moderating content.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
