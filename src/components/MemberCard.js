// src/components/MemberCard.js
import Link from 'next/link';
import { FiMapPin, FiPhone, FiHeart, FiUserCheck } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MemberCard = ({ user }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 p-5 rounded-xl shadow-xl border border-gray-700 hover:bg-gray-700/50 transition duration-300"
        >
            <div className="flex items-start space-x-4">
                <img 
                    src={user.profilePicUrl || '/default-avatar.png'} 
                    alt={user.username} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-gc-primary/50" 
                />
                <div className="flex-1">
                    <Link href={`/profile/${user.username}`} legacyBehavior>
                        <a className="text-xl font-bold text-white hover:text-gc-primary transition duration-200 flex items-center">
                            @{user.username}
                            {user.isVerified && <FiUserCheck className="w-4 h-4 ml-2 text-green-400" title="Verified Member" />}
                            {user.isAdmin && <FaCrown className="w-4 h-4 ml-2 text-yellow-400" title="Admin" />}
                        </a>
                    </Link>
                    <p className="text-gray-400 text-sm italic mt-1">{user.bio || 'No bio yet.'}</p>
                </div>
            </div>

            <div className="mt-4 border-t border-gray-700 pt-4 space-y-2">
                <div className="flex items-center space-x-4 text-sm text-gray-300">
                    <div className="flex items-center space-x-1">
                        <FiMapPin className="w-4 h-4 text-gc-secondary" />
                        <span>{user.location || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <FiHeart className="w-4 h-4 text-red-400" />
                        <span>{user.relationshipStatus || 'Undisclosed'}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-300">
                    <FiPhone className="w-4 h-4 text-green-500" />
                    <span>WhatsApp: {user.whatsappNumber ? 'Available' : 'Private'}</span>
                </div>
            </div>

            <Link href={`/profile/${user.username}`} legacyBehavior>
                <motion.a 
                    whileHover={{ scale: 1.03 }}
                    className="mt-4 block text-center py-2 bg-gc-primary/20 text-gc-primary rounded-lg font-semibold hover:bg-gc-primary/40 transition duration-200"
                >
                    View Full Profile
                </motion.a>
            </Link>
        </motion.div>
    );
};

export default MemberCard;
