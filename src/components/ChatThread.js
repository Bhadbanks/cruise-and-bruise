// src/components/ChatThread.js
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../utils/AuthContext';
import { collection, query, orderBy, limit, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { FiSend, FiMessageCircle, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';

const ChatThread = ({ isPrivate, recipientProfile }) => {
    const { currentUser, userProfile } = useAuth();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);

    // Dynamic collection path
    // For a simple public chat, we use a fixed path.
    // For DMs, the path would need to be based on sorted UIDs: `chats/${UID1_UID2}/messages`
    const collectionPath = isPrivate 
        ? `chats/private/${recipientProfile?.uid}` // Simplified path for blueprint
        : "chats/public/messages"; 

    // Real-time Chat Listener
    useEffect(() => {
        if (!currentUser || (isPrivate && !recipientProfile)) return;

        const messagesQuery = query(
            collection(db, collectionPath),
            orderBy("timestamp", "asc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate().getTime()
            }));
            setMessages(msgs.sort((a, b) => a.timestamp - b.timestamp));
        }, (error) => {
            console.error("Error fetching messages:", error);
            toast.error("Failed to load chat history.");
        });

        return () => unsubscribe();
    }, [currentUser, collectionPath, recipientProfile]);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        const content = messageInput.trim();
        if (!content || !userProfile) return;

        setMessageInput('');

        try {
            // Note: Private DM implementation is intentionally basic for this blueprint.
            if (isPrivate) {
                toast.error("Private DMs are a premium feature (Placeholder).");
                return;
            }
            
            await addDoc(collection(db, collectionPath), {
                content: content,
                authorUid: userProfile.uid,
                authorUsername: userProfile.username,
                authorAvatar: userProfile.profilePicUrl,
                timestamp: serverTimestamp(),
            });

        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message.");
        }
    };

    const MessageBubble = ({ message }) => {
        const isMe = message.authorUid === currentUser.uid;
        return (
            <div className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
                <motion.div
                    initial={{ opacity: 0, x: isMe ? 20 : -20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`max-w-xs lg:max-w-md p-3 rounded-xl shadow-md ${
                        isMe ? 'bg-gc-primary/80 text-white rounded-br-none' : 'bg-gray-700 text-gray-100 rounded-tl-none'
                    }`}
                >
                    {!isMe && (
                        <Link href={`/profile/${message.authorUsername}`} legacyBehavior>
                            <a className="font-bold text-sm mb-1 block hover:underline text-gc-primary">
                                @{message.authorUsername}
                            </a>
                        </Link>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs mt-1 block text-right opacity-60">
                         {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                    </span>
                </motion.div>
            </div>
        );
    };
    
    // Determine header display
    const headerTitle = isPrivate 
        ? `Private DM: @${recipientProfile?.username || 'Loading...'}`
        : 'Public Squad Chat Hub';

    const headerIcon = isPrivate ? <FiLock className="text-red-400" /> : <FiMessageCircle className="text-gc-primary" />;

    return (
        <div className="bg-gray-800 h-[70vh] rounded-xl p-4 flex flex-col shadow-2xl">
            <h2 className="text-xl font-extrabold pb-3 mb-3 text-white flex items-center space-x-2 border-b border-gray-700">
                 {headerIcon}
                 <span>{headerTitle}</span>
            </h2>

            {/* Message Display Area */}
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                {messages.length === 0 ? (
                    <p className="text-center text-gray-400 pt-10">Start the conversation!</p>
                ) : (
                    messages.map(msg => <MessageBubble key={msg.id} message={msg} />)
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={sendMessage} className="mt-4 flex space-x-3 border-t pt-4 border-gray-700">
                <input
                    type="text"
                    placeholder={isPrivate ? `Message @${recipientProfile?.username}...` : "Send a message to the public chat..."}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 p-3 bg-gray-700 text-white rounded-full placeholder-gray-400 focus:ring-2 focus:ring-gc-primary focus:outline-none"
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="px-6 py-3 bg-gc-primary text-white rounded-full font-bold hover:bg-pink-700 transition duration-200 disabled:opacity-50"
                >
                    <FiSend className="w-5 h-5" />
                </motion.button>
            </form>
        </div>
    );
};

export default ChatThread;
