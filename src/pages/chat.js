// src/pages/chat.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiSearch, FiArrowLeft } from 'react-icons/fi';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../utils/AuthContext';
import ChatWindow from '../components/ChatWindow'; // The missing component
import toast from 'react-hot-toast';

const ChatPage = () => {
    const { currentUser, loading } = useAuth();
    const [members, setMembers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingMembers, setLoadingMembers] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const fetchMembers = async () => {
            setLoadingMembers(true);
            try {
                const q = query(collection(db, 'users'));
                const snapshot = await getDocs(q);
                const fetchedMembers = snapshot.docs
                    .map(doc => doc.data())
                    .filter(user => user.uid !== currentUser.uid); // Exclude self
                setMembers(fetchedMembers);
            } catch (error) {
                console.error("Error fetching members:", error);
                toast.error("Failed to load members for chat.");
            } finally {
                setLoadingMembers(false);
            }
        };

        fetchMembers();
    }, [currentUser]);

    const filteredMembers = members.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return null; // Wait for AppShell loading

    if (!currentUser) {
        return <div className="p-8 text-center text-red-500">You must be logged in to access the chat hub.</div>;
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-[90vh] flex bg-gc-vibe"
        >
            {/* Left Column (Member List) */}
            <div className={`w-full lg:w-96 border-r border-gc-border p-4 transition-transform duration-300 ${selectedUser ? 'hidden lg:block' : 'block'}`}>
                <h1 className="text-3xl font-extrabold text-white mb-4 flex items-center space-x-2">
                    <FiMessageCircle className="text-gc-primary" /> <span>Squad Chat</span>
                </h1>

                {/* Search Bar */}
                <div className="relative mb-4">
                    <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search users to chat with" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gc-card border border-gc-border rounded-full text-white placeholder-gray-500 focus:ring-1 focus:ring-gc-primary transition"
                    />
                </div>

                {/* Member List */}
                <div className="space-y-2 overflow-y-auto custom-scrollbar h-[75vh]">
                    {loadingMembers ? (
                        <p className="text-gray-500 text-center py-10">Loading members...</p>
                    ) : filteredMembers.length === 0 ? (
                        <p className="text-gray-500 text-center py-10">No members found.</p>
                    ) : (
                        filteredMembers.map(user => (
                            <motion.div 
                                key={user.uid}
                                whileHover={{ backgroundColor: '#15151F', scale: 1.01 }}
                                onClick={() => setSelectedUser(user)}
                                className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition duration-200 ${selectedUser?.uid === user.uid ? 'bg-gc-primary/20 border border-gc-primary' : 'bg-gc-card hover:border-gc-secondary/50 border border-gc-card'}`}
                            >
                                <img src={user.profilePicUrl || '/default-avatar.png'} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <p className="font-semibold text-white">@{user.username}</p>
                                    <p className="text-gray-400 text-sm truncate">{user.bio || 'New member'}</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Column (Chat Window) */}
            <div className={`flex-1 transition-transform duration-300 ${selectedUser ? 'block' : 'hidden lg:block'} p-4`}>
                {selectedUser ? (
                    <div className='h-full'>
                        <button 
                            className='lg:hidden flex items-center text-gc-primary mb-3' 
                            onClick={() => setSelectedUser(null)}
                        >
                            <FiArrowLeft className='w-5 h-5 mr-1' /> Back to members
                        </button>
                        <ChatWindow 
                            targetUser={selectedUser} 
                            onCloseChat={() => setSelectedUser(null)}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Select a member from the list to start a private vibe.
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ChatPage;
