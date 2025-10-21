// src/components/UserCard.js
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCrown, FaCheckCircle, FaMapMarkerAlt, FaHeart, FaWhatsapp } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';

const UserCard = ({ user, showAdminActions, onToggleVerified }) => {
    const isVerified = user.isVerified;
    const isAdmin = user.isAdmin;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-gc-card rounded-xl shadow-xl border border-gc-border hover:border-gc-secondary transition duration-300"
        >
            <Link href={`/profile/${user.username}`} legacyBehavior>
                <a className="block">
                    <div className="flex items-center space-x-4">
                        <img 
                            src={user.profilePicUrl || '/default-avatar.png'} 
                            alt={user.username} 
                            className="w-14 h-14 rounded-full object-cover border-2 border-gc-primary flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1">
                                <span className="text-lg font-bold truncate text-white">@{user.username}</span>
                                {isAdmin && <FaCrown className="w-4 h-4 text-gc-admin" title="Admin" />}
                                {isVerified && !isAdmin && <FaCheckCircle className="w-4 h-4 text-gc-verified" title="Verified" />}
                            </div>
                            <p className="text-gray-400 text-sm truncate">{user.bio || 'New member, still setting up the vibe.'}</p>
                        </div>
                    </div>
                </a>
            </Link>

            <div className="mt-4 border-t border-gc-border pt-4 space-y-2 text-sm text-gray-300">
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {user.location && (
                        <span className="flex items-center space-x-1">
                            <FaMapMarkerAlt className="text-gc-secondary" />
                            <span>{user.location}</span>
                        </span>
                    )}
                    {user.relationshipStatus && (
                        <span className="flex items-center space-x-1">
                            <FaHeart className="text-gc-primary" />
                            <span>{user.relationshipStatus}</span>
                        </span>
                    )}
                </div>
                {user.whatsappNumber && (
                    <motion.a
                        href={`https://wa.me/${user.whatsappNumber.replace(/[^0-9+]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center space-x-1 text-green-400 hover:text-green-500 transition"
                    >
                        <FaWhatsapp className="text-green-500" />
                        <span>WhatsApp Me</span>
                    </motion.a>
                )}
            </div>

            {/* Admin Actions */}
            {showAdminActions && !isAdmin && (
                <div className="mt-4 pt-4 border-t border-gc-border">
                    <motion.button
                        onClick={() => onToggleVerified(user.uid, !isVerified)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-2 text-white font-semibold rounded-lg transition duration-300 flex items-center justify-center space-x-2 ${
                            isVerified ? 'bg-red-600 hover:bg-red-700' : 'bg-gc-verified hover:bg-gc-verified/80'
                        }`}
                    >
                        {isVerified ? (
                            <>
                                <FiUser /> <span>Remove Verified Badge</span>
                            </>
                        ) : (
                            <>
                                <FaCheckCircle /> <span>Grant Verified Badge</span>
                            </>
                        )}
                    </motion.button>
                </div>
            )}
        </motion.div>
    );
};

export default UserCard;
