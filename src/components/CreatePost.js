import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../utils/AuthContext';
import { FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CreatePost = () => {
    const { userProfile } = useAuth();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userProfile || content.trim() === '') {
            toast.error("Please log in and write some content!");
            return;
        }

        setLoading(true);

        try {
            await addDoc(collection(db, 'posts'), {
                authorUid: userProfile.uid,
                authorUsername: userProfile.username,
                authorAvatar: userProfile.profilePicUrl,
                title: title.trim(),
                content: content.trim(),
                timestamp: serverTimestamp(),
                type: 'user', // Explicitly marked as a user post
                likes: [],
                commentCount: 0,
                isVerified: userProfile.isVerified,
            });

            setContent('');
            setTitle('');
            toast.success("Post published successfully!");

        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Failed to publish post.");
        } finally {
            setLoading(false);
        }
    };

    if (!userProfile) return null; // Don't show if not logged in

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl mb-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gc-primary">Create New Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder={`What's your title, ${userProfile.username}?`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none transition duration-300"
                    required
                />
                <textarea
                    placeholder="Share your thoughts with the Squad..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="4"
                    className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none transition duration-300"
                    required
                ></textarea>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-2 bg-gc-primary text-white font-bold rounded-lg shadow-md hover:bg-pink-700 transition duration-300 disabled:opacity-50"
                >
                    <FiSend />
                    <span>{loading ? 'Publishing...' : 'Post Now'}</span>
                </motion.button>
            </form>
        </div>
    );
};

export default CreatePost;
