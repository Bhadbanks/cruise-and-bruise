// src/pages/splash.js
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCrown, FaFeatherAlt } from 'react-icons/fa';
import { useAuth } from '../utils/AuthContext'; // Import to handle redirect if logged in

const SplashPage = () => {
    const { currentUser, loading } = useAuth();
    
    // Redirect if already logged in and not loading
    if (!loading && currentUser) {
        // AppShell will handle redirection to /gc-join or /feed
        return null; 
    }

    const DEV_NAME = "༺𝕷𝖔𝖜𝖐𝖊𝖞 𝕴𝖘 𝕳𝖎𝖒༻";

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center justify-center p-4 bg-gc-vibe text-center"
        >
            <motion.div
                initial={{ scale: 0.5, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 50, damping: 10 }}
                className="max-w-md"
            >
                {/* Your huge, custom logo image */}
                <img 
                    src="/1761147919922.jpeg" // Use your provided image path 
                    alt="Special Squad - The Ultimatum" 
                    className="w-full h-auto object-contain mx-auto shadow-2xl rounded-xl border-4 border-gc-primary/50"
                />
            </motion.div>
            
            <h1 className="text-5xl font-extrabold text-white mt-8 mb-4">
                👑✨💥 𝕊𝕡𝕖𝕔𝕚𝕒𝕝 𝕊𝕢𝕦𝕒𝖉 💥✨👑
            </h1>
            <p className="text-xl text-gc-secondary mb-10 font-medium">
                The Ultimatum
            </p>

            <div className="flex space-x-4">
                <Link href="/login" legacyBehavior>
                    <motion.a 
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-2 px-8 py-3 bg-gc-primary text-white font-bold rounded-full shadow-gc-glow transition duration-300"
                    >
                        <FaFeatherAlt />
                        <span>Log In</span>
                    </motion.a>
                </Link>
                <Link href="/register" legacyBehavior>
                    <motion.a 
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-2 px-8 py-3 bg-gc-secondary text-white font-bold rounded-full shadow-gc-glow transition duration-300"
                    >
                        <FaCrown />
                        <span>Join the Squad</span>
                    </motion.a>
                </Link>
            </div>
            
            {/* Dev Contact and Footer Info */}
            <div className="absolute bottom-4 text-gray-500 text-xs flex flex-col items-center">
                <p>Developed by: <span className='text-gc-primary font-semibold'>{DEV_NAME}</span></p>
                <p className='mt-1'>© 2025 Special Squad. All rights reserved.</p>
            </div>
        </motion.div>
    );
};

SplashPage.displayName = 'splash'; 

export default SplashPage;
