import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { useAuth } from '../utils/AuthContext';
import { collection, query, getDocs, doc, updateDoc, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { FiUsers, FiLock, FiStar, FiRefreshCw, FiAlertTriangle, FiSend } from 'react-icons/fi';
import { FaCrown, FaCheckCircle, FaBan, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Admin = () => {
    const { userProfile, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();

    const [allUsers, setAllUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [announcement, setAnnouncement] = useState({ title: '', content: '' });
    const [loadingAnnouncement, setLoadingAnnouncement] = useState(false);

    // --- Access Control ---
    useEffect(() => {
        if (!authLoading && !isAdmin) {
            toast.error("Access Denied: Admin privileges required.");
            router.push('/');
        }
    }, [authLoading, isAdmin, router]);
    
    // --- Data Fetching ---
    const fetchAllUsers = async () => {
        setLoadingUsers(true);
        try {
            const usersCol = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCol);
            const usersList = usersSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setAllUsers(usersList);
        } catch (error) {
            console.error("Error fetching all users:", error);
            toast.error("Failed to load user list.");
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            fetchAllUsers();
        }
    }, [isAdmin]);

    if (authLoading || !isAdmin) return null; // Prevent rendering if not admin or still loading

    // --- Moderation Functions ---
    const handleToggleVerification = async (user) => {
        if (user.isAdmin) {
            toast.error("Cannot change verification status of the main Admin user.");
            return;
        }

        const userRef = doc(db, 'users', user.uid);
        const newStatus = !user.isVerified;

        try {
            await updateDoc(userRef, { isVerified: newStatus });
            toast.success(`User @${user.username} is now ${newStatus ? 'Verified' : 'Unverified'}.`);
            fetchAllUsers(); // Refresh list
        } catch (error) {
            console.error("Error toggling verification:", error);
            toast.error("Failed to update status.");
        }
    };

    const handleDeleteUser = async (user) => {
        if (!window.confirm(`Are you absolutely sure you want to DELETE user @${user.username}? This action is irreversible.`)) return;
        if (user.isAdmin) {
            toast.error("Cannot delete Admin user.");
            return;
        }

        const userRef = doc(db, 'users', user.uid);
        
        try {
            // Note: Firebase security rules should handle actual deletion of posts/data. 
            // Here we just mark the profile as deleted/banned for front-end blocking.
            await updateDoc(userRef, { 
                isDeleted: true,
                username: `deleted_user_${user.uid.substring(0, 8)}`,
                email: `deleted_${user.email}`,
                profilePicUrl: '/banned-avatar.png'
            });
            toast.success(`User @${user.username} has been blocked/deleted.`);
            fetchAllUsers(); // Refresh list
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user.");
        }
    };

    // --- Announcement Function ---
    const handlePublishAnnouncement = async (e) => {
        e.preventDefault();
        if (announcement.title.trim() === '' || announcement.content.trim() === '') {
            toast.error("Title and content are required for an announcement.");
            return;
        }

        setLoadingAnnouncement(true);

        try {
            await addDoc(collection(db, 'posts'), {
                authorUid: userProfile.uid,
                authorUsername: userProfile.username,
                authorAvatar: userProfile.profilePicUrl,
                title: announcement.title.trim(),
                content: announcement.content.trim(),
                timestamp: serverTimestamp(),
                type: 'admin_announcement', // The key differentiator for the feed
                likes: [],
                commentCount: 0,
                isVerified: true, // Announcements are always verified
            });

            setAnnouncement({ title: '', content: '' });
            toast.success("Official Announcement Published!");

        } catch (error) {
            console.error("Error publishing announcement:", error);
            toast.error("Failed to publish announcement.");
        } finally {
            setLoadingAnnouncement(false);
        }
    };


    return (
        <div className="min-h-screen">
            <Head><title>Admin Panel | Special Squad</title></Head>
            <Header />

            <main className="pl-72 py-8 px-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-extrabold mb-8 text-yellow-400 flex items-center border-b pb-4 border-gray-700">
                        <FaCrown className="mr-3 w-8 h-8" />
                        Admin Command Center
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* ------------------------------------- */}
                        {/* LEFT COLUMN: Publish Announcement */}
                        {/* ------------------------------------- */}
                        <div className="lg:col-span-1">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-800 p-6 rounded-xl shadow-2xl border-l-4 border-gc-primary"
                            >
                                <h2 className="text-2xl font-bold mb-4 flex items-center text-gc-primary">
                                    <FiSend className="mr-2" /> Publish Announcement
                                </h2>
                                <form onSubmit={handlePublishAnnouncement} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Announcement Title"
                                        value={announcement.title}
                                        onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
                                        className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                        required
                                    />
                                    <textarea
                                        placeholder="Official message to the entire Squad..."
                                        value={announcement.content}
                                        onChange={(e) => setAnnouncement({...announcement, content: e.target.value})}
                                        rows="6"
                                        className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                        required
                                    ></textarea>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        type="submit"
                                        disabled={loadingAnnouncement}
                                        className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                    >
                                        {loadingAnnouncement ? 'Sending...' : 'Publish to Feed'}
                                    </motion.button>
                                </form>
                            </motion.div>
                        </div>
                        
                        {/* ------------------------------------- */}
                        {/* RIGHT COLUMN: User Management */}
                        {/* ------------------------------------- */}
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-bold mb-6 flex items-center text-white border-b pb-2 border-gray-700">
                                <FiUsers className="mr-2" /> User Management ({allUsers.length})
                            </h2>
                            
                            {loadingUsers ? (
                                <div className="text-center p-10 text-gray-400">
                                    <FiRefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-gc-primary" />
                                    <p>Loading users for moderation...</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                                    {allUsers.map(user => (
                                        <AdminUserRow 
                                            key={user.uid} 
                                            user={user} 
                                            onToggleVerification={handleToggleVerification}
                                            onDeleteUser={handleDeleteUser}
                                            currentAdminUid={userProfile.uid}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- Reusable Component for Admin Table Row ---
const AdminUserRow = ({ user, onToggleVerification, onDeleteUser, currentAdminUid }) => {
    const isSelf = user.uid === currentAdminUid;
    const isBanned = user.isDeleted; // Using isDeleted as a stand-in for 'banned'

    return (
        <div className={`flex items-center p-4 rounded-lg transition duration-200 shadow-md ${user.isAdmin ? 'bg-purple-900/50 border border-purple-500' : isBanned ? 'bg-red-900/50 border border-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}>
            <img src={user.profilePicUrl || '/default-avatar.png'} alt={user.username} className="w-10 h-10 rounded-full object-cover mr-4" />
            
            <div className="flex-1 min-w-0">
                <p className={`font-bold truncate flex items-center ${user.isAdmin ? 'text-yellow-300' : ''}`}>
                    {user.username}
                    {user.isAdmin && <FaCrown className="w-3 h-3 ml-2 text-yellow-400" title="System Admin" />}
                    {user.isVerified && !user.isAdmin && <FaCheckCircle className="w-3 h-3 ml-2 text-green-400" title="Verified" />}
                </p>
                <p className="text-sm text-gray-400 truncate">{user.email}</p>
            </div>

            <div className="flex items-center space-x-3 ml-4">
                {/* Verification Toggle */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => onToggleVerification(user)}
                    disabled={isSelf || user.isAdmin || isBanned}
                    className={`px-3 py-2 text-sm rounded-full font-semibold transition ${user.isVerified ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white disabled:opacity-50`}
                >
                    {user.isVerified ? <FiLock className='inline-block mr-1'/> : <FiStar className='inline-block mr-1'/>}
                    {user.isVerified ? 'Unverify' : 'Verify'}
                </motion.button>
                
                {/* Delete/Ban Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleDeleteUser(user)}
                    disabled={isSelf || user.isAdmin}
                    className={`px-3 py-2 text-sm rounded-full font-semibold transition bg-red-700 hover:bg-red-800 text-white disabled:opacity-50`}
                >
                    {isBanned ? <FaBan className='inline-block mr-1'/> : <FaTrash className='inline-block mr-1'/>}
                    {isBanned ? 'Blocked' : 'Ban/Delete'}
                </motion.button>
            </div>
        </div>
    );
};

export default Admin;
