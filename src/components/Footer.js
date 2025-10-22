// src/components/Footer.js
import React from 'react';
import Link from 'next/link';
import { FaHeart, FaCrown } from 'react-icons/fa';
import { useAuth } from '../utils/AuthContext';

const Footer = () => {
    const { DEVELOPER_WHATSAPP } = useAuth();

    return (
        <footer className="mt-10 p-4 border-t border-gc-border text-center text-sm text-gray-500 bg-gc-vibe">
            <p className="mb-2 flex items-center justify-center space-x-1">
                <span>Built with</span>
                <FaHeart className="text-gc-primary w-4 h-4 animate-pulse" />
                <span>for the SquadVibe.</span>
            </p>
            <p className="space-x-4">
                <Link href="/terms" legacyBehavior><a className="hover:text-gc-secondary">Terms</a></Link>
                <Link href="/privacy" legacyBehavior><a className="hover:text-gc-secondary">Privacy</a></Link>
                {/* Developer Support Link */}
                <a 
                    href={DEVELOPER_WHATSAPP} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center space-x-1 hover:text-gc-admin"
                >
                    <FaCrown className="w-3 h-3 text-gc-admin" />
                    <span>Dev Support</span>
                </a>
            </p>
            <p className="mt-2 text-xs">© 2025 SquadVibe Social. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
