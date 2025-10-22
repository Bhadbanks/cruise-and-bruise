// src/components/GlobalLoading.js
import React from 'react';
import { FaCrown } from 'react-icons/fa';
import { motion } from 'framer-motion';

const GlobalLoading = () => (
    // Change to 'fixed' to overlay instead of taking up layout space
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gc-vibe/95 backdrop-blur-sm">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-gc-primary"
        >
            <FaCrown className="w-12 h-12" />
        </motion.div>
        <p className="ml-4 text-xl font-semibold text-gc-text">Loading the Squad Vibe...</p>
    </div>
);

export default GlobalLoading;
