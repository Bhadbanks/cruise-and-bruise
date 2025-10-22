// src/components/Header.js
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHome, FiUsers, FiMessageCircle, FiFeather, FiLogOut, FiLogIn, FiUser, FiSettings } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';
import { useAuth } from '../utils/AuthContext';
import GlobalLoading from './GlobalLoading';

const NavItem = ({ href, icon: Icon, label, isAdmin }) => {
    const router = useRouter();
    const isActive = router.pathname === href;
    const isHome = href === '/' && router.pathname === '/';
    const activeClass = isActive ? 'text-gc-primary font-bold' : 'text-gray-400 hover:text-gc-secondary';
    const baseClass = "flex items-center space-x-3 p-3 rounded-full transition duration-200 hover:bg-gc-card/50";
    
    return (
        <Link href={href} legacyBehavior>
            <motion.a 
                whileHover={{ scale: 1.05 }}
                className={`${baseClass} ${activeClass} ${isAdmin ? 'text-gc-admin' : ''}`}
            >
                <Icon className={`w-6 h-6 ${isAdmin ? 'text-gc-admin' : ''}`} />
                <span className="text-lg">{label}</span>
            </motion.a>
        </Link>
    );
};

const Header = () => {
    const { currentUser, userProfile, logout, isAdmin, loading } = useAuth();

    if (loading) return null; // Prevent flicker on initial load

    const navLinks = [
        { href: '/', icon: FiHome, label: 'Feed' },
        { href: '/members', icon: FiUsers, label: 'Members' },
        { href: '/chat', icon: FiMessageCircle, label: 'Chat Hub' },
        { href: `/profile/${userProfile?.username || 'me'}`, icon: FiUser, label: 'Profile' },
    ];
    
    return (
        <header className="sticky top-0 z-40 bg-gc-vibe/95 backdrop-blur-sm border-b border-gc-border shadow-lg">
            <div className="max-w-6xl mx-auto flex items-center justify-between p-3">
                {/* Logo & Brand */}
                <Link href="/" legacyBehavior>
    <motion.a 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="flex items-center space-x-2 text-white font-extrabold text-2xl"
    >
        <img 
            src="/logo.png" 
            alt="Squad Logo" 
            // ⚠️ CRITICAL FIX: Ensure the logo size is strictly defined
            className="w-8 h-8 object-contain" // Use object-contain to prevent stretching
        /> 
        <span className="hidden sm:block text-gc-primary">SquadVibe</span>
    </motion.a>
</Link>

                {/* Desktop Navigation (Center) - Only visible when logged in */}
                {currentUser && (
                    <nav className="hidden lg:flex items-center space-x-2">
                        {navLinks.map(link => (
                            <NavItem key={link.href} {...link} />
                        ))}
                        {isAdmin && <NavItem href="/admin" icon={FaCrown} label="Admin" isAdmin={true} />}
                    </nav>
                )}
                
                {/* Actions (Right) */}
                <div className="flex items-center space-x-4">
                    {currentUser ? (
                        <>
                            {/* Mobile Post Button */}
                            <Link href="/" legacyBehavior>
                                <motion.a 
                                    whileHover={{ scale: 1.1 }}
                                    className="lg:hidden p-3 bg-gc-primary text-white rounded-full shadow-gc-glow-primary"
                                >
                                    <FiFeather className="w-6 h-6" />
                                </motion.a>
                            </Link>

                            {/* Settings/Logout */}
                            <Link href="/settings/profile" legacyBehavior>
                                <motion.a whileHover={{ scale: 1.1 }} className="p-3 text-gray-400 hover:text-gc-secondary transition">
                                    <FiSettings className="w-6 h-6" />
                                </motion.a>
                            </Link>
                            <motion.button 
                                onClick={logout} 
                                whileHover={{ scale: 1.1 }}
                                className="p-3 text-gray-400 hover:text-red-500 transition"
                            >
                                <FiLogOut className="w-6 h-6" />
                            </motion.button>
                        </>
                    ) : (
                        <Link href="/login" legacyBehavior>
                            <motion.a 
                                whileHover={{ scale: 1.05 }} 
                                className="px-5 py-2 bg-gc-primary text-white font-bold rounded-full shadow-gc-glow-primary flex items-center space-x-2"
                            >
                                <FiLogIn />
                                <span>Login</span>
                            </motion.a>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
