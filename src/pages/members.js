// src/pages/members.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import MemberCard from '../components/MemberCard';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/router';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { FiSearch, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Members = () => {
    const { currentUser, loading } = useAuth();
    const router = useRouter();
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dataLoading, setDataLoading] = useState(true);

    // Redirect unauthenticated users
    useEffect(() => {
        if (!loading && !currentUser) {
            router.push('/login');
        }
    }, [loading, currentUser, router]);

    // Fetch all members once
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const q = query(collection(db, "users"));
                const querySnapshot = await getDocs(q);
                const membersList = querySnapshot.docs.map(doc => ({
                    uid: doc.id,
                    ...doc.data()
                }));
                setMembers(membersList);
            } catch (error) {
                console.error("Error fetching members:", error);
            } finally {
                setDataLoading(false);
            }
        };
        fetchMembers();
    }, []);

    // Filter members based on search term (client-side for simplicity)
    const filteredMembers = members.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading || !currentUser) return null;

    return (
        <div className="min-h-screen">
            <Head><title>Members Directory | Special Squad</title></Head>
            <Header />

            <main className="pl-0 lg:pl-72 py-8 px-4 lg:px-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-3xl font-extrabold mb-4 text-white flex items-center space-x-2 border-b pb-2 border-gray-700">
                        <FiUsers className="text-gc-primary" />
                        <span>Squad Members Directory</span>
                    </h1>

                    {/* Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="relative"
                    >
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search members by username, bio, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-4 pl-12 bg-gray-700 text-white rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-gc-primary focus:outline-none transition duration-200"
                        />
                    </motion.div>

                    {/* Member Grid */}
                    {dataLoading ? (
                         <div className="text-center p-10 text-gray-400">Loading members...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredMembers.map(user => (
                                <MemberCard key={user.uid} user={user} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Members;
