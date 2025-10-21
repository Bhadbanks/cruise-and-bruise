// src/pages/profile/[username].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../../utils/AuthContext';
import { motion } from 'framer-motion';
import { FaCrown, FaCheckCircle, FaMapMarkerAlt, FaHeart, FaCalendarAlt, FaWhatsapp } from 'react-icons/fa';
import { FiFeather, FiMail, FiGlobe } from 'react-icons/fi';
import GlobalLoading from '../../components/GlobalLoading';
import PostCard from '../index'; // Reuse the PostCard component

const ProfilePage = () => {
    const router = useRouter();
    const { username } = router.query;
    const { userProfile: currentUserProfile, currentUser, DEVELOPER_WHATSAPP } = useAuth();
    
    const [profileData, setProfileData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false); // Simplified for MVP

    // --- Data Fetching ---
    useEffect(() => {
        if (!username) return;

        const fetchProfileData = async () => {
            setLoading(true);
            try {
                // 1. Fetch User Profile by Username (Unique constraint assumed)
                const userQuery = query(collection(db, 'users'), where('username', '==', username));
                const userSnap = await getDocs(userQuery);

                if (userSnap.empty) {
                    setProfileData(null);
                    setLoading(false);
                    toast.error("Profile not found!");
                    return;
                }
                
                const profile = userSnap.docs[0].data();
                setProfileData(profile);
                
                // 2. Fetch User Posts (Placeholder query, should be optimized)
                const postsQuery = query(collection(db, 'posts'), where('username', '==', username), limit(10), orderBy('timestamp', 'desc'));
                const postsSnap = await getDocs(postsQuery);
                const postsList = postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), timeAgo: 'Recent' }));
                setUserPosts(postsList);

                // 3. Check follow status (Simplified for MVP, actual logic requires a 'followers' collection)
                // setIsFollowing(checkFollowStatus(currentUserProfile.uid, profile.uid)); 

            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load profile.");
            }
            setLoading(false);
        };

        if (currentUser) {
            fetchProfileData();
        } else {
            setLoading(false); // Allow unauthenticated user to see if they land here
        }

    }, [username, currentUser]);

    // Simplified Follow/Unfollow Handler (Placeholder for now)
    const handleFollowToggle = () => {
        if (!currentUser) {
            toast.error("You must be logged in to follow users.");
            return;
        }
        // *Actual Firestore logic would go here*
        setIsFollowing(!isFollowing);
        toast.success(isFollowing ? `Unfollowed @${username}` : `Following @${username}!`);
    };

    if (loading) {
        return <GlobalLoading />;
    }

    if (!profileData) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-white bg-gc-vibe p-4">
                <p className="text-xl text-gray-500">Sorry, this user profile doesn't exist or was removed.</p>
            </div>
        );
    }
    
    const isOwner = currentUserProfile?.username === username;
    const { coverImageUrl, profilePicUrl, bio, followersCount = 0, followingCount = 0 } = profileData;

    return (
        <div className="w-full">
            {/* Header / Cover Image */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gc-card shadow-2xl border-b-2 border-gc-primary"
            >
                <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${coverImageUrl || '/default-cover.jpg'})` }}>
                    {/* Cover image content */}
                </div>

                <div className="p-4 relative">
                    {/* Profile Picture */}
                    <img 
                        src={profilePicUrl || '/default-avatar.png'} 
                        alt={`${username}'s avatar`} 
                        className="w-24 h-24 rounded-full object-cover border-4 border-gc-vibe absolute -top-12 left-4 shadow-xl"
                    />

                    {/* Actions */}
                    <div className="flex justify-end pt-2">
                        {isOwner ? (
                            <motion.button 
                                whileHover={{ scale: 1.05 }} 
                                className="px-4 py-2 bg-gc-secondary text-white rounded-full font-semibold"
                                onClick={() => router.push('/settings/profile')} // Placeholder for settings
                            >
                                Edit Profile
                            </motion.button>
                        ) : (
                            <motion.button
                                onClick={handleFollowToggle}
                                whileHover={{ scale: 1.05 }}
                                className={`px-4 py-2 rounded-full font-bold transition duration-300 ${
                                    isFollowing 
                                        ? 'bg-gc-secondary/20 text-gc-secondary border border-gc-secondary' 
                                        : 'bg-gc-primary text-white shadow-gc-glow'
                                }`}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </motion.button>
                        )}
                    </div>

                    {/* Basic Info */}
                    <div className="mt-4">
                        <div className="flex items-center space-x-1">
                            <h2 className="text-2xl font-bold text-white">@{username}</h2>
                            {profileData.isAdmin && <FaCrown className="w-4 h-4 text-gc-admin" title="Admin" />}
                            {profileData.isVerified && !profileData.isAdmin && <FaCheckCircle className="w-4 h-4 text-gc-verified" title="Verified" />}
                        </div>
                        <p className="text-gray-400 mt-1">{bio || 'No bio yet.'}</p>
                        
                        <div className="flex space-x-4 text-sm text-gray-500 mt-2">
                            <span><span className="font-bold text-white">{followingCount}</span> Following</span>
                            <span><span className="font-bold text-white">{followersCount}</span> Followers</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Detailed Info & Posts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-4">
                
                {/* Left Column: Details */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="col-span-1 bg-gc-card p-6 rounded-xl shadow-lg border border-gc-border h-fit"
                >
                    <h3 className="text-xl font-bold text-gc-primary mb-4 border-b border-gc-border pb-2">
                        Vibe Details
                    </h3>
                    <div className="space-y-3 text-gray-300">
                        <p className="flex items-center space-x-2"><FaMapMarkerAlt className="text-gc-secondary" /> <span>**Location:** {profileData.location || 'N/A'}</span></p>
                        <p className="flex items-center space-x-2"><FaHeart className="text-gc-primary" /> <span>**Status:** {profileData.relationshipStatus || 'N/A'}</span></p>
                        <p className="flex items-center space-x-2"><FiMail className="text-white" /> <span>**Email:** {profileData.email || 'Private'}</span></p>
                        <p className="flex items-center space-x-2"><FaCalendarAlt className="text-gc-secondary" /> <span>**Age/Sex:** {profileData.age || 'N/A'} / {profileData.sex || 'N/A'}</span></p>
                        <p className="text-sm pt-2">**Interests:** {profileData.interests || 'None listed'}</p>
                    </div>

                    <h3 className="text-xl font-bold text-gc-primary mt-6 mb-4 border-b border-gc-border pb-2">
                        Squad Connect
                    </h3>
                    <div className="space-y-3">
                        {profileData.whatsappNumber && (
                             <motion.a
                                href={`https://wa.me/${profileData.whatsappNumber.replace(/[^0-9+]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center justify-center space-x-2 p-2 bg-green-600 text-white rounded-lg font-semibold transition"
                            >
                                <FaWhatsapp />
                                <span>WhatsApp Me (Direct)</span>
                            </motion.a>
                        )}
                        {profileData.whatsappConvoLink && (
                             <motion.a
                                href={profileData.whatsappConvoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center justify-center space-x-2 p-2 bg-gc-secondary text-white rounded-lg font-semibold transition"
                            >
                                <FiGlobe />
                                <span>WhatsApp Link on Profile</span>
                            </motion.a>
                        )}
                    </div>
                </motion.div>

                {/* Right Column: User Posts (Main Content) */}
                <div className="col-span-1 xl:col-span-2 space-y-4">
                    <h3 className="text-2xl font-bold text-white border-b border-gc-border pb-2 flex items-center space-x-2">
                        <FiFeather className="text-gc-primary" /> <span>@{username}'s Posts ({userPosts.length})</span>
                    </h3>
                    {userPosts.length > 0 ? (
                        userPosts.map(post => (
                            // NOTE: PostCard is imported from the index.js file, assuming it's exported there
                            <PostCard key={post.id} post={post} /> 
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-10">This user hasn't posted anything yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
