import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import PostCard from './PostCard';
import { useAuth } from '../utils/AuthContext';
import { FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';

const UnifiedFeed = () => {
    const { userProfile } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'user', 'admin', 'news'

    useEffect(() => {
        // 1. Setup Firestore Listener for User/Admin Posts
        // Query for user and admin posts, ordered chronologically
        const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
            const firestorePosts = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data(),
                timestamp: doc.data().timestamp?.seconds || Date.now() / 1000 // Handle serverTimestamp not set yet
            }));
            
            // 2. Simulate Fetching External News (This should be done via /api/news for production)
            // For now, we manually create a dummy external news post for demonstration.
            const externalNews = [{
                id: 'news-1',
                type: 'external_news',
                title: 'AI breakthrough announced by Google',
                content: 'A major development in generative AI was just revealed, exciting the tech world. Read more on the source link...',
                authorUsername: 'News Bot',
                authorAvatar: '/bot-avatar.png',
                timestamp: Date.now() / 1000 - 3600, // 1 hour ago
                likes: [],
                commentCount: 0,
                isVerified: true
            }];

            const combinedFeed = [...firestorePosts, ...externalNews];
            
            // Sort combined feed chronologically (newest first)
            const sortedFeed = combinedFeed.sort((a, b) => b.timestamp - a.timestamp);

            // Apply filter
            let filteredFeed = sortedFeed;
            if (filter !== 'all') {
                filteredFeed = sortedFeed.filter(post => post.type === filter);
            }

            setPosts(filteredFeed);
            setLoading(false);
        }, (error) => {
            console.error("Error listening to posts:", error);
            toast.error("Failed to load real-time feed.");
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup listener on component unmount
    }, [filter]);


    return (
        <div className="space-y-6">
            <div className="flex justify-start space-x-4 p-4 bg-gray-800 rounded-xl shadow-lg">
                <FilterButton currentFilter={filter} setFilter={setFilter} type="all" label="Unified Feed" />
                <FilterButton currentFilter={filter} setFilter={setFilter} type="user" label="User Posts" />
                <FilterButton currentFilter={filter} setFilter={setFilter} type="admin_announcement" label="Announcements" />
                <FilterButton currentFilter={filter} setFilter={setFilter} type="external_news" label="News" />
            </div>

            {loading ? (
                <div className="text-center p-10 text-gray-400">
                    <FiRefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-gc-primary" />
                    <p>Loading the Special Squad feed...</p>
                </div>
            ) : posts.length === 0 ? (
                <p className="text-center text-gray-400 p-10">No posts found. Be the first to post!</p>
            ) : (
                posts.map(post => <PostCard key={post.id} post={post} userProfile={userProfile} />)
            )}
        </div>
    );
};

const FilterButton = ({ currentFilter, setFilter, type, label }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setFilter(type)}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition duration-200 
            ${currentFilter === type 
                ? 'bg-gc-primary text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`
        }
    >
        {label}
    </motion.button>
);

export default UnifiedFeed;
