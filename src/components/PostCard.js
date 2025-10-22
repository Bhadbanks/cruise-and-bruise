// src/components/PostCard.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaRegComment, FaHeart, FaShare, FaCrown, FaCheckCircle, FaTrash } from 'react-icons/fa';
import { useAuth } from '../utils/AuthContext';
import { db } from '../utils/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { timeAgo } from '../utils/helpers';

const PostCard = ({ post }) => {
    const { userProfile, isAdmin } = useAuth();
    
    const isAuthor = userProfile && userProfile.uid === post.uid;
    const isAnnouncement = post.isAnnouncement;

    const handleDelete = async () => {
        if (!isAdmin && !isAuthor) {
            toast.error("Permission denied.");
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
    
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        hover: { backgroundColor: '#15151F', transition: { duration: 0.1 } } // gc-card
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className={`p-4 bg-gc-vibe transition duration-300 cursor-pointer ${isAnnouncement ? 'border-2 border-red-500/50 shadow-lg' : ''}`}
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
                        {isAnnouncement && <span className='text-red-500 font-bold text-xs mr-2 border border-red-500 px-1 rounded-sm'>ANNOUNCEMENT</span>}
                        <Link href={`/profile/${post.username}`} legacyBehavior>
                             <span className="font-bold text-white hover:underline cursor-pointer">{post.username}</span>
                        </Link>
                        {/* Admin Golden Verified Check */}
                        {post.isAdmin && <FaCrown className="w-4 h-4 text-gc-admin" title="Admin (Lowkey Is Him)" />}
                        {/* Standard Blue Verification Check */}
                        {post.isVerified && !post.isAdmin && <FaCheckCircle className="w-3 h-3 text-gc-verified" title="Verified" />}
                        <span className="text-gray-500 text-sm">· {timeAgo(post.timestamp)}</span>
                    </div>

                    {/* Content */}
                    <p className="text-gc-text whitespace-pre-wrap mb-3">{post.content}</p>

                    {/* Action Bar */}
                    <div className="flex justify-between text-gray-500 mt-2">
                        <motion.button whileHover={{ scale: 1.1 }} className="flex items-center space-x-2 hover:text-gc-primary">
                            <FaRegComment className="w-4 h-4" />
                            <span className="text-xs">{post.comments || 0}</span>
                        </motion.button>

                        <motion.button 
                            whileHover={{ scale: 1.1 }} 
                            className={`flex items-center space-x-2 transition hover:text-gc-secondary`}
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
