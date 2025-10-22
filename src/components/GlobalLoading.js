// src/components/GlobalLoading.js
import React from 'react';
import { FaCrown } from 'react-icons/fa';
import { motion } from 'framer-motion';

const GlobalLoading = () => (
    <div className="min-h-screen flex items-center justify-center bg-gc-vibe">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-gc-primary"
        >
            <FaCrown className="w-10 h-10" />
        </motion.div>
        <p className="ml-4 text-xl font-semibold text-gc-text">Loading the Squad Vibe...</p>
    </div>
);

export default GlobalLoading;
