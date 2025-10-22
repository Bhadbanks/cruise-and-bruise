// src/components/Footer.js
import React from 'react';
import Link from 'next/link';
import { FaHeart, FaCrown } from 'react-icons/fa';
import { useAuth } from '../utils/AuthContext';

const Footer = () => {
    const { DEVELOPER_WHATSAPP } = useAuth();

    return (
        // 💎 UPGRADE: Change styling for better distinction
        <footer className="mt-10 p-6 border-t-4 border-gc-secondary/50 text-center text-sm text-gray-500 bg-gc-card shadow-inner">
            <p className="mb-2 flex items-center justify-center space-x-2 text-lg text-white font-semibold">
                <span>Built with</span>
                <FaHeart className="text-gc-primary w-5 h-5 animate-pulse" />
                <span>for the SquadVibe.</span>
            </p>
            <p className="space-x-6 mt-4">
                <Link href="/terms" legacyBehavior><a className="hover:text-gc-primary transition">Terms</a></Link>
                <Link href="/privacy" legacyBehavior><a className="hover:text-gc-primary transition">Privacy</a></Link>
                <a 
                    href={DEVELOPER_WHATSAPP} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center space-x-1 hover:text-gc-admin transition"
                >
                    <FaCrown className="w-3 h-3 text-gc-admin" />
                    <span>Dev Support</span>
                </a>
            </p>
            <p className="mt-4 text-xs text-gray-500">© 2025 SpecialSquad Social. All rights reserved ༺𝕷𝖔𝖜𝖐𝖊𝖞 𝕴𝖘 𝕳𝖎𝖒༻.</p>
        </footer>
    );
};

export default Footer;
