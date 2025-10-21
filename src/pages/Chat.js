import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { useAuth } from '../utils/AuthContext';
import { collection, query, where, onSnapshot, orderBy, limit, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { FiMessageSquare, FiUsers, FiSearch, FiSend, FiRefreshCw } from 'react-icons/fi';
import ChatThread from '../components/ChatThread';
import MessageList from '../components/MessageList';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Define the Public Chat ID
const PUBLIC_CHAT_ID = "public_squad_chat";

const Chat = () => {
    const { currentUser, userProfile, loading: authLoading } = useAuth();
    const router = useRouter();

    const [threads, setThreads] = useState([]); // List of 1-on-1 DM threads
    const [publicMessages, setPublicMessages] = useState([]);
    const [loadingThreads, setLoadingThreads] = useState(true);
    const [activeChat, setActiveChat] = useState({ type: 'public', id: PUBLIC_CHAT_ID, partner: null }); // {type: 'public' | 'dm', id, partner: userProfile}

    // --- Access Control ---
    useEffect(() => {
        if (!authLoading && !currentUser) {
            router.push('/login');
        }
    }, [authLoading, currentUser, router]);

    // --- 1. Fetch DM Threads ---
    useEffect(() => {
        if (!currentUser) return;
        setLoadingThreads(true);

        // Query threads where the current user is a participant
        const threadsQuery = query(
            collection(db, 'threads'),
            where('participants', 'array-contains', currentUser.uid),
            orderBy('lastMessageAt', 'desc'),
            limit(20)
        );

        const unsubscribe = onSnapshot(threadsQuery, async (snapshot) => {
            const fetchedThreads = [];
            for (const docSnapshot of snapshot.docs) {
                const threadData = docSnapshot.data();
                
                // Identify the partner's UID
                const partnerUid = threadData.participants.find(uid => uid !== currentUser.uid);
                let partnerProfile = null;

                if (partnerUid) {
                    // Fetch partner's profile
                    const partnerDoc = await getDoc(doc(db, 'users', partnerUid));
                    if (partnerDoc.exists()) {
                        partnerProfile = partnerDoc.data();
                    }
                }

                fetchedThreads.push({
                    id: docSnapshot.id,
                    ...threadData,
                    partner: partnerProfile
                });
            }

            setThreads(fetchedThreads);
            setLoadingThreads(false);
        }, (error) => {
            console.error("Error fetching threads:", error);
            toast.error("Failed to load chat threads.");
            setLoadingThreads(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // --- 2. Fetch Public Chat Messages ---
    useEffect(() => {
        // Simple listener for the public chat collection
        const publicChatQuery = query(
            collection(db, 'messages', PUBLIC_CHAT_ID, 'content'),
            orderBy('timestamp', 'asc'),
            limit(100) // Limit to the last 100 messages
        );

        const unsubscribe = onSnapshot(publicChatQuery, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPublicMessages(messages);
        }, (error) => {
            console.error("Error fetching public messages:", error);
        });

        return () => unsubscribe();
    }, []);

    const handleSelectChat = (type, id, partner = null) => {
        setActiveChat({ type, id, partner });
    };

    if (authLoading || !currentUser) return null;

    return (
        <div className="min-h-screen">
            <Head><title>Chat Hub | Special Squad</title></Head>
            <Header />

            <main className="pl-72 flex h-screen pt-4">
                <div className="flex-1 flex max-w-6xl mx-auto border border-gray-700 rounded-xl overflow-hidden bg-gray-800 shadow-2xl">

                    {/* Left Panel: Threads List */}
                    <div className="w-80 border-r border-gray-700 flex flex-col">
                        <h2 className="text-xl font-bold p-4 flex items-center space-x-2 border-b border-gray-700 text-gc-primary">
                            <FiMessageSquare /> <span>Conversations</span>
                        </h2>
                        
                        {/* Public Chat Button */}
                        <motion.div 
                            whileHover={{ backgroundColor: '#374151' }}
                            className={`p-4 cursor-pointer border-b border-gray-700 transition duration-150 ${activeChat.type === 'public' ? 'bg-gc-primary/20' : 'bg-gray-700/50'}`}
                            onClick={() => handleSelectChat('public', PUBLIC_CHAT_ID)}
                        >
                            <div className="flex items-center space-x-3">
                                <FiUsers className="w-5 h-5 text-green-400" />
                                <span className="font-semibold">Public Squad Chat</span>
                            </div>
                        </motion.div>

                        {/* DM Threads */}
                        <div className="flex-1 overflow-y-auto">
                            {loadingThreads ? (
                                <div className="text-center p-6 text-gray-400">
                                    <FiRefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-gc-primary" />
                                </div>
                            ) : threads.length === 0 ? (
                                <p className="text-center text-gray-400 p-6">Start a DM from a member's profile!</p>
                            ) : (
                                threads.map(thread => (
                                    <ChatThread 
                                        key={thread.id} 
                                        thread={thread} 
                                        isActive={activeChat.id === thread.id}
                                        onSelect={() => handleSelectChat('dm', thread.id, thread.partner)} 
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Message Area */}
                    <div className="flex-1 flex flex-col">
                        <div className="p-4 border-b border-gray-700">
                            <h3 className="font-bold text-lg text-white">
                                {activeChat.type === 'public' ? 'The Squad General Chat' : `Chat with @${activeChat.partner?.username || 'Loading...'}`}
                            </h3>
                        </div>
                        
                        <MessageList 
                            messages={activeChat.type === 'public' ? publicMessages : threads.find(t => t.id === activeChat.id)?.messages || []}
                            chatType={activeChat.type}
                            threadId={activeChat.id}
                            currentUserUid={currentUser.uid}
                            userProfile={userProfile}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Chat;
