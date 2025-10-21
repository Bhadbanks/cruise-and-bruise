// src/pages/index.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFeather, FiSend, FiStar, FiClock } from 'react-icons/fi';
import { FaCrown, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../utils/AuthContext';
import { db } from '../utils/firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

// Dummy Post Component (Replace with your feature-complete Post component later)
const PostCard = ({ post }) => {
    const isVerified = post.isVerified || post.isAdmin;
    const isAdmin = post.isAdmin;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 border-b border-gc-border bg-gc-card hover:bg-gc-card/80 transition duration-300 cursor-pointer shadow-lg"
        >
            <div className="flex items-start space-x-3">
                <img 
                    src={post.userProfilePic || '/default-avatar.png'} 
                    alt={post.username} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-gc-primary"
                />
                <div className="flex-1">
                    <div className="flex items-center space-x-1">
                        <span className={`font-bold ${isAdmin ? 'text-gc-admin' : 'text-white'}`}>
                            {post.username}
                        </span>
                        {isAdmin && <FaCrown className="w-3 h-3 text-gc-admin" title="Admin" />}
                        {isVerified && !isAdmin && <FaCheckCircle className="w-3 h-3 text-gc-verified" title="Verified" />}
                        <span className="text-gray-500 text-xs">· {post.timeAgo || 'Just now'}</span>
                        {post.isAnnouncement && (
                            <FiStar className="w-4 h-4 text-gc-primary ml-auto" title="Announcement" />
                        )}
                    </div>
                    
                    <p className={`mt-1 text-gray-200 ${post.isAnnouncement ? 'font-semibold' : ''}`}>
                        {post.content}
                    </p>

                    {/* Engagement Bar (Dummy for now) */}
                    <div className="flex items-center justify-between text-gray-500 mt-3 text-sm">
                        <motion.button whileHover={{ scale: 1.1 }} className="flex items-center space-x-1 hover:text-red-500">
                            <span>❤️ 0</span>
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} className="flex items-center space-x-1 hover:text-gc-primary">
                            <span>💬 0</span>
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} className="flex items-center space-x-1 hover:text-green-500">
                            <span>🔁 0</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


// Main Feed Component
const HomePage = () => {
    const { userProfile, currentUser } = useAuth();
    const [postContent, setPostContent] = useState('');
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    // --- Real-Time Feed Listener ---
    useEffect(() => {
        if (!currentUser) return;

        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), limit(50));
        
        // Setup real-time listener
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timeAgo: 'Real-time' // Simplified time for MVP
            }));
            setPosts(fetchedPosts);
            setLoadingPosts(false);
        }, (error) => {
            console.error("Error fetching posts: ", error);
            toast.error("Failed to load feed.");
            setLoadingPosts(false);
        });

        // Cleanup the listener on unmount
        return () => unsubscribe();
    }, [currentUser]);

    // --- Post Creation Handler ---
    const handlePost = async (e) => {
        e.preventDefault();
        if (!postContent.trim() || !userProfile) {
            toast.error("Post content cannot be empty.");
            return;
        }

        try {
            await addDoc(collection(db, 'posts'), {
                uid: userProfile.uid,
                username: userProfile.username,
                userProfilePic: userProfile.profilePicUrl || '/default-avatar.png',
                content: postContent.trim(),
                timestamp: serverTimestamp(),
                likes: 0,
                comments: 0,
                shares: 0,
                isVerified: userProfile.isVerified || false,
                isAdmin: userProfile.isAdmin || false,
                isAnnouncement: false, // Only admin can set this via admin panel
            });
            
            setPostContent('');
            toast.success("Post sent! It's live in the Squad feed.");

        } catch (error) {
            console.error("Error adding document: ", error);
            toast.error("Failed to post. Try again.");
        }
    };

    return (
        <div className="w-full">
            {/* Post Creation Box */}
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-4 sticky top-16 lg:top-0 border-b border-gc-border bg-gc-vibe/95 backdrop-blur-sm z-30 shadow-2xl"
            >
                <h1 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                    <FiClock className='text-gc-secondary' /> <span>Squad Feed</span>
                </h1>
                <form onSubmit={handlePost} className="flex flex-col space-y-3">
                    <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder={`What's the vibe, @${userProfile?.username || 'member'}?`}
                        rows="3"
                        className="w-full p-3 bg-gc-vibe border border-gc-secondary/50 rounded-xl text-white placeholder-gray-500 focus:ring-1 focus:ring-gc-primary focus:border-gc-primary transition duration-200"
                        maxLength={280}
                    />
                    <div className="flex justify-end">
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={!postContent.trim()}
                            className="flex items-center space-x-2 px-6 py-2 bg-gc-primary text-white font-bold rounded-full disabled:bg-gray-700 disabled:cursor-not-allowed transition duration-300 shadow-gc-glow"
                        >
                            <FiFeather />
                            <span>Post</span>
                        </motion.button>
                    </div>
                </form>
            </motion.div>

            {/* Post Stream */}
            <div className="mt-2">
                {loadingPosts ? (
                    <p className="text-center text-gray-500 py-10">Loading the vibe...</p>
                ) : posts.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No posts yet. Be the first to start the vibe!</p>
                ) : (
                    posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))
                )}
            </div>
        </div>
    );
};

export default HomePage;
