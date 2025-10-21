// src/components/Header.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/AuthContext';
import { motion } from 'framer-motion';
import { FiHome, FiMessageCircle, FiUsers, FiLogOut, FiMenu, FiX, FiSettings, FiFeather } from 'react-icons/fi';
import { FaCrown, FaCheckCircle, FaWhatsapp } from 'react-icons/fa'; // Correct icons
import { useState } from 'react';
import toast from 'react-hot-toast';

const navItems = [
    { name: 'Feed', icon: FiHome, path: '/' },
    { name: 'Members', icon: FiUsers, path: '/members' },
    { name: 'Chat Hub', icon: FiMessageCircle, path: '/chat' },
];

const Header = () => {
    const { currentUser, userProfile, logout, isAdmin, DEVELOPER_WHATSAPP } = useAuth();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };
    
    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    if (!currentUser) return null; // Only show header if authenticated

    const isActive = (path) => router.pathname === path;
    const isProfilePage = router.pathname.startsWith('/profile');

    // Utility Component for Badges
    const UserBadges = () => (
        <>
            {userProfile?.isAdmin && <FaCrown className="w-4 h-4 text-gc-admin" title="Admin" />}
            {userProfile?.isVerified && !userProfile?.isAdmin && <FaCheckCircle className="w-4 h-4 text-gc-verified" title="Verified" />}
        </>
    );

    return (
        <>
            {/* Desktop and Mobile Header (Top Bar - FIXED) */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-gc-vibe/90 backdrop-blur-sm border-b border-gc-border shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4">
                    {/* Logo & Title */}
                    <Link href="/" legacyBehavior>
                        <a className="flex items-center space-x-2">
                            <motion.img 
                                src="/logo.png" 
                                alt="Special Squad Logo" 
                                className="w-8 h-8 object-contain" 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                            />
                            <span className="text-xl font-extrabold text-gc-primary hidden sm:block">Special Squad</span>
                        </a>
                    </Link>

                    {/* Desktop Menu (Middle Bar) */}
                    <nav className="hidden lg:flex space-x-6">
                        {navItems.map(item => (
                            <Link key={item.name} href={item.path} legacyBehavior>
                                <motion.a 
                                    whileHover={{ scale: 1.05 }}
                                    className={`flex items-center space-x-2 py-2 px-3 rounded-full text-sm font-medium transition duration-200 ${
                                        isActive(item.path) || (isProfilePage && item.name === 'Feed')
                                        ? 'bg-gc-primary text-white shadow-gc-glow' 
                                        : 'text-gray-400 hover:bg-gc-card hover:text-white'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </motion.a>
                            </Link>
                        ))}
                    </nav>

                    {/* Profile & Mobile Menu Button */}
                    <div className="flex items-center space-x-4">
                        
                        {/* Desktop Profile Button */}
                        <motion.div 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                            className="hidden lg:block"
                        >
                            <Link href={`/profile/${userProfile?.username || '#'}`} legacyBehavior>
                                <a className="flex items-center space-x-2 p-1.5 bg-gc-card rounded-full border border-gc-secondary hover:bg-gray-700 transition duration-200 shadow-md">
                                    <img 
                                        src={userProfile?.profilePicUrl || '/default-avatar.png'} 
                                        alt="Avatar" 
                                        className="w-8 h-8 rounded-full object-cover" 
                                    />
                                    <span className="text-white text-sm font-semibold pr-2 hidden xl:block">
                                        @{userProfile?.username || 'user'}
                                    </span>
                                    <UserBadges />
                                </a>
                            </Link>
                        </motion.div>
                        
                        {/* Mobile Menu Button */}
                        <motion.button 
                            onClick={toggleMenu} 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 lg:hidden text-white bg-gc-card rounded-full shadow-lg"
                        >
                            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* Fixed Left Sidebar (Desktop Only) */}
            <motion.div
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:fixed lg:top-0 lg:left-0 lg:w-60 lg:h-screen lg:border-r lg:border-gc-border lg:bg-gc-vibe lg:p-4 lg:flex lg:flex-col z-40 pt-16"
            >
                {/* Profile Card (Simplified for sidebar) */}
                <div className="p-3 bg-gc-card rounded-xl shadow-xl border border-gc-primary/50 mb-6">
                    <Link href={`/profile/${userProfile?.username || '#'}`} legacyBehavior>
                        <a className="flex flex-col items-center space-y-2 group">
                            <img 
                                src={userProfile?.profilePicUrl || '/default-avatar.png'} 
                                alt="Avatar" 
                                className="w-16 h-16 rounded-full object-cover border-2 border-gc-secondary group-hover:border-gc-primary transition duration-300" 
                            />
                            <div className="text-center">
                                <span className="text-white font-bold block flex items-center space-x-1">
                                    <span>@{userProfile?.username || 'user'}</span>
                                    <UserBadges />
                                </span>
                                <span className="text-xs text-gray-400 block">
                                    {isAdmin ? 'Squad Admin' : userProfile?.isVerified ? 'Verified Member' : 'Member'}
                                </span>
                            </div>
                        </a>
                    </Link>
                </div>

                {/* Main Navigation */}
                <nav className="flex flex-col space-y-2 flex-grow">
                    {navItems.map(item => (
                        <Link key={item.name} href={item.path} legacyBehavior>
                            <motion.a 
                                whileHover={{ scale: 1.02 }}
                                className={`flex items-center space-x-3 p-3 rounded-xl font-semibold transition duration-200 ${
                                    isActive(item.path) 
                                    ? 'bg-gc-secondary text-white shadow-lg shadow-gc-secondary/30' 
                                    : 'text-gray-300 hover:bg-gc-card hover:text-white'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </motion.a>
                        </Link>
                    ))}

                    {/* Admin Link */}
                    {isAdmin && (
                        <Link href="/admin" legacyBehavior>
                            <motion.a 
                                whileHover={{ scale: 1.02 }}
                                className={`flex items-center space-x-3 p-3 rounded-xl font-semibold transition duration-200 ${
                                    isActive('/admin') 
                                    ? 'bg-gc-admin/50 text-white shadow-lg shadow-gc-admin/30' 
                                    : 'text-gc-admin hover:bg-gc-card hover:text-gc-admin/80'
                                }`}
                            >
                                <FaCrown className="w-5 h-5" /> 
                                <span>Admin Panel</span>
                            </motion.a>
                        </Link>
                    )}
                </nav>
                
                {/* Footer Actions */}
                <div className="mt-4 border-t border-gc-border pt-4 space-y-2">
                    {/* Developer Contact Button */}
                    <motion.a
                        href={`https://${DEVELOPER_WHATSAPP}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center space-x-2 p-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition duration-200"
                    >
                        <FaWhatsapp className="w-5 h-5" />
                        <span>Developer Contact</span>
                    </motion.a>

                    {/* Logout Button */}
                    <motion.button
                        onClick={handleLogout}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center space-x-3 p-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition duration-200"
                    >
                        <FiLogOut className="w-5 h-5" />
                        <span>Log Out</span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Mobile Off-Canvas Menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-16 right-0 w-64 h-[calc(100vh-64px)] bg-gc-card border-l border-gc-border p-4 z-40 lg:hidden flex flex-col space-y-4 shadow-2xl"
                >
                    {[
                        ...navItems, 
                        { name: 'My Profile', icon: FiSettings, path: `/profile/${userProfile?.username || 'user'}` },
                        ...(isAdmin ? [{ name: 'Admin Panel', icon: FaCrown, path: '/admin' }] : []),
                    ].map(item => (
                        <Link key={item.name} href={item.path} legacyBehavior>
                            <motion.a 
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center space-x-3 p-3 rounded-xl font-semibold transition duration-200 ${
                                    (isActive(item.path) || (isProfilePage && item.name === 'My Profile'))
                                    ? 'bg-gc-secondary text-white' 
                                    : 'text-gray-300 hover:bg-gc-vibe hover:text-white'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </motion.a>
                        </Link>
                    ))}
                    <motion.a
                        href={`https://${DEVELOPER_WHATSAPP}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center space-x-2 p-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition duration-200 mt-auto"
                    >
                        <FaWhatsapp className="w-5 h-5" />
                        <span>Dev Contact</span>
                    </motion.a>
                    <motion.button
                        onClick={handleLogout}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center space-x-3 p-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition duration-200"
                    >
                        <FiLogOut className="w-5 h-5" />
                        <span>Log Out</span>
                    </motion.button>
                </motion.div>
            )}
        </>
    );
};

export default Header;
