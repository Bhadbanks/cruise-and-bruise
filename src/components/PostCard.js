// src/components/PostCard.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRegComment, FaHeart, FaShare, FaCrown, FaCheckCircle, FaTrash } from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';
import { useAuth } from '../utils/AuthContext';
import { db } from '../utils/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { timeAgo } from '../utils/helpers'; // Helper for time formatting
import toast from 'react-hot-toast';
import Link from 'next/link';

const PostCard = ({ post }) => {
    const { userProfile, isAdmin } = useAuth();
    const [isLiking, setIsLiking] = useState(false);
    
    // Check if the current user is the author
    const isAuthor = userProfile && userProfile.uid === post.uid;

    const handleDelete = async () => {
        if (!isAdmin && !isAuthor) {
            toast.error("You don't have permission to delete this post.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, 'posts', post.id));
            toast.success("Post deleted.");
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post.");
        }
    };
    
    // Liking/Interaction logic would be more complex (using transactions) but is skipped for brevity.

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-gc-vibe hover:bg-gc-card/50 transition duration-300 cursor-pointer"
        >
            <div className="flex space-x-3">
                {/* Profile Pic */}
                <Link href={`/profile/${post.username}`} legacyBehavior>
                    <img 
                        src={post.userProfilePic || '/default-avatar.png'} 
                        alt={post.username} 
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-gc-primary/50"
                    />
                </Link>

                <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center space-x-1 mb-1">
                        <Link href={`/profile/${post.username}`} legacyBehavior>
                             <span className="font-bold text-white hover:underline cursor-pointer">{post.username}</span>
                        </Link>
                        {post.isAdmin && <FaCrown className="w-3 h-3 text-gc-admin" title="Admin" />}
                        {post.isVerified && !post.isAdmin && <FaCheckCircle className="w-3 h-3 text-gc-verified" title="Verified" />}
                        <span className="text-gray-500 text-sm">· {timeAgo(post.timestamp)}</span>
                    </div>

                    {/* Content */}
                    <p className="text-gc-text whitespace-pre-wrap mb-3">{post.content}</p>

                    {/* Action Bar (Simplified Twitter/X style) */}
                    <div className="flex justify-between text-gray-500 mt-2">
                        
                        <motion.button whileHover={{ scale: 1.1 }} className="flex items-center space-x-2 hover:text-gc-primary">
                            <FaRegComment className="w-4 h-4" />
                            <span className="text-xs">{post.comments || 0}</span>
                        </motion.button>

                        <motion.button 
                            whileHover={{ scale: 1.1 }} 
                            className={`flex items-center space-x-2 transition ${isLiking ? 'text-gc-secondary' : 'hover:text-gc-secondary'}`}
                            onClick={() => setIsLiking(!isLiking)} // Placeholder action
                        >
                            <FaHeart className="w-4 h-4" />
                            <span className="text-xs">{post.likes || 0}</span>
                        </motion.button>

                        <motion.button whileHover={{ scale: 1.1 }} className="flex items-center space-x-2 hover:text-green-500">
                            <FaShare className="w-4 h-4" />
                            <span className="text-xs">{post.shares || 0}</span>
                        </motion.button>
                        
                        {(isAdmin || isAuthor) && (
                            <motion.button 
                                whileHover={{ scale: 1.1 }} 
                                className="flex items-center space-x-2 text-red-400 hover:text-red-500"
                                onClick={handleDelete}
                            >
                                <FaTrash className="w-4 h-4" />
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PostCard;
