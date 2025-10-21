import { useState } from 'react';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../utils/AuthContext';
import toast from 'react-hot-toast';
import { FiSend, FiFeather } from 'react-icons/fi';
import { motion } from 'framer-motion';

const CreatePost = () => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const { userProfile } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postContent = content.trim();

        if (!userProfile || !postContent) {
            toast.error("Post content is empty or user profile is missing.");
            return;
        }

        setLoading(true);

        try {
            // 1. Add Post to the 'posts' collection
            await addDoc(collection(db, 'posts'), {
                authorUid: userProfile.uid,
                authorUsername: userProfile.username,
                authorAvatar: userProfile.profilePicUrl,
                content: postContent,
                timestamp: serverTimestamp(),
                type: 'user', // Default type for user posts
                likes: [], // Array of UIDs who liked the post
                commentCount: 0,
                isVerified: userProfile.isVerified || false, // Inherit verified status
            });

            setContent('');
            toast.success("Post published successfully!");

        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Failed to publish post.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700"
        >
            <h2 className="text-xl font-bold mb-4 flex items-center text-gc-primary">
                <FiFeather className="mr-2" /> What's on your mind?
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    placeholder={`Hey @${userProfile?.username || 'user'}, share your thoughts with the Squad!`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="4"
                    className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400 text-white focus:ring-2 focus:ring-gc-primary focus:outline-none transition duration-300"
                    required
                ></textarea>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || !content.trim()}
                    className="flex items-center space-x-2 px-6 py-2 bg-gc-primary text-white rounded-full font-bold hover:bg-pink-700 transition duration-200 disabled:opacity-50 shadow-md"
                >
                    <FiSend />
                    <span>{loading ? 'Posting...' : 'Post'}</span>
                </motion.button>
            </form>
        </motion.div>
    );
};

export default CreatePost;
