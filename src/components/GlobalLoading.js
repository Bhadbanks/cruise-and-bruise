// src/components/GlobalLoading.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaCrown } from 'react-icons/fa';

const GlobalLoading = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gc-vibe text-white p-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
                <FaCrown className="w-16 h-16 text-gc-admin" />
            </motion.div>
            <h1 className="text-2xl font-bold mt-4 text-gc-primary">
                Loading The Special Squad Vibe...
            </h1>
            <p className='text-sm text-gray-500 mt-1'>Initializing Vibe Protocols...</p>
        </div>
    );
};

export default GlobalLoading;
