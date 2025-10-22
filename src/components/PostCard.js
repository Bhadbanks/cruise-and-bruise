// src/components/PostCard.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaCheckCircle } from 'react-icons/fa';
import { FiStar } from 'react-icons/fi';
import { format } from 'timeago.js';

const PostCard = ({ post }) => {
    const isVerified = post.isVerified || post.isAdmin;
    const isAdmin = post.isAdmin;
    const timeAgo = post.timestamp?.toDate ? format(post.timestamp.toDate()) : 'Just now';

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
                        <span className="text-gray-500 text-xs">· {timeAgo}</span>
                        {post.isAnnouncement && (
                            <FiStar className="w-4 h-4 text-gc-primary ml-auto" title="Announcement" />
                        )}
                    </div>
                    
                    <p className={`mt-1 text-gray-200 ${post.isAnnouncement ? 'font-semibold' : ''}`}>
                        {post.content}
                    </p>

                    {/* Engagement Bar (Premium Look) */}
                    <div className="flex items-center justify-between text-gray-500 mt-3 text-sm">
                        <motion.button whileHover={{ scale: 1.1 }} className="flex items-center space-x-1 hover:text-gc-primary">
                            <span>❤️ {post.likes || 0}</span>
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} className="flex items-center space-x-1 hover:text-gc-secondary">
                            <span>💬 {post.comments || 0}</span>
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} className="flex items-center space-x-1 hover:text-green-500">
                            <span>🔁 {post.shares || 0}</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PostCard;
