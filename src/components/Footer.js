// src/components/Footer.js
import React from 'react';
import { useAuth } from '../utils/AuthContext';
import { FiCode, FiUser, FiExternalLink } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    const { DEV_CONTACT, GC_LINK } = useAuth();

    return (
        <footer className="w-full bg-gray-900/50 border-t border-gray-700 mt-10 p-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                
                {/* Copyright/App Name */}
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                    <img src="/logo.png" alt="Logo" className="w-6 h-6" />
                    <span>&copy; {new Date().getFullYear()} Special Squad. All rights reserved.</span>
                </div>

                {/* Contact Links */}
                <div className="flex flex-wrap justify-center md:justify-end space-x-6">
                    
                    {/* Dev Contact */}
                    <a 
                        href={`https://${DEV_CONTACT}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 hover:text-gc-primary transition duration-200"
                    >
                        <FiCode />
                        <span>Dev Contact (Lowkey Is Him)</span>
                    </a>

                    {/* Admin Contact - Assuming Dev is Admin */}
                    <a 
                        href={`https://${DEV_CONTACT}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 hover:text-yellow-400 transition duration-200"
                    >
                        <FiUser />
                        <span>Admin Contact</span>
                    </a>
                    
                    {/* GC Link */}
                    <a 
                        href={GC_LINK} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 hover:text-green-500 transition duration-200"
                    >
                        <FaWhatsapp />
                        <span>GC Link</span>
                        <FiExternalLink className="w-3 h-3"/>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
