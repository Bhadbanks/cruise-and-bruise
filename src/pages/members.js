// src/pages/members.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiSearch } from 'react-icons/fi';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import UserCard from '../components/UserCard'; 
import GlobalLoading from '../components/GlobalLoading';
import toast from 'react-hot-toast';

const MembersPage = () => {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, 'users'));
                const snapshot = await getDocs(q);
                const fetchedMembers = snapshot.docs.map(doc => doc.data());
                setMembers(fetchedMembers);
            } catch (error) {
                console.error("Error fetching members:", error);
                toast.error("Failed to load members list.");
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    const filteredMembers = members.filter(user => 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.bio?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <GlobalLoading />;

    return (
        <div className="w-full p-4">
            <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-extrabold text-white mb-6 flex items-center space-x-3 border-b border-gc-border pb-3"
            >
                <FiUsers className="text-gc-primary" /> <span>Squad Members ({members.length})</span>
            </motion.h1>

            {/* Search Bar */}
            <div className="relative mb-6">
                <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search members by username or bio" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gc-card border border-gc-border rounded-full text-white placeholder-gray-500 focus:ring-1 focus:ring-gc-primary transition"
                />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.length > 0 ? (
                    filteredMembers.map(user => (
                        // Re-using the UserCard component for display
                        <UserCard key={user.uid} user={user} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500 py-10">
                        No members match your search criteria.
                    </p>
                )}
            </div>
        </div>
    );
};

MembersPage.displayName = 'MembersPage';

export default MembersPage;
