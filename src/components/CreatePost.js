// src/components/CreatePost.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFeatherAlt } from 'react-icons/fa';
import { useAuth } from '../utils/AuthContext';
import { db } from '../utils/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const MAX_CHARS = 280;

const CreatePost = () => {
    const { userProfile, currentUser } = useAuth();
    const [content, setContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    if (!currentUser || !userProfile) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (content.trim() === '' || content.length > MAX_CHARS) return;

        setIsPosting(true);
        
        try {
            await addDoc(collection(db, 'posts'), {
                uid: currentUser.uid,
                username: userProfile.username,
                userProfilePic: userProfile.profilePicUrl || '/default-avatar.png',
                content: content.trim(),
                timestamp: serverTimestamp(),
                likes: 0,
                comments: 0,
                shares: 0,
                isVerified: userProfile.isVerified || false,
                isAdmin: userProfile.isAdmin || false,
            });

            setContent('');
            toast.success("Vibe shared successfully!");
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Failed to share vibe. Try again.");
        } finally {
            setIsPosting(false);
        }
    };

    const charCount = content.length;
    const charColor = charCount > MAX_CHARS ? 'text-red-500' : 'text-gray-500';

    return (
        <div className="p-4 border-b border-gc-border">
            <div className="flex space-x-4">
                <img 
                    src={userProfile.profilePicUrl || '/default-avatar.png'} 
                    alt={userProfile.username} 
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                
                <form onSubmit={handleSubmit} className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`What's the vibe, @${userProfile.username}?`}
                        rows="3"
                        className="w-full p-2 bg-gc-vibe text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gc-primary border-none resize-none"
                    />
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gc-border">
                        <span className={`text-sm ${charColor}`}>{charCount} / {MAX_CHARS}</span>
                        
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isPosting || content.trim().length === 0 || charCount > MAX_CHARS}
                            className="flex items-center space-x-2 px-5 py-2 bg-gc-primary text-white font-bold rounded-full disabled:opacity-50 transition duration-300 shadow-gc-glow"
                        >
                            <FaFeatherAlt />
                            <span>Post</span>
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
