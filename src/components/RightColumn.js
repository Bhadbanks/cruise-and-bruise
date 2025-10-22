// src/components/RightColumn.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiStar, FiUserCheck, FiZap } from 'react-icons/fi';
import { useAuth } from '../utils/AuthContext';

const WidgetCard = ({ title, icon: Icon, children, color }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gc-card p-4 rounded-xl shadow-lg border border-gc-border mb-4"
    >
        <h3 className={`text-lg font-bold mb-3 flex items-center space-x-2 ${color}`}>
            <Icon className="w-5 h-5" />
            <span>{title}</span>
        </h3>
        {children}
    </motion.div>
);

const RightColumn = () => {
    const { currentUser } = useAuth();
    
    return (
        <div className="sticky top-20">
            {/* 1. Trending Topics Widget (Advanced/Premium Feature) */}
            <WidgetCard title="Trending Vibe" icon={FiTrendingUp} color="text-gc-primary">
                <ul className="space-y-2 text-sm text-gray-300">
                    <li className="hover:text-gc-primary cursor-pointer transition">#SquadMeetup (12.5K Posts)</li>
                    <li className="hover:text-gc-primary cursor-pointer transition">#PremiumChat (8.1K Posts)</li>
                    <li className="hover:text-gc-primary cursor-pointer transition">#FridayNightVibes (5.2K Posts)</li>
                </ul>
            </WidgetCard>

            {/* 2. Premium Status Widget */}
            <WidgetCard title="Vibe Status" icon={FiZap} color="text-gc-secondary">
                <div className="text-sm">
                    {currentUser ? (
                        <>
                            <p className="text-white font-semibold">Current Level: ✨ Standard</p>
                            <p className="text-gray-400 mt-2">Unlock unlimited photo uploads and read receipts with **Squad Premium**!</p>
                            <motion.button 
                                whileHover={{ scale: 1.03 }}
                                className="mt-3 w-full py-2 bg-gc-primary text-white font-bold rounded-lg shadow-gc-glow-primary"
                            >
                                Go Premium
                            </motion.button>
                        </>
                    ) : (
                        <p className="text-gray-400">Log in to view your Vibe Status and Premium features.</p>
                    )}
                </div>
            </WidgetCard>
            
            {/* 3. Who to Follow Widget */}
            <WidgetCard title="Suggested Squad" icon={FiUserCheck} color="text-gc-verified">
                <ul className="space-y-3 text-sm">
                    {/* Dummy suggested users */}
                    <li className="flex items-center justify-between text-white">
                        <span className="hover:text-gc-verified cursor-pointer">@DeveloperVibe</span>
                        <span className="text-xs text-gray-500">10k Followers</span>
                    </li>
                    <li className="flex items-center justify-between text-white">
                        <span className="hover:text-gc-verified cursor-pointer">@ChatMaster</span>
                        <span className="text-xs text-gray-500">5k Followers</span>
                    </li>
                </ul>
            </WidgetCard>
        </div>
    );
};

export default RightColumn;
