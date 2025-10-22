// src/pages/profile/[username].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { FiMapPin, FiHeart, FiGlobe, FiPhone, FiCalendar, FiUser, FiInfo, FiMessageCircle, FiCircle } from 'react-icons/fi';
import GlobalLoading from '../../components/GlobalLoading';
import PostCard from '../../components/PostCard'; 
import toast from 'react-hot-toast';
import { useAuth } from '../../utils/AuthContext';

const ProfilePage = () => {
    const router = useRouter();
    const { username: targetUsername } = router.query;
    const { userProfile: loggedInUser } = useAuth();
    
    const [profileData, setProfileData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);

    useEffect(() => {
        if (!targetUsername) return;

        const fetchProfile = async () => {
            setLoading(true);
            try {
                // 1. Get UID from username collection
                const usernameSnap = await getDoc(doc(db, 'usernames', targetUsername.toLowerCase()));
                if (!usernameSnap.exists()) {
                    setProfileData(null);
                    setLoading(false);
                    return;
                }
                const targetUid = usernameSnap.data().uid;

                // 2. Get full profile data
                const userSnap = await getDoc(doc(db, 'users', targetUid));
                if (userSnap.exists()) {
                    setProfileData(userSnap.data());
                    fetchUserPosts(targetUid);
                } else {
                    setProfileData(null);
                }

            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load user profile.");
            } finally {
                setLoading(false);
            }
        };
        
        const fetchUserPosts = async (uid) => {
             setLoadingPosts(true);
             try {
                 const postsQuery = query(collection(db, 'posts'), where('uid', '==', uid));
                 const postSnapshot = await getDocs(postsQuery);
                 setPosts(postSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
             } catch (error) {
                 console.error("Error fetching posts:", error);
                 toast.error("Failed to load user posts.");
             } finally {
                 setLoadingPosts(false);
             }
        }

        fetchProfile();
    }, [targetUsername]);

    if (loading) return <GlobalLoading />;
    if (!profileData) {
        return (
            <div className="p-8 text-center text-red-500">
                <h1 className="text-3xl font-bold">404 Vibe Not Found</h1>
                <p className="text-gray-400 mt-2">The user @{targetUsername} does not exist in the Squad.</p>
            </div>
        );
    }
    
    // Check if the current user is viewing their own profile
    const isOwner = loggedInUser?.username === profileData.username;
    
    // Helper function to render info blocks
    const InfoBlock = ({ icon: Icon, title, value, link }) => {
        if (!value) return null;
        return (
            <div className="flex items-start space-x-3 text-sm">
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5 text-gc-secondary" />
                <div>
                    <p className="text-gray-400">{title}</p>
                    {link ? (
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-gc-primary hover:underline font-medium break-all">
                            {value}
                        </a>
                    ) : (
                        <p className="text-white font-medium break-words">{value}</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full bg-gc-vibe"
        >
            {/* Cover Image Placeholder */}
            <div className="h-40 bg-gc-primary/20 relative" style={{ backgroundImage: profileData.coverImageUrl ? `url(${profileData.coverImageUrl})` : 'none', backgroundSize: 'cover' }}>
                <div className="absolute inset-0 bg-gc-vibe/50"></div>
            </div>

            {/* Profile Header */}
            <div className="px-4 -mt-16 pb-4 border-b border-gc-border">
                <div className="flex justify-between items-end">
                    <div className="relative">
                        <img 
                            src={profileData.profilePicUrl || '/default-avatar.png'} 
                            alt={profileData.username} 
                            className="w-32 h-32 rounded-full object-cover border-4 border-gc-vibe shadow-xl"
                        />
                        {/* Online Status */}
                        <FiCircle className={`absolute bottom-0 right-0 w-5 h-5 ${profileData.isOnline ? 'text-green-500' : 'text-gray-500'} bg-gc-vibe rounded-full border border-gc-vibe`} />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2 mb-2">
                        {!isOwner && (
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                className="px-4 py-2 bg-gc-secondary text-white font-bold rounded-full transition"
                                onClick={() => router.push(`/chat?user=${profileData.uid}`)} // Simple chat route link
                            >
                                <FiMessageCircle className="inline w-5 h-5 mr-1" /> Vibe Chat
                            </motion.button>
                        )}
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            className="px-4 py-2 border border-gc-primary text-gc-primary font-bold rounded-full transition"
                        >
                            Follow
                        </motion.button>
                    </div>
                </div>
                
                {/* User Details */}
                <h1 className="text-3xl font-extrabold text-white mt-3 flex items-center space-x-2">
                    <span>@{profileData.username}</span>
                    {profileData.isAdmin && <FaCrown className="w-5 h-5 text-gc-admin" title="Admin" />}
                    {profileData.isVerified && !profileData.isAdmin && <FaCheckCircle className="w-4 h-4 text-gc-verified" title="Verified" />}
                </h1>
                <p className="text-gray-400 mt-1 mb-3">{profileData.bio || 'This user is part of the Squad Vibe.'}</p>
                
                {/* Stats */}
                <div className="flex space-x-4 text-sm text-gray-400">
                    <span><span className="font-bold text-white">{profileData.followingCount || 0}</span> Following</span>
                    <span><span className="font-bold text-white">{profileData.followersCount || 0}</span> Followers</span>
                </div>
            </div>

            {/* Custom Profile Info Section */}
            <div className="p-4 border-b border-gc-border bg-gc-card/50">
                <h2 className="text-xl font-bold text-gc-primary mb-4 flex items-center space-x-2"><FiInfo /> <span>Squad Vibe Details</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoBlock icon={FiMapPin} title="Location" value={profileData.location} />
                    <InfoBlock icon={FiCalendar} title="Age" value={profileData.age} />
                    <InfoBlock icon={FiUser} title="Sex" value={profileData.sex} />
                    <InfoBlock icon={FiHeart} title="Relationship Status" value={profileData.relationshipStatus} />
                    
                    {/* Private Contact Fields */}
                    <InfoBlock icon={FiPhone} title="WhatsApp Number" value={profileData.whatsappNumber} />
                    <InfoBlock 
                        icon={FiGlobe} 
                        title="Convo Link" 
                        value={profileData.whatsappConvoLink ? "Connect on WhatsApp" : null}
                        link={profileData.whatsappConvoLink}
                    />
                </div>
            </div>

            {/* User Posts/Timeline */}
            <div className="divide-y divide-gc-border">
                 <h2 className="text-xl font-bold text-white p-4">@{profileData.username}'s Posts ({posts.length})</h2>
                {loadingPosts ? (
                    <p className="text-center text-gray-500 py-10">Loading posts...</p>
                ) : posts.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">This user hasn't shared any vibes yet.</p>
                ) : (
                    posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))
                )}
            </div>
        </motion.div>
    );
};

ProfilePage.displayName = 'ProfilePage'; 

export default ProfilePage;
