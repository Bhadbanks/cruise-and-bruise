// src/components/GlobalLoading.js
import React from 'react';
import { FaCrown } from 'react-icons/fa';
import { motion } from 'framer-motion';

const GlobalLoading = () => (
    // FIX: Use min-h-screen but ensure flex centering is correct
    <div className="min-h-screen w-full flex items-center justify-center fixed inset-0 z-50 bg-gc-vibe">
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
