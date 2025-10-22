// src/components/UserCard.js
import React from 'react';
import Link from 'next/link';
import { FaCrown, FaCheckCircle, FaBan } from 'react-icons/fa';
import { FiCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const UserCard = ({ user, showAdminActions = false, onToggleVerified = () => {} }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.01, backgroundColor: '#15151F' }}
            className="bg-gc-card p-4 rounded-xl border border-gc-border flex flex-col justify-between"
        >
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <img src={user.profilePicUrl || '/default-avatar.png'} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                    {/* Online Status */}
                    <FiCircle className={`absolute bottom-0 right-0 w-3 h-3 ${user.isOnline ? 'text-green-500' : 'text-gray-500'} bg-gc-vibe rounded-full border border-gc-vibe`} />
                </div>
                <div>
                    <Link href={`/profile/${user.username}`} legacyBehavior>
                         <p className="font-semibold text-white hover:underline flex items-center space-x-1">
                            <span>@{user.username}</span>
                            {user.isAdmin && <FaCrown className="w-3 h-3 text-gc-admin" title="Admin" />}
                            {user.isVerified && !user.isAdmin && <FaCheckCircle className="w-3 h-3 text-gc-verified" title="Verified" />}
                        </p>
                    </Link>
                    <p className="text-gray-400 text-sm truncate">{user.location || 'Unknown location'}</p>
                </div>
            </div>

            {showAdminActions && (
                <div className="mt-3 border-t border-gc-border pt-3 flex justify-end">
                    {user.isVerified ? (
                        <motion.button
                            onClick={() => onToggleVerified(user.uid, false)}
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center space-x-1 px-3 py-1 text-red-400 border border-red-400 rounded-full text-xs transition"
                        >
                            <FaBan className="w-3 h-3" /> <span>Unverify</span>
                        </motion.button>
                    ) : (
                        <motion.button
                            onClick={() => onToggleVerified(user.uid, true)}
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center space-x-1 px-3 py-1 text-green-400 border border-green-400 rounded-full text-xs transition"
                        >
                            <FaCheckCircle className="w-3 h-3" /> <span>Verify User</span>
                        </motion.button>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default UserCard;
