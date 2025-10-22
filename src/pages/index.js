// src/pages/index.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../utils/AuthContext';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost'; // NEW COMPONENT
import toast from 'react-hot-toast';
import GlobalLoading from '../components/GlobalLoading';

const HomePage = () => {
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
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
            console.error("Error fetching feed:", error);
            toast.error("Failed to load feed.");
            setLoadingPosts(false);
        });

        return () => unsubscribe(); // Cleanup listener
    }, []);

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
                <span>The Squad Vibe Feed</span>
            </motion.h1>

            {/* Post Creator (Now a dedicated component) */}
            <CreatePost />

            {/* Feed List */}
            <div className="divide-y divide-gc-border mt-4">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-20">
                        {currentUser ? "No posts yet. Be the first to start the vibe!" : "Log in to see the full, real-time feed."}
                    </p>
                )}
            </div>
        </div>
    );
};

export default HomePage;
