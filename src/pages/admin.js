// src/pages/admin.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { db } from '../utils/firebase';
import { doc, updateDoc, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';
import toast from 'react-hot-toast';
// --- FIX: FiCrown is not exported, use FaCrown ---
import { FiUserCheck, FiLink, FiPlusCircle, FiAlertTriangle, FiTrash2, FiUsers, FiSettings } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa'; // Correct import for the crown icon

// ... (rest of the imports)

const AdminPanel = () => {
    // ... (state setup and functions remain the same)

    if (loading || !isAdmin) return null; // Use null to prevent flickering before redirect

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 lg:p-8 space-y-8 min-h-[calc(100vh-80px)]"
        >
            <Head><title>Admin Dashboard | Special Squad</title></Head>
            
            <motion.h1 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-3xl font-extrabold text-yellow-400 flex items-center space-x-3 border-b pb-4 border-gray-700"
            >
                {/* USE FaCrown HERE */}
                <FaCrown className="w-8 h-8" />
                <span>Squad Admin Dashboard</span>
            </motion.h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Admin Actions */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1 bg-gray-800 p-6 rounded-xl shadow-xl border border-yellow-600"
                >
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2"><FiSettings /><span>Settings & Announcements</span></h2>
                    
                    {/* ... (rest of the GC update logic remains the same) */}

                </motion.div>
                
                {/* ... (rest of the component remains the same) */}
            </div>
        </motion.div>
    );
};

export default AdminPanel;
