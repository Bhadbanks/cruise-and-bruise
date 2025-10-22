// src/components/FeedPreview.js
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import PostCard from './PostCard';
import { FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const FeedPreview = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), limit(3));
                const snapshot = await getDocs(q);
                
                const fetchedPosts = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPosts(fetchedPosts);
            } catch (error) {
                console.error("Error fetching feed preview: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block w-full lg:w-[400px] bg-gc-card rounded-xl shadow-2xl border border-gc-border overflow-hidden"
        >
            <div className="p-4 border-b border-gc-border bg-gc-secondary/20">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                    <FiClock className='text-gc-primary' /> <span>Live Squad Vibe Preview</span>
                </h2>
                <p className='text-sm text-gray-400'>What you're missing out on...</p>
            </div>

            <div className="space-y-0">
                {loading ? (
                    <p className="text-center text-gray-500 py-10">Fetching the latest vibe...</p>
                ) : posts.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">Feed is empty. Register to start posting!</p>
                ) : (
                    posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default FeedPreview;
