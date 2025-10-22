// src/components/Footer.js
import React from 'react';
import Link from 'next/link';
import { FaHeart, FaCrown, FaGithub, FaCode } from 'react-icons/fa'; // NEW ICONS
import { useAuth } from '../utils/AuthContext';

const Footer = () => {
    const { DEVELOPER_WHATSAPP } = useAuth();

    return (
        // UPGRADED STYLES: Thicker border, margin-top fixed.
        <footer className="mt-12 p-6 border-t-2 border-gc-secondary/50 text-center text-sm text-gray-500 bg-gc-vibe shadow-inner">
            <div className="max-w-6xl mx-auto">
                <p className="mb-3 text-lg font-semibold text-white flex items-center justify-center space-x-2">
                    <FaCode className="text-gc-secondary" />
                    <span>Developed for 👑✨ Special Squad ✨👑. All rights reserved</span>
                </p>
                <p className="mb-4 flex items-center justify-center space-x-1 text-base">
                    <span>Built with</span>
                    <FaHeart className="text-gc-primary w-4 h-4 animate-pulse" />
                    <span>and Next.js/Firebase.</span>
                </p>

                <div className="flex justify-center space-x-6 text-base border-t border-gc-border pt-4">
                    <Link href="/terms" legacyBehavior><a className="hover:text-gc-primary">Terms & Conditions</a></Link>
                    <Link href="/privacy" legacyBehavior><a className="hover:text-gc-primary">Privacy Policy</a></Link>
                    {/* Developer Support Link */}
                    <a 
                        href={DEVELOPER_WHATSAPP} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center space-x-1 hover:text-gc-admin transition"
                    >
                        <FaCrown className="w-3 h-3 text-gc-admin" />
                        <span>Dev Support</span>
                    </a>
                </div>
                
                <p className="mt-4 text-xs">© 2025 Special Squad Social. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
