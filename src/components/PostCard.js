import Link from 'next/link';
import { FiHeart, FiMessageSquare, FiSend, FiUser, FiGlobe, FiShare } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';
import { useAuth } from '../utils/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../utils/firebase';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const PostCard = ({ post }) => {
    const { currentUser } = useAuth();
    const isLiked = currentUser && post.likes?.includes(currentUser.uid);
    const postRef = doc(db, 'posts', post.id);

    const handleLikeToggle = async () => {
        if (!currentUser) {
            toast.error("Please log in to like posts.");
            return;
        }

        try {
            await updateDoc(postRef, {
                likes: isLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
            });
        } catch (error) {
            console.error("Error toggling like:", error);
            toast.error("Failed to update like status.");
        }
    };

    const isAnnouncement = post.type === 'admin_announcement';
    const isExternalNews = post.type === 'external_news';

    // Format timestamp
    const timeAgo = (timestamp) => {
        if (!timestamp) return 'Just now';
        const seconds = Math.floor((new Date().getTime() / 1000) - timestamp);
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return new Date(timestamp * 1000).toLocaleDateString();
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-xl shadow-xl transition duration-300 relative ${
                isAnnouncement ? 'bg-purple-900/40 border border-purple-500 animate-border-pulse' : 
                isExternalNews ? 'bg-blue-900/40 border border-blue-500' : 
                'bg-gray-800 border border-gray-700 hover:bg-gray-700/50'
            }`}
        >
            {/* Header / Author Info */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <img 
                        src={post.authorAvatar || '/default-avatar.png'} 
                        alt={post.authorUsername} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-gc-primary/50" 
                    />
                    <div>
                        <Link href={`/profile/${post.authorUsername}`} legacyBehavior>
                            <a className={`font-bold hover:text-gc-primary transition duration-200 flex items-center ${isAnnouncement ? 'text-yellow-300' : 'text-white'}`}>
                                @{post.authorUsername}
                                {(post.isVerified || isAnnouncement) && <FaCrown className="w-3 h-3 ml-2 text-yellow-400" title="Verified" />}
                                {isExternalNews && <FiGlobe className="w-3 h-3 ml-2 text-blue-400" title="External News" />}
                            </a>
                        </Link>
                        <p className="text-sm text-gray-400">{timeAgo(post.timestamp)}</p>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            {isAnnouncement && <h3 className="text-xl font-extrabold mb-2 text-yellow-300">{post.title}</h3>}
            {isExternalNews && <h3 className="text-lg font-bold mb-2 text-blue-300">{post.title}</h3>}
            <p className={`text-gray-300 whitespace-pre-wrap ${isAnnouncement ? 'text-lg' : 'text-base'}`}>{post.content}</p>

            {/* Engagement Bar */}
            <div className="flex items-center space-x-6 mt-4 pt-3 border-t border-gray-700/50">
                {/* Like Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLikeToggle}
                    className={`flex items-center space-x-1 text-sm transition duration-200 ${
                        isLiked ? 'text-gc-primary' : 'text-gray-400 hover:text-gc-primary/80'
                    }`}
                >
                    <FiHeart className="w-4 h-4 fill-current" />
                    <span>{post.likes?.length || 0}</span>
                </motion.button>
                
                {/* Comment Button (Placeholder) */}
                <button className="flex items-center space-x-1 text-gray-400 hover:text-gc-primary transition duration-200 text-sm">
                    <FiMessageSquare className="w-4 h-4" />
                    <span>{post.commentCount || 0}</span>
                </button>
                
                {/* External Link/Share Button */}
                {isExternalNews && (
                    <a 
                        href={post.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition duration-200 text-sm font-semibold"
                    >
                        <FiShare className="w-4 h-4" />
                        <span>Read Source</span>
                    </a>
                )}
            </div>
        </motion.div>
    );
};

export default PostCard;
