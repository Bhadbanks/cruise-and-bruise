import Link from 'next/link';
import { FaCrown, FaMapPin, FaHeart, FaWhatsapp } from 'react-icons/fa';
import { FiUserPlus, FiUserCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../utils/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../utils/firebase';
import toast from 'react-hot-toast';

const UserCard = ({ user, showFullDetails = false, variant = 'card' }) => {
    const { currentUser, userProfile } = useAuth();
    const isCurrentUser = currentUser?.uid === user.uid;

    // Check if the current user is following this user
    const isFollowing = userProfile?.following?.includes(user.uid);
    
    // Firestore reference for the current user's profile
    const currentUserRef = userProfile ? doc(db, 'users', currentUser.uid) : null;
    // Firestore reference for the user being viewed
    const userRef = doc(db, 'users', user.uid);

    const handleFollowToggle = async () => {
        if (!currentUser) {
            toast.error("Please log in to follow users.");
            return;
        }
        if (isCurrentUser) return;

        try {
            if (isFollowing) {
                // Unfollow logic: remove UID from current user's 'following' and target user's 'followers'
                await updateDoc(currentUserRef, { following: arrayRemove(user.uid) });
                await updateDoc(userRef, { followers: arrayRemove(currentUser.uid) });
                toast.success(`Unfollowed @${user.username}`);
            } else {
                // Follow logic: add UID to current user's 'following' and target user's 'followers'
                await updateDoc(currentUserRef, { following: arrayUnion(user.uid) });
                await updateDoc(userRef, { followers: arrayUnion(currentUser.uid) });
                toast.success(`Following @${user.username}!`);
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
            toast.error("Failed to update follow status.");
        }
    };

    const FollowButton = () => {
        if (!currentUser || isCurrentUser) return null;

        return (
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFollowToggle}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition duration-200 shadow-md ${
                    isFollowing 
                        ? 'bg-transparent text-gc-primary border border-gc-primary hover:bg-gc-primary/10' 
                        : 'bg-gc-primary text-white hover:bg-pink-700'
                }`}
            >
                {isFollowing ? <FiUserCheck /> : <FiUserPlus />}
                <span>{isFollowing ? 'Following' : 'Follow'}</span>
            </motion.button>
        );
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.3 }}
            className={`bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 ${variant === 'profile' ? 'w-full' : 'w-full'}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                    <img 
                        src={user.profilePicUrl || '/default-avatar.png'} 
                        alt={user.username} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-gc-primary/50" 
                    />
                    <div>
                        <Link href={`/profile/${user.username}`} legacyBehavior>
                            <a className="text-xl font-bold flex items-center hover:text-gc-primary transition duration-200">
                                {user.username}
                                {user.isVerified && <FaCrown className="w-4 h-4 ml-2 text-yellow-400" title="Verified" />}
                            </a>
                        </Link>
                        <p className="text-sm text-gray-400 mt-1">{user.bio || 'No bio set.'}</p>
                    </div>
                </div>
                <FollowButton />
            </div>

            {/* Additional Details (only shown on the members page or profile cards) */}
            {showFullDetails && (
                <div className="pt-4 border-t border-gray-700 mt-4 space-y-2">
                    <div className="flex space-x-4 text-sm text-gray-400">
                        <span className="flex items-center space-x-1"><FaMapPin className="text-pink-400" /> <span>{user.location || 'Unknown'}</span></span>
                        <span className="flex items-center space-x-1"><FaHeart className="text-purple-400" /> <span>{user.relationshipStatus || 'Not specified'}</span></span>
                        <span>{user.age ? `${user.age} years old` : 'Age N/A'}</span>
                    </div>
                    {user.whatsappNumber && (
                        <a 
                            href={`https://wa.me/${user.whatsappNumber.replace(/[^0-9+]/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-green-500 hover:text-green-400 transition duration-200 text-sm font-medium"
                        >
                            <FaWhatsapp />
                            <span>WhatsApp Contact</span>
                        </a>
                    )}
                </div>
            )}

            {/* Followers/Following Counts */}
            <div className="flex space-x-4 mt-4 text-sm">
                <p className="text-gray-300 font-semibold">{user.followers?.length || 0} <span className="text-gray-400 font-normal">Followers</span></p>
                <p className="text-gray-300 font-semibold">{user.following?.length || 0} <span className="text-gray-400 font-normal">Following</span></p>
            </div>
        </motion.div>
    );
};

export default UserCard;
