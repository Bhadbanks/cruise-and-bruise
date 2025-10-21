// src/pages/chat.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/router';
import { collection, query, orderBy, limit, addDoc, serverTimestamp, onSnapshot, getDocs, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { FiSend, FiUsers, FiMessageCircle, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ChatHub = () => {
    const { currentUser, loading, userProfile } = useAuth();
    const router = useRouter();
    const { user: dmUsername } = router.query;

    const [messageInput, setMessageInput] = useState('');
    const [publicMessages, setPublicMessages] = useState([]);
    const [recipientProfile, setRecipientProfile] = useState(null);
    const [isPrivate, setIsPrivate] = useState(false);

    // Redirect unauthenticated users
    useEffect(() => {
        if (!loading && !currentUser) {
            router.push('/login');
        }
    }, [loading, currentUser, router]);

    // 1. Fetch Recipient Profile for DM
    useEffect(() => {
        setIsPrivate(!!dmUsername);
        setRecipientProfile(null); // Reset recipient

        if (dmUsername) {
            const fetchRecipient = async () => {
                const q = query(collection(db, "users"), where("username", "==", dmUsername));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    setRecipientProfile(snapshot.docs[0].data());
                } else {
                    toast.error(`User @${dmUsername} not found.`);
                    router.push('/chat'); // Fall back to public chat
                }
            };
            fetchRecipient();
        }
    }, [dmUsername, router]);

    // 2. Real-time Public Chat Listener
    useEffect(() => {
        if (!currentUser || isPrivate) return;

        const messagesQuery = query(
            collection(db, "chats/public/messages"),
            orderBy("timestamp", "asc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPublicMessages(messages);
        }, (error) => {
            console.error("Error fetching public messages:", error);
            toast.error("Failed to load chat history.");
        });

        return () => unsubscribe();
    }, [currentUser, isPrivate]);


    const sendMessage = async (e) => {
        e.preventDefault();
        const content = messageInput.trim();
        if (!content || !userProfile) return;

        setMessageInput('');

        try {
            // For this blueprint, we only implement the Public Chat send
            if (!isPrivate) {
                await addDoc(collection(db, "chats/public/messages"), {
                    content: content,
                    authorUid: userProfile.uid,
                    authorUsername: userProfile.username,
                    authorAvatar: userProfile.profilePicUrl,
                    timestamp: serverTimestamp(),
                });
            } else {
                // Future DM logic would go here:
                toast.error("Private DMs are a premium feature (Placeholder).");
                console.log(`DM attempt to ${recipientProfile.username}: ${content}`);
            }

        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message.");
        }
    };
    
    // Component for a single message bubble
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
                         {message.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Sending...'}
                    </span>
                </motion.div>
            </div>
        );
    };

    if (loading || !currentUser) return null;

    return (
        <div className="min-h-screen">
            <Head><title>{isPrivate ? `DM with @${dmUsername}` : 'Public Chat Hub'} | Special Squad</title></Head>
            <Header />

            <main className="pl-0 lg:pl-72 py-8 px-4 lg:px-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    <h1 className="text-3xl font-extrabold mb-4 text-white flex items-center space-x-2 border-b pb-2 border-gray-700">
                        {isPrivate ? (
                            <>
                                <FiLock className="text-red-400" />
                                <span>Private DM: @{recipientProfile?.username || dmUsername}</span>
                            </>
                        ) : (
                            <>
                                <FiUsers className="text-gc-primary" />
                                <span>Public Squad Chat Hub</span>
                            </>
                        )}
                    </h1>
                    
                    {/* Message Display Area */}
                    <div className="bg-gray-800 h-[60vh] rounded-xl p-4 flex flex-col shadow-2xl">
                        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                            {publicMessages.length === 0 && !isPrivate ? (
                                <p className="text-center text-gray-400 pt-10">Start the conversation! No messages yet.</p>
                            ) : (
                                publicMessages.map(msg => <MessageBubble key={msg.id} message={msg} />)
                            )}
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
                </div>
            </main>
        </div>
    );
};

export default ChatHub;
