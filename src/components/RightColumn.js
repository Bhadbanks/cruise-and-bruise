// src/components/RightColumn.js
import React, { useState, useEffect } from 'react';
import { FiSearch, FiGlobe } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { collection, query, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import Link from 'next/link';

// Placeholder for external news API integration (Twitter/X style trends)
const NewsWidget = () => (
    <div className="bg-gc-card rounded-xl p-4 mb-4 border border-gc-border">
        <h3 className="text-xl font-bold text-white mb-3">What's Happening</h3>
        <ul className="space-y-3 text-sm">
            {[
                { title: "#SquadGoals", count: "1.2K Vibes" },
                { title: "New Firebase Update", count: "500 Posts" },
                { title: "Trending in Lagos", count: "899 Talks" },
            ].map((item, index) => (
                <motion.li 
                    key={index}
                    whileHover={{ backgroundColor: '#15151F', scale: 1.01 }}
                    className="p-2 -mx-2 rounded-lg transition duration-200 cursor-pointer"
                >
                    <p className="text-gray-500 text-xs">Trending</p>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-gray-500 text-xs">{item.count}</p>
                </motion.li>
            ))}
        </ul>
    </div>
);

// Suggests users to follow
const WhoToFollowWidget = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const q = query(collection(db, 'users'), limit(3)); // Get 3 random users
            const snapshot = await getDocs(q);
            setUsers(snapshot.docs.map(doc => doc.data()));
        };
        fetchUsers();
    }, []);

    return (
        <div className="bg-gc-card rounded-xl p-4 mb-4 border border-gc-border">
            <h3 className="text-xl font-bold text-white mb-3">Who to Follow</h3>
            <ul className="space-y-3">
                {users.map(user => (
                    <div key={user.uid} className="flex items-center justify-between">
                        <Link href={`/profile/${user.username}`} legacyBehavior>
                            <div className="flex items-center space-x-3 cursor-pointer">
                                <img src={user.profilePicUrl || '/default-avatar.png'} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <p className="font-semibold text-white hover:underline">@{user.username}</p>
                                    <p className="text-gray-500 text-sm truncate">{user.bio || 'New Vibe Member'}</p>
                                </div>
                            </div>
                        </Link>
                        <motion.button 
                            whileHover={{ scale: 1.05 }} 
                            className="bg-gc-text text-gc-card font-bold text-sm px-3 py-1 rounded-full"
                        >
                            Follow
                        </motion.button>
                    </div>
                ))}
            </ul>
        </div>
    );
};

// Custom Contact/GC Widget (Requested Feature)
const SquadContactWidget = () => (
    <div className="bg-gc-card rounded-xl p-4 border border-gc-secondary/50">
        <h3 className="text-xl font-bold text-gc-secondary mb-3 flex items-center space-x-2">
            <FiGlobe /> <span>Squad Connect</span>
        </h3>
        <p className="text-gray-400 text-sm mb-3">
            Join our core WhatsApp Group to stay in the loop with all things Special Squad!
        </p>
        <motion.a 
            href="https://chat.whatsapp.com/YOUR_GROUP_LINK_HERE" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, backgroundColor: '#1d9bf0' }}
            className="w-full block text-center py-2 bg-gc-primary text-white font-bold rounded-full transition duration-300"
        >
            Join the Main GC!
        </motion.a>
    </div>
);


const RightColumn = () => {
    return (
        <div className="space-y-4">
            {/* Search Bar (Twitter/X Style) */}
            <div className="sticky top-0 pt-4 bg-gc-vibe z-10">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search Squad members and vibes" 
                        className="w-full pl-10 pr-4 py-3 bg-gc-card border border-gc-border rounded-full text-white placeholder-gray-500 focus:ring-1 focus:ring-gc-primary transition"
                    />
                </div>
            </div>

            <NewsWidget />
            <WhoToFollowWidget />
            <SquadContactWidget />
        </div>
    );
};

export default RightColumn;
