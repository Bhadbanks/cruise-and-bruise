// src/components/UserProfileCard.js
import { FiMapPin, FiHeart, FiPhone, FiCalendar, FiUserPlus, FiUserCheck, FiMessageCircle, FiGlobe } from 'react-icons/fi';
import { FaCrown, FaVenusMars } from 'react-icons/fa';
import { motion } from 'framer-motion';

const UserProfileCard = ({ profileData, isMyProfile, isFollowing, handleFollowToggle, handleDM, postsCount }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl overflow-hidden shadow-2xl bg-gray-800"
        >
            {/* Cover Image */}
            <div className="relative h-48 md:h-64 bg-gray-900">
                <img 
                    src={profileData.coverImgUrl || '/default-cover.jpg'} 
                    alt="Cover" 
                    className="w-full h-full object-cover" 
                />
                <div className="absolute -bottom-16 left-6">
                    <img 
                        src={profileData.profilePicUrl || '/default-avatar.png'} 
                        alt="Profile" 
                        className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-900"
                    />
                </div>
            </div>
            
            {/* Profile Info and Actions */}
            <div className="pt-16 md:pt-20 px-6 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center">
                            @{profileData.username}
                            {profileData.isVerified && <FiUserCheck className="w-5 h-5 md:w-6 md:h-6 ml-3 text-green-400" title="Verified Member" />}
                            {profileData.isAdmin && <FaCrown className="w-5 h-5 md:w-6 md:h-6 ml-3 text-yellow-400" title="Admin" />}
                        </h1>
                        <p className="text-gray-400 mt-1 italic">{profileData.bio || 'The mystery member of the Squad.'}</p>
                    </div>

                    {!isMyProfile && (
                        <div className="flex space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDM}
                                className="flex items-center space-x-2 px-4 py-2 bg-gc-secondary text-white rounded-full font-semibold hover:bg-purple-700 transition duration-200 text-sm"
                            >
                                <FiMessageCircle />
                                <span>DM</span>
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleFollowToggle}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition duration-200 text-sm ${
                                    isFollowing ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gc-primary text-white hover:bg-pink-700'
                                }`}
                            >
                                <FiUserPlus />
                                <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
                            </motion.button>
                        </div>
                    )}
                </div>
                
                {/* Metrics */}
                <div className="flex space-x-6 text-sm text-gray-400 mb-6 border-b pb-4 border-gray-700">
                    <span><strong className="text-white">{profileData.followers?.length || 0}</strong> Followers</span>
                    <span><strong className="text-white">{profileData.following?.length || 0}</strong> Following</span>
                    <span><strong className="text-white">{postsCount}</strong> Posts</span>
                </div>
                
                {/* Additional Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
                    <div className="flex items-center space-x-2"><FiMapPin className="text-gc-secondary" /><span>{profileData.location || 'N/A'}</span></div>
                    <div className="flex items-center space-x-2"><FiHeart className="text-red-400" /><span>{profileData.relationshipStatus || 'N/A'}</span></div>
                    <div className="flex items-center space-x-2"><FaVenusMars className="text-blue-400" /><span>{profileData.sex || 'N/A'}</span></div>
                    <div className="flex items-center space-x-2"><FiCalendar className="text-yellow-400" /><span>Age: {profileData.age || 'N/A'}</span></div>
                    <div className="flex items-center space-x-2 col-span-2"><FiPhone className="text-green-500" /><span>WhatsApp: {profileData.whatsappNumber || 'Private'}</span></div>
                    <div className="flex items-center space-x-2 col-span-2"><FiGlobe className="text-gc-primary" /><span>Social: <a href="#" className="hover:underline">Link</a></span></div>
                </div>
            </div>
        </motion.div>
    );
};

export default UserProfileCard;
