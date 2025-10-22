// src/components/Header.js
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiHome, FiUsers, FiMessageCircle, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { FaCrown, FaFeatherAlt } from 'react-icons/fa';
import { useAuth } from '../utils/AuthContext';

const NavItem = ({ href, icon: Icon, label, isAdmin }) => {
    const router = useRouter();
    const isActive = router.pathname === href;
    const activeClass = isActive ? 'text-gc-primary font-bold' : 'text-gc-text hover:text-gc-primary';
    const baseClass = "flex items-center space-x-3 p-3 rounded-full transition duration-200 hover:bg-gc-card/50";
    
    return (
        <Link href={href} legacyBehavior>
            <motion.a 
                whileHover={{ scale: 1.05 }}
                className={`${baseClass} ${activeClass} ${isAdmin ? 'text-gc-admin' : ''}`}
            >
                <Icon className={`w-6 h-6 ${isAdmin ? 'text-gc-admin' : ''}`} />
                <span className="text-xl hidden xl:inline">{label}</span>
            </motion.a>
        </Link>
    );
};

const Header = () => {
    const { currentUser, userProfile, logout, isAdmin, loading } = useAuth();
    if (loading) return null;

    const navLinks = [
        { href: '/', icon: FiHome, label: 'Home' },
        { href: '/members', icon: FiUsers, label: 'Members' },
        { href: '/chat', icon: FiMessageCircle, label: 'Messages' },
        { href: `/profile/${userProfile?.username || 'me'}`, icon: FiUser, label: 'Profile' },
    ];
    
    return (
        <header className="sticky top-0 z-40 bg-gc-vibe/90 backdrop-blur-md border-b border-gc-border shadow-lg">
            <div className="max-w-6xl mx-auto flex lg:block items-center justify-between p-3">
                
                {/* 1. Mobile/Brand Logo (FIXED SIZE & NAME) */}
                <div className="lg:hidden flex items-center justify-between w-full">
                    <Link href="/" legacyBehavior>
                        <motion.a 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="flex items-center space-x-2 text-white font-extrabold text-xl"
                        >
                            {/* FIXED LOGO SIZE: w-8 h-8 */}
                            <img src="/logo.png" alt="Squad Logo" className="w-8 h-8 object-contain" />
                            {/* FIXED NAME */}
                            <span className="text-gc-primary">👑✨ Special Squad ✨👑</span>
                        </motion.a>
                    </Link>
                    {/* Mobile Post Button */}
                    {currentUser && (
                         <motion.button 
                            whileHover={{ scale: 1.1 }}
                            className="p-3 bg-gc-primary text-white rounded-full shadow-gc-glow"
                            onClick={() => {/* Open Post Modal Logic */}}
                        >
                            <FaFeatherAlt className="w-5 h-5" />
                        </motion.button>
                    )}
                </div>

                {/* 2. Desktop Navigation (Twitter/X style vertical sidebar) */}
                <nav className="hidden lg:block">
                    <div className="flex flex-col space-y-2 p-2">
                        {/* Desktop Brand Logo */}
                         <Link href="/" legacyBehavior>
                            <motion.a 
                                className="mb-4 flex items-center space-x-2 text-white font-extrabold text-2xl p-3"
                            >
                                <img src="/logo.png" alt="Squad Logo" className="w-8 h-8 object-contain" />
                                <span className="text-gc-primary hidden xl:inline">Squad</span>
                            </motion.a>
                        </Link>
                        
                        {/* Nav Links */}
                        {navLinks.map(link => (
                            <NavItem key={link.href} {...link} />
                        ))}
                        {isAdmin && <NavItem href="/admin" icon={FaCrown} label="Admin Panel" isAdmin={true} />}
                        
                        {/* Settings and Logout */}
                        {currentUser && (
                            <>
                                <NavItem href="/settings/profile" icon={FiSettings} label="Settings" />
                                <motion.button 
                                    onClick={logout} 
                                    className="flex items-center space-x-3 p-3 text-red-400 hover:text-red-500 rounded-full transition duration-200 hover:bg-gc-card/50"
                                >
                                    <FiLogOut className="w-6 h-6" />
                                    <span className="text-xl hidden xl:inline">Logout</span>
                                </motion.button>
                                
                                {/* Desktop Post Button (X-Style) */}
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    className="mt-4 w-full xl:w-5/6 py-3 bg-gc-primary text-white font-bold rounded-full shadow-gc-glow"
                                    onClick={() => {/* Open Post Modal Logic */}}
                                >
                                    <span className='hidden xl:inline'>Post</span>
                                    <FaFeatherAlt className="w-6 h-6 xl:hidden" />
                                </motion.button>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
