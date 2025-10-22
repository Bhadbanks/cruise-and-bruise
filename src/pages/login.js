// src/pages/index.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFeather, FiSend, FiStar } from 'react-icons/fi';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../utils/AuthContext';
import PostCard from '../components/PostCard'; // Reusing the styled component
import toast from 'react-hot-toast';
import GlobalLoading from '../components/GlobalLoading';

const HomePage = () => {
    const { userProfile, currentUser, isAdmin } = useAuth();
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [loadingPosts, setLoadingPosts] = useState(true);

    // --- Real-Time Feed Listener ---
    useEffect(() => {
        const postsQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), limit(50));

        const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(fetchedPosts);
            setLoadingPosts(false);
        }, (error) => {
            console.error("Error fetching real-time feed:", error);
            toast.error("Failed to load feed. Check console.");
            setLoadingPosts(false);
        });

        return () => unsubscribe(); // Cleanup listener
    }, []);

    // --- Post Submission Handler ---
    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser || !userProfile) {
            toast.error("You must be logged in to post.");
            return;
        }
        if (newPostContent.trim() === '') return;

        try {
            await addDoc(collection(db, 'posts'), {
                uid: userProfile.uid,
                username: userProfile.username,
                userProfilePic: userProfile.profilePicUrl || '/default-avatar.png',
                content: newPostContent.trim(),
                timestamp: serverTimestamp(),
                likes: 0,
                comments: 0,
                shares: 0,
                isVerified: userProfile.isVerified || isAdmin,
                isAdmin: isAdmin,
                isAnnouncement: false, // Regular post
            });

            setNewPostContent('');
            toast.success("Vibe successfully posted!");
        } catch (error) {
            console.error("Error submitting post:", error);
            toast.error("Failed to post. Try again.");
        }
    };

    if (loadingPosts) {
        // Use GlobalLoading if it's the first load
        return <GlobalLoading />;
    }

    return (
        <div className="w-full">
            <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-extrabold text-white mb-6 flex items-center space-x-3 p-4 lg:p-0"
            >
                <FiStar className="text-gc-primary" />
                <span>The Squad Feed</span>
            </motion.h1>

            {/* Post Creator (Only visible when logged in) */}
            {currentUser && userProfile && (
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-gc-card shadow-2xl border-b border-gc-primary/50"
                >
                    <form onSubmit={handlePostSubmit} className="space-y-3">
                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="Share your vibe with the Squad..."
                            rows="3"
                            className="w-full p-3 bg-gc-vibe border border-gc-border rounded-lg text-white placeholder-gray-500 focus:ring-1 focus:ring-gc-secondary transition"
                            maxLength={280}
                        />
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{280 - newPostContent.length} characters left</span>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={newPostContent.trim() === ''}
                                className="flex items-center space-x-2 px-6 py-2 bg-gc-primary text-white font-bold rounded-full disabled:opacity-50 transition duration-300 shadow-gc-glow-primary"
                            >
                                <FiSend />
                                <span>Post Vibe</span>
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Feed List */}
            <div className="divide-y divide-gc-border">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-20">
                        {currentUser ? "No posts yet. Start the conversation!" : "Log in to see the full, real-time feed."}
                    </p>
                )}
            </div>
        </div>
    );
};

export default HomePage;
