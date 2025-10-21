// src/pages/profile/[username].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import PostCard from '../../components/PostCard';
import { useAuth } from '../../utils/AuthContext';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { FiMapPin, FiHeart, FiPhone, FiGlobe, FiCalendar, FiUserPlus, FiUserCheck, FiMessageCircle } from 'react-icons/fi';
import { FaCrown, FaVenusMars } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const UserProfile = () => {
    const router = useRouter();
    const { username } = router.query;
    const { currentUser, loading, userProfile: myProfile } = useAuth();
    
    const [profileData, setProfileData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [profileLoading, setProfileLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    
    // Redirect unauthenticated users
    useEffect(() => {
        if (!loading && !currentUser) {
            router.push('/login');
        }
    }, [loading, currentUser, router]);

    // Fetch Profile and Posts
    useEffect(() => {
        if (!username) return;

        const fetchUserData = async () => {
            setProfileLoading(true);
            try {
                // 1. Fetch User Profile by Username
                const userQuery = query(collection(db, "users"), where("username", "==", username.toLowerCase()));
                const userSnapshot = await getDocs(userQuery);
                
                if (userSnapshot.empty) {
                    setProfileData(null);
                    setProfileLoading(false);
                    return toast.error("User not found.");
                }

                const userData = userSnapshot.docs[0].data();
                setProfileData(userData);
                
                // 2. Check Follow Status
                const followingStatus = myProfile?.following?.includes(userData.uid) || false;
                setIsFollowing(followingStatus);

                // 3. Fetch User Posts
                const postsQuery = query(collection(db, "posts"), where("authorUid", "==", userData.uid));
                const postsSnapshot = await getDocs(postsQuery);
                const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUserPosts(postsList);

            } catch (error) {
                console.error("Error fetching user profile:", error);
                toast.error("Failed to load profile data.");
            } finally {
                setProfileLoading(false);
            }
        };

        if (myProfile) {
            fetchUserData();
        }
    }, [username, myProfile]); // Depend on username and myProfile

    // Handle Follow/Unfollow
    const handleFollowToggle = async () => {
        if (!profileData || !currentUser) return;
        const targetUid = profileData.uid;
        const myUid = currentUser.uid;

        if (targetUid === myUid) return toast.error("You can't follow yourself!");

        const userDocRef = doc(db, 'users', myUid);
        const targetDocRef = doc(db, 'users', targetUid);

        try {
            if (isFollowing) {
                // Unfollow
                await updateDoc(userDocRef, { following: arrayRemove(targetUid) });
                await updateDoc(targetDocRef, { followers: arrayRemove(myUid) });
                toast.success(`Unfollowed @${profileData.username}`);
                setIsFollowing(false);
            } else {
                // Follow
                await updateDoc(userDocRef, { following: arrayUnion(targetUid) });
                await updateDoc(targetDocRef, { followers: arrayUnion(myUid) });
                toast.success(`Following @${profileData.username}`);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("Follow/Unfollow error:", error);
            toast.error("Action failed.");
        }
    };
    
    // Function to initiate DM (Placeholder logic)
    const handleDM = () => {
        if (profileData) {
            // In a real app, this would route to a specific chat ID/thread
            router.push(`/chat?user=${profileData.username}`);
        }
    };


    if (loading || !currentUser || profileLoading) {
        return <div className="min-h-screen flex items-center justify-center text-white bg-gc-vibe">Loading...</div>;
    }

    if (!profileData) {
        return (
             <div className="min-h-screen">
                <Header />
                <main className="pl-0 lg:pl-72 py-8 px-4 lg:px-6 text-center text-gray-400 pt-20">
                    User @{username} not found.
                </main>
            </div>
        );
    }
    
    const isMyProfile = myProfile?.username === username;

    return (
        <div className="min-h-screen">
            <Head><title>@{username} | Profile</title></Head>
            <Header />

            <main className="pl-0 lg:pl-72 py-8 px-4 lg:px-6">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    {/* Cover Image and Avatar */}
                    <div className="relative h-64 bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
                        <img 
                            src={profileData.coverImgUrl || '/default-cover.jpg'} 
                            alt="Cover" 
                            className="w-full h-full object-cover" 
                        />
                        <div className="absolute -bottom-16 left-6">
                            <img 
                                src={profileData.profilePicUrl || '/default-avatar.png'} 
                                alt="Profile" 
                                className="w-32 h-32 rounded-full object-cover border-4 border-gray-900"
                            />
                        </div>
                    </div>
                    
                    {/* Profile Info and Actions */}
                    <div className="pt-20 px-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h1 className="text-4xl font-extrabold text-white flex items-center">
                                    @{profileData.username}
                                    {profileData.isVerified && <FiUserCheck className="w-6 h-6 ml-3 text-green-400" title="Verified Member" />}
                                    {profileData.isAdmin && <FaCrown className="w-6 h-6 ml-3 text-yellow-400" title="Admin" />}
                                </h1>
                                <p className="text-gray-400 mt-1">{profileData.bio}</p>
                            </div>

                            {!isMyProfile && (
                                <div className="flex space-x-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleDM}
                                        className="flex items-center space-x-2 px-4 py-2 bg-gc-secondary text-white rounded-full font-semibold hover:bg-purple-700 transition duration-200"
                                    >
                                        <FiMessageCircle />
                                        <span>DM</span>
                                    </motion.button>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleFollowToggle}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition duration-200 ${
                                            isFollowing ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gc-primary text-white hover:bg-pink-700'
                                        }`}
                                    >
                                        <FiUserPlus />
                                        <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
                                    </motion.button>
                                </div>
                            )}
                        </div>
                        
                        {/* Metrics and Additional Info */}
                        <div className="flex space-x-6 text-sm text-gray-400 mb-6 border-b pb-4 border-gray-700">
                            <span><strong className="text-white">{profileData.followers?.length || 0}</strong> Followers</span>
                            <span><strong className="text-white">{profileData.following?.length || 0}</strong> Following</span>
                            <span><strong className="text-white">{userPosts.length}</strong> Posts</span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
                            <div className="flex items-center space-x-2"><FiMapPin className="text-gc-secondary" /><span>{profileData.location || 'N/A'}</span></div>
                            <div className="flex items-center space-x-2"><FiHeart className="text-red-400" /><span>{profileData.relationshipStatus || 'N/A'}</span></div>
                            <div className="flex items-center space-x-2"><FaVenusMars className="text-blue-400" /><span>{profileData.sex || 'N/A'}</span></div>
                            <div className="flex items-center space-x-2"><FiCalendar className="text-yellow-400" /><span>Age: {profileData.age || 'N/A'}</span></div>
                            <div className="flex items-center space-x-2 col-span-2"><FiPhone className="text-green-500" /><span>WhatsApp: {profileData.whatsappNumber || 'N/A'}</span></div>
                            {/* Placeholder for social links */}
                            <div className="flex items-center space-x-2 col-span-2"><FiGlobe className="text-gc-primary" /><span>Social: <a href="#" className="hover:underline">Link</a></span></div>
                        </div>

                    </div>

                    {/* User Posts */}
                    <h2 className="text-2xl font-bold text-white border-b pb-2 border-gray-700">Posts by @{username}</h2>
                    
                    <div className="space-y-6">
                        {userPosts.length > 0 ? (
                            userPosts.map(post => <PostCard key={post.id} post={post} />)
                        ) : (
                            <p className="text-gray-400 p-6 text-center">@{username} hasn't posted anything yet.</p>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default UserProfile;
