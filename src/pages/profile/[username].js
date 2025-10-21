import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import PostCard from '../../components/PostCard';
import UserCard from '../../components/UserCard';
import { collection, query, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../../utils/AuthContext';
import { FiEdit, FiRefreshCw, FiMapPin, FiHeart, FiLink, FiMail } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Profile = () => {
    const router = useRouter();
    const { username: targetUsername } = router.query;
    const { currentUser, userProfile, loading: authLoading } = useAuth();

    const [targetUser, setTargetUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Authentication check and data fetching
    useEffect(() => {
        if (authLoading || !targetUsername) return;
        if (!currentUser) {
            router.push('/login');
            return;
        }

        const fetchTargetUser = async () => {
            setLoading(true);
            try {
                // Find user by username (Indexed query required for production)
                const usersQuery = query(collection(db, 'users'), where('username', '==', targetUsername));
                const userSnapshot = await getDocs(usersQuery);

                if (userSnapshot.empty) {
                    setTargetUser(null);
                    setLoading(false);
                    toast.error("User not found.");
                    return;
                }

                const userData = userSnapshot.docs[0].data();
                setTargetUser(userData);

                // Setup listener for user's posts
                const postsQuery = query(
                    collection(db, 'posts'), 
                    where('authorUid', '==', userData.uid),
                    orderBy('timestamp', 'desc')
                );

                const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
                    const postsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setUserPosts(postsList);
                });

                setLoading(false);
                return () => unsubscribePosts(); // Cleanup post listener

            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load user profile.");
                setLoading(false);
            }
        };

        fetchTargetUser();
    }, [targetUsername, currentUser, authLoading, router]);

    if (authLoading || loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>;
    }
    
    if (!targetUser) {
        return <div className="min-h-screen flex items-center justify-center">Profile Not Found (404)</div>;
    }

    const isMyProfile = currentUser?.uid === targetUser.uid;

    return (
        <div className="min-h-screen">
            <Head><title>{targetUsername}'s Profile | Special Squad</title></Head>
            <Header />

            <main className="pl-72 py-8 px-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    
                    {/* Cover Image and Profile Picture */}
                    <div className="bg-gray-800 rounded-xl shadow-2xl relative overflow-hidden">
                        <img 
                            src={targetUser.coverImgUrl || '/default-cover.jpg'} 
                            alt="Cover" 
                            className="w-full h-48 object-cover opacity-70"
                        />
                        <div className="p-6">
                            <img 
                                src={targetUser.profilePicUrl || '/default-avatar.png'} 
                                alt="Profile" 
                                className="w-32 h-32 rounded-full border-4 border-gray-800 absolute top-24 left-10 object-cover shadow-xl"
                            />
                            
                            <div className="pt-16 flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold flex items-center text-white">
                                        @{targetUser.username}
                                        {targetUser.isVerified && <FaCrown className="w-5 h-5 ml-2 text-yellow-400" title="Verified" />}
                                    </h1>
                                    <p className="text-gray-400 mt-1">{targetUser.bio || 'The quiet type. No bio set yet.'}</p>
                                </div>
                                
                                {isMyProfile ? (
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }} 
                                        onClick={() => router.push('/settings/edit-profile')} // Placeholder for profile edit route
                                        className="flex items-center space-x-2 px-4 py-2 bg-gc-primary text-white rounded-full font-semibold"
                                    >
                                        <FiEdit /> <span>Edit Profile</span>
                                    </motion.button>
                                ) : (
                                    <UserCard user={targetUser} variant="button-only" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Details & Posts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Left Column: Details & Social Links */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                                <h2 className="text-xl font-bold mb-4 text-gc-primary">About</h2>
                                <div className="space-y-3 text-gray-300">
                                    <p className="flex items-center space-x-2"><FiMapPin className="text-pink-400" /> <span>Location: {targetUser.location || 'N/A'}</span></p>
                                    <p className="flex items-center space-x-2"><FiHeart className="text-purple-400" /> <span>Status: {targetUser.relationshipStatus || 'N/A'}</span></p>
                                    <p>Age: {targetUser.age || 'N/A'}</p>
                                    <p>Sex: {targetUser.sex || 'N/A'}</p>
                                    <p className="pt-2">Interests: <span className="text-gray-400">{targetUser.interests?.join(', ') || 'None'}</span></p>
                                    <p className="text-sm">Joined: {new Date(targetUser.createdAt?.toDate()).toLocaleDateString()}</p>
                                </div>
                            </div>
                            
                            {/* Social Links */}
                            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                                <h2 className="text-xl font-bold mb-4 text-gc-primary">Contact / Links</h2>
                                <div className="space-y-3">
                                    <p className="flex items-center space-x-2 text-gray-400"><FiMail /> <span>{targetUser.email}</span></p>
                                    {targetUser.whatsappNumber && (
                                        <a href={`https://wa.me/${targetUser.whatsappNumber.replace(/[^0-9+]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-green-500 hover:text-green-400 transition duration-200">
                                            <FaWhatsapp /> <span>{targetUser.whatsappNumber}</span>
                                        </a>
                                    )}
                                    {/* Add logic for rendering other social links */}
                                    {targetUser.socialLinks?.twitter && (
                                        <a href={targetUser.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition duration-200">
                                            <FiLink /> <span>Twitter</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: User Posts */}
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-2xl font-bold text-white border-b pb-2 border-gray-700">Posts by @{targetUser.username} ({userPosts.length})</h2>
                            
                            {userPosts.length === 0 ? (
                                <p className="text-center text-gray-400 p-10">This user hasn't posted anything yet.</p>
                            ) : (
                                userPosts.map(post => <PostCard key={post.id} post={post} />)
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
