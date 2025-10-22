// src/components/CreatePost.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFeather, FiSend, FiImage, FiPlus } from 'react-icons/fi';
import { useAuth } from '../utils/AuthContext';
import { db } from '../utils/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const CreatePost = () => {
    const { userProfile, currentUser, isAdmin } = useAuth();
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    
    // NOTE: Image upload logic would be added here (requires Firebase Storage)

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser || !userProfile || isPosting) {
            toast.error("Log in and complete your profile to post.");
            return;
        }
        if (newPostContent.trim() === '') return;

        setIsPosting(true);

        try {
            await addDoc(collection(db, 'posts'), {
                uid: userProfile.uid,
                username: userProfile.username,
                userProfilePic: userProfile.profilePicUrl || '/default-avatar.png',
                content: newPostContent.trim(),
                timestamp: serverTimestamp(),
                likes: 0,
                comments: 0,
                shares: 0,
                isVerified: userProfile.isVerified || isAdmin,
                isAdmin: isAdmin,
                isAnnouncement: false,
                // postImageUrl: null, // For future image upload
            });

            setNewPostContent('');
            toast.success("Vibe successfully posted!");
        } catch (error) {
            console.error("Error submitting post:", error);
            toast.error("Failed to post. Try again.");
        } finally {
            setIsPosting(false);
        }
    };

    if (!currentUser || !userProfile) {
        return (
            <div className="p-4 bg-gc-card/50 rounded-xl text-center text-gray-400 border-2 border-gc-primary/30">
                <p>🚀 **Log in** to share your vibe with the Squad!</p>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 bg-gc-card shadow-2xl border-b border-gc-primary/50"
        >
            <h2 className="text-xl font-bold text-white mb-3 flex items-center space-x-2">
                <FiFeather className="text-gc-secondary" /> <span>Start a Vibe</span>
            </h2>
            <form onSubmit={handlePostSubmit} className="space-y-3">
                <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder={`What's the vibe, @${userProfile.username}?`}
                    rows="3"
                    className="w-full p-3 bg-gc-vibe border border-gc-border rounded-lg text-white placeholder-gray-500 focus:ring-1 focus:ring-gc-secondary transition"
                    maxLength={280}
                />
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <motion.button 
                            type="button" 
                            whileHover={{ scale: 1.1 }} 
                            className="text-gc-secondary hover:text-gc-primary transition"
                            title="Add Photo/Video (Premium)"
                        >
                            <FiImage className="w-5 h-5" />
                        </motion.button>
                        {/* More options here */}
                    </div>
                    <div className='flex items-center space-x-3'>
                        <span className="text-sm text-gray-500">{280 - newPostContent.length} characters left</span>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={newPostContent.trim() === '' || isPosting}
                            className="flex items-center space-x-2 px-6 py-2 bg-gc-primary text-white font-bold rounded-full disabled:opacity-50 transition duration-300 shadow-gc-glow-primary"
                        >
                            {isPosting ? 'Posting...' : <><FiSend /> <span>Post Vibe</span></>}
                        </motion.button>
                    </div>
                </div>
            </form>
        </motion.div>
    );
};

export default CreatePost;
