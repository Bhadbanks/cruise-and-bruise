// src/components/ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiX } from 'react-icons/fi';
import { useAuth } from '../utils/AuthContext';
import { db } from '../utils/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

// Helper to determine the conversation ID (ensures same ID regardless of sender/receiver order)
const getChatId = (uid1, uid2) => {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
};

const ChatBubble = ({ message, isSender, timestamp }) => {
    // Simple time formatting
    const time = timestamp?.toDate()?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) || 'Sending...';

    return (
        <motion.div
            initial={{ opacity: 0, x: isSender ? 20 : -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`flex w-full ${isSender ? 'justify-end' : 'justify-start'} mb-3`}
        >
            <div className={`max-w-[75%] p-3 rounded-2xl shadow-md ${
                isSender 
                    ? 'bg-gc-primary text-white rounded-br-none' 
                    : 'bg-gc-secondary/50 text-white rounded-tl-none'
            }`}>
                <p className="text-sm break-words">{message.content}</p>
                <span className={`block text-xs mt-1 ${isSender ? 'text-pink-200' : 'text-gray-300'} text-right`}>
                    {time}
                </span>
                {/* Optional Premium: Read receipt/Last seen goes here */}
            </div>
        </motion.div>
    );
};

const ChatWindow = ({ targetUser, onCloseChat }) => {
    const { currentUser, userProfile } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Get the unique chat ID for this conversation
    const chatId = getChatId(currentUser.uid, targetUser.uid);

    // --- Real-Time Message Listener ---
    useEffect(() => {
        if (!chatId) return;

        const q = query(
            collection(db, 'chats', chatId, 'messages'),
            orderBy('timestamp', 'asc')
        );

        setLoading(true);
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(fetchedMessages);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching messages:", error);
            toast.error("Failed to load chat messages.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [chatId]);

    // --- Auto-Scroll to Bottom ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // --- Send Message Handler ---
    const handleSend = async (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const messageToSend = input.trim();
        setInput('');

        try {
            await addDoc(collection(db, 'chats', chatId, 'messages'), {
                uid: currentUser.uid,
                content: messageToSend,
                timestamp: serverTimestamp(),
            });
            
            // Optional: Update conversation list meta data here (last message, time)
            
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message.");
        }
    };

    return (
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full bg-gc-vibe rounded-xl shadow-2xl border-2 border-gc-secondary"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gc-border bg-gc-card rounded-t-xl">
                <div className='flex items-center space-x-2'>
                    <img 
                        src={targetUser.profilePicUrl || '/default-avatar.png'} 
                        alt={targetUser.username} 
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <h2 className="text-lg font-bold text-white">
                        Chatting with @{targetUser.username}
                    </h2>
                </div>
                <motion.button 
                    onClick={onCloseChat} 
                    whileHover={{ scale: 1.1 }}
                    className="p-1 text-gray-400 hover:text-gc-primary transition"
                >
                    <FiX className="w-5 h-5" />
                </motion.button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {loading ? (
                    <p className="text-center text-gray-500 py-10">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">Start a new conversation!</p>
                ) : (
                    messages.map(msg => (
                        <ChatBubble 
                            key={msg.id} 
                            message={msg} 
                            isSender={msg.uid === currentUser.uid}
                            timestamp={msg.timestamp}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSend} className="p-3 border-t border-gc-border flex space-x-2 bg-gc-card rounded-b-xl">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 bg-gc-vibe border border-gc-border rounded-full text-white placeholder-gray-500 focus:ring-1 focus:ring-gc-primary transition"
                />
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={!input.trim()}
                    className="p-3 bg-gc-primary text-white rounded-full disabled:bg-gray-700 transition"
                >
                    <FiSend className="w-5 h-5" />
                </motion.button>
            </form>
        </motion.div>
    );
};

export default ChatWindow;
