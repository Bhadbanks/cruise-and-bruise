// src/pages/404.js
import React from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';

const Custom404 = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gc-vibe bg-gc-gradient">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="text-center bg-gc-card p-10 rounded-xl shadow-2xl border-2 border-gc-primary/80"
            >
                <FiAlertTriangle className="w-16 h-16 mx-auto text-gc-primary mb-4" />
                <h1 className="text-6xl font-extrabold text-white mb-2">404</h1>
                <h2 className="text-2xl font-semibold text-gray-300 mb-6">Page Not Found</h2>
                <p className="text-gray-400 mb-8 max-w-sm">
                    Oops! The vibe you were looking for seems to have been moved or doesn't exist.
                </p>
                
                <motion.button
                    onClick={() => router.push('/')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gc-secondary text-white font-bold rounded-full shadow-lg hover:bg-gc-secondary/80 transition duration-300"
                >
                    <FiHome />
                    <span>Return to Squad Feed</span>
                </motion.button>
            </motion.div>
        </div>
    );
};

export default Custom404;
