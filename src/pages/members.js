// src/pages/members.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiUsers } from 'react-icons/fi';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import UserCard from '../components/UserCard';
import toast from 'react-hot-toast';
import GlobalLoading from '../components/GlobalLoading';

const MembersPage = () => {
    const [allMembers, setAllMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // --- Fetch All Members (Once) ---
    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, 'users'));
                const querySnapshot = await getDocs(q);
                
                const membersList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setAllMembers(membersList);
                setFilteredMembers(membersList);

            } catch (error) {
                console.error("Error fetching members:", error);
                toast.error("Failed to load members list.");
            }
            setLoading(false);
        };

        fetchMembers();
    }, []);

    // --- Search Filtering ---
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

    if (loading) {
        return <GlobalLoading />;
    }

    return (
        <div className="w-full">
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-16 lg:top-0 p-4 border-b border-gc-border bg-gc-vibe/95 backdrop-blur-sm z-30 shadow-2xl"
            >
                <h1 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                    <FiUsers className='text-gc-secondary' /> <span>Squad Members Directory</span>
                </h1>
                
                <div className="relative">
                    <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search users by username or email..."
                        className="w-full pl-10 pr-4 py-3 bg-gc-vibe border border-gc-secondary/50 rounded-xl text-white placeholder-gray-500 focus:ring-1 focus:ring-gc-primary focus:border-gc-primary transition"
                    />
                </div>
            </motion.div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {filteredMembers.length > 0 ? (
                    filteredMembers.map(member => (
                        <UserCard key={member.id} user={member} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-10 col-span-full">
                        No members found matching "{searchTerm}". Try a different username.
                    </p>
                )}
            </div>
        </div>
    );
};

export default MembersPage;
