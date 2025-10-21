import Link from 'next/link';
import { FiHeart, FiMessageCircle, FiShare, FiChevronUp, FiChevronDown, FiStar } from 'react-icons/fi';
import { FaCrown, FaBullhorn } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../utils/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { db } from '../utils/firebase';

const PostCard = ({ post, userProfile }) => {
    const { currentUser } = useAuth();
    const postRef = doc(db, 'posts', post.id);

    // Determine if the current user has liked the post
    const isLiked = post.likes?.includes(currentUser?.uid);

    // Function to handle liking/unliking
    const handleLike = async () => {
        if (!currentUser) {
            toast.error("Please login to like posts.");
            return;
        }

        try {
            await updateDoc(postRef, {
                // If liked, remove the UID; otherwise, add it.
                likes: isLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
            });
        } catch (error) {
            console.error("Error updating like status:", error);
        }
    };

    // Styling based on post type
    let cardClasses = "bg-gray-800 p-4 rounded-xl shadow-lg border-2 border-transparent transition duration-300 hover:shadow-xl";
    let icon = <FiStar className="w-5 h-5 text-gc-primary mr-2" />;

    if (post.type === 'admin_announcement') {
        // Highlighted admin post styling
        cardClasses = "bg-gray-900 p-6 rounded-xl shadow-2xl border-2 animate-border-pulse border-gc-primary/70";
        icon = <FaBullhorn className="w-6 h-6 text-yellow-400 mr-2" />;
    } else if (post.type === 'external_news') {
        cardClasses = "bg-gray-700 p-4 rounded-xl shadow-lg border-2 border-gray-600";
        icon = <FiStar className="w-5 h-5 text-teal-400 mr-2" />;
    }

    const getFormattedTime = (timestamp) => {
        if (!timestamp) return 'Just now';
        return new Date(timestamp.seconds * 1000).toLocaleString();
    };


    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={cardClasses}>
            <div className="flex items-start space-x-3 mb-3">
                <img 
                    src={post.authorAvatar || '/default-avatar.png'} 
                    alt={post.authorUsername} 
                    className="w-10 h-10 rounded-full object-cover" 
                />
                <div className="flex-1">
                    <Link href={`/profile/${post.authorUsername}`} legacyBehavior>
                        <a className="font-bold flex items-center hover:text-gc-primary transition duration-200">
                            {post.authorUsername}
                            {post.isVerified && <FaCrown className="w-3 h-3 ml-1 text-yellow-400" title="Verified" />}
                        </a>
                    </Link>
                    <p className="text-xs text-gray-400">{getFormattedTime(post.timestamp)}</p>
                </div>
                {icon}
            </div>

            {/* Post Content */}
            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-300 mb-4 whitespace-pre-wrap">{post.content}</p>

            {/* Engagement Bar (Real-Time) */}
            <div className="flex justify-between items-center border-t border-gray-700 pt-3">
                <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLike}
                    className={`flex items-center space-x-1 transition duration-200 ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                >
                    <FiHeart className="w-5 h-5" />
                    <span className="font-medium text-sm">{post.likes?.length || 0}</span>
                </motion.button>
                
                <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition duration-200">
                    <FiMessageCircle className="w-5 h-5" />
                    <span className="font-medium text-sm">{post.commentCount || 0}</span>
                </button>
                
                <button className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition duration-200">
                    <FiShare className="w-5 h-5" />
                    <span className="font-medium text-sm">Share</span>
                </button>
            </div>
        </motion.div>
    );
};

export default PostCard;
