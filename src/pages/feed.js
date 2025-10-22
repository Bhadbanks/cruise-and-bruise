// src/pages/feed.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFeatherAlt } from 'react-icons/fa';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../utils/AuthContext';
import PostCard from '../components/PostCard'; 
import CreatePost from '../components/CreatePost'; 
import toast from 'react-hot-toast';

const FeedPage = () => {
    const { currentUser, loading, userProfile } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    // --- Real-Time Feed Listener ---
    useEffect(() => {
        // Query for posts (Announcements will be mixed in since they are posts)
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
            toast.error("Failed to load feed.");
            setLoadingPosts(false);
        });

        return () => unsubscribe(); // Cleanup listener
    }, []);

    if (loadingPosts) return null; // Let AppShell handle the GlobalLoading initially

    return (
        <div className="w-full">
            {/* Header for Center Column (Sticky Top Bar, Twitter/X Style) */}
            <div className="sticky top-0 bg-gc-vibe/90 backdrop-blur-md border-b border-gc-border p-4 z-10">
                <h1 className="text-xl font-extrabold text-white">Home</h1>
            </div>

            {/* Post Creation Area (Top of Feed) */}
            <CreatePost />

            {/* Feed List (Divider for X/Twitter Look) */}
            <div className="divide-y divide-gc-border">
                {posts.length > 0 ? (
                    posts.map(post => (
                        // PostCard handles the look, animations, and icons (including Admin Crown)
                        <PostCard key={post.id} post={post} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-20">
                        No posts yet. Be the first to start the vibe!
                    </p>
                )}
            </div>
            
            {/* Mobile Footer/Post Button (Hidden on desktop) */}
            <motion.div 
                 className="fixed bottom-4 right-4 lg:hidden"
                 whileHover={{ scale: 1.1 }}
            >
                <button
                    className="p-4 bg-gc-primary text-white rounded-full shadow-gc-glow"
                    onClick={() => {/* Open Post Modal Logic */}}
                >
                    <FaFeatherAlt className="w-6 h-6" />
                </button>
            </motion.div>
        </div>
    );
};

// Component name/display name for _app.js minimal layout check
FeedPage.displayName = 'FeedPage'; 

export default FeedPage;
