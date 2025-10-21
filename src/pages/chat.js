// src/pages/chat.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiSearch } from 'react-icons/fi';
import { db } from '../utils/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { useAuth } from '../utils/AuthContext';
import ChatWindow from '../components/ChatWindow';
import GlobalLoading from '../components/GlobalLoading';
import toast from 'react-hot-toast';

const ChatHubPage = () => {
    const { userProfile } = useAuth();
    const [allMembers, setAllMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [targetUser, setTargetUser] = useState(null);

    // --- Fetch All Users (to start a chat) ---
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const q = query(collection(db, 'users'));
                const querySnapshot = await getDocs(q);
                
                const membersList = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    // Exclude the current user from the chat list
                    .filter(member => member.uid !== userProfile?.uid); 
                
                setAllMembers(membersList);
                setFilteredMembers(membersList);

            } catch (error) {
                console.error("Error fetching members for chat:", error);
                toast.error("Failed to load contacts.");
            }
            setLoading(false);
        };

        if (userProfile) {
            fetchMembers();
        } else {
            setLoading(false);
        }
    }, [userProfile]);
    
    // --- Search Filter ---
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredMembers(allMembers);
            return;
        }

        const lowerCaseSearch = searchTerm.toLowerCase();
        const results = allMembers.filter(member => 
            member.username?.toLowerCase().includes(lowerCaseSearch) ||
            member.email?.toLowerCase().includes(lowerCaseSearch)
        );
        setFilteredMembers(results);
    }, [searchTerm, allMembers]);

    const handleOpenChat = (user) => {
        setTargetUser(user);
    };

    const handleCloseChat = () => {
        setTargetUser(null);
    };

    if (loading) {
        return <GlobalLoading />;
    }

    return (
        <div className="w-full h-full min-h-[85vh]">
            <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-extrabold text-white mb-6 flex items-center space-x-3 border-b border-gc-border pb-3"
            >
                <FiMessageCircle className="text-gc-primary" />
                <span>Squad Chat Hub</span>
            </motion.h1>

            <div className="flex h-full min-h-[75vh] bg-gc-card rounded-xl shadow-2xl border border-gc-secondary/50">
                
                {/* Left Panel: Conversation List / User List */}
                <div className={`p-4 border-r border-gc-border ${targetUser ? 'hidden lg:block lg:w-1/3' : 'w-full'}`}>
                    <div className="relative mb-4">
                        <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Find a member to chat with..."
                            className="w-full pl-10 pr-4 py-2 bg-gc-vibe border border-gc-border rounded-full text-white placeholder-gray-500 focus:ring-1 focus:ring-gc-secondary transition"
                        />
                    </div>
                    
                    <div className="overflow-y-auto h-[60vh] space-y-2 custom-scrollbar">
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map(member => (
                                <motion.div
                                    key={member.uid}
                                    whileHover={{ backgroundColor: '#2b2233', x: 5 }}
                                    onClick={() => handleOpenChat(member)}
                                    className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition duration-200 
                                                ${targetUser?.uid === member.uid ? 'bg-gc-secondary/50' : 'hover:bg-gc-vibe'}`}
                                >
                                    <img 
                                        src={member.profilePicUrl || '/default-avatar.png'} 
                                        alt={member.username} 
                                        className="w-10 h-10 rounded-full object-cover border border-gc-primary"
                                    />
                                    <div className='truncate'>
                                        <p className="font-semibold text-white truncate">@{member.username}</p>
                                        <p className="text-xs text-gray-400 truncate">Tap to start a conversation...</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-10">No members match your search.</p>
                        )}
                    </div>
                </div>

                {/* Right Panel: Chat Window */}
                <div className={`p-0 ${targetUser ? 'w-full' : 'hidden lg:block lg:w-2/3'}`}>
                    {targetUser ? (
                        <ChatWindow 
                            targetUser={targetUser} 
                            onCloseChat={handleCloseChat} 
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full flex-col text-gray-500">
                            <FiMessageCircle className="w-16 h-16 mb-4 text-gc-secondary" />
                            <p className="text-lg">Select a user to start chatting!</p>
                            <p className="text-sm">Real-time vibes, just for you and the Squad.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatHubPage;
