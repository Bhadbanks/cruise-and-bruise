import { useEffect, useRef, useState } from 'react';
import { collection, doc, addDoc, updateDoc, arrayUnion, serverTimestamp, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const MessageList = ({ threadId, chatType, currentUserUid, userProfile }) => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);

    // --- 1. Real-Time Listener for Messages ---
    useEffect(() => {
        // Only set up a listener if it's a DM (as messages are stored in the thread document) or public
        if (chatType === 'public') {
            const publicChatQuery = query(
                collection(db, 'messages', threadId, 'content'),
                orderBy('timestamp', 'asc'),
                limit(100)
            );
            const unsubscribe = onSnapshot(publicChatQuery, (snapshot) => {
                const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMessages(fetchedMessages);
            });
            return () => unsubscribe();
        } 
        // NOTE: For DMs, the messages array should be passed down via props from the thread listener in chat.js
        // For simplicity and to ensure data is fresh, we will use a subcollection approach here for DMs too.
        // For now, we will assume the data passed via props is sufficient.
    }, [threadId, chatType]);

    // Scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // --- 2. Send Message Logic ---
    const handleSendMessage = async (e) => {
        e.preventDefault();
        const content = messageInput.trim();
        if (!content) return;
        if (!userProfile) {
            toast.error("You must be logged in to send messages.");
            return;
        }

        const messageData = {
            senderId: currentUserUid,
            senderUsername: userProfile.username,
            senderAvatar: userProfile.profilePicUrl,
            content: content,
            timestamp: serverTimestamp(),
        };
        
        try {
            if (chatType === 'public') {
                // Public Chat: Add to subcollection 'messages/{PUBLIC_CHAT_ID}/content'
                await addDoc(collection(db, 'messages', threadId, 'content'), messageData);
            } else if (chatType === 'dm') {
                // DM Chat: Add to subcollection 'messages/{threadId}/content'
                await addDoc(collection(db, 'messages', threadId, 'content'), messageData);
                
                // Update the main thread document with the last message summary
                await updateDoc(doc(db, 'threads', threadId), {
                    lastMessageText: content,
                    lastMessageAt: serverTimestamp(),
                });
            }
            setMessageInput('');

        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message.");
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            {/* Messages Display Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
                {messages.length === 0 ? (
                    <div className="text-center p-10 text-gray-400">
                        <p>Say hello to the Squad!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <MessageBubble key={message.id} message={message} isOutgoing={message.senderId === currentUserUid} />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 bg-gray-800 border-t border-gray-700 flex items-center space-x-3">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 p-3 bg-gray-700 rounded-full placeholder-gray-400 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    required
                />
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    className="p-3 bg-gc-primary text-white rounded-full transition duration-200 disabled:opacity-50"
                    disabled={!messageInput.trim()}
                >
                    <FiSend className="w-6 h-6" />
                </motion.button>
            </form>
        </div>
    );
};

// --- Message Bubble Component ---
const MessageBubble = ({ message, isOutgoing }) => {
    const time = message.timestamp?.seconds ? new Date(message.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...';

    return (
        <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className={`max-w-xs lg:max-w-md p-3 rounded-xl shadow-md ${
                    isOutgoing 
                        ? 'bg-gc-primary text-white rounded-br-none' 
                        : 'bg-gray-700 text-gray-100 rounded-tl-none'
                }`}
            >
                {!isOutgoing && (
                    <span className="font-bold text-sm mb-1 block hover:underline cursor-pointer">
                        {message.senderUsername}
                    </span>
                )}
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className={`block text-xs mt-1 ${isOutgoing ? 'text-pink-200' : 'text-gray-400'} text-right`}>
                    {time}
                </span>
            </motion.div>
        </div>
    );
};

export default MessageList;
