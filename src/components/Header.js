// src/components/Header.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/AuthContext';
import { motion } from 'framer-motion';
import { FiHome, FiMessageCircle, FiUsers, FiLogOut, FiMenu, FiX, FiCrown, FiSettings } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';
import { useState } from 'react';
import toast from 'react-hot-toast';

const navItems = [
    { name: 'Feed', icon: FiHome, path: '/' },
    { name: 'Members', icon: FiUsers, path: '/members' },
    { name: 'Chat Hub', icon: FiMessageCircle, path: '/chat' },
];

const Header = () => {
    const { currentUser, userProfile, logout, isAdmin } = useAuth();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };
    
    // Toggle function for mobile menu
    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    if (!currentUser) return null;

    // Use current path to determine active link
    const isActive = (path) => router.pathname === path;

    return (
        <>
            {/* Desktop and Mobile Header (Top Bar) */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
                <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4">
                    {/* Logo & Title (Fixed size) */}
                    <Link href="/" legacyBehavior>
                        <a className="flex items-center space-x-2">
                            <img src="/logo.png" alt="Special Squad Logo" className="w-8 h-8 object-contain" />
                            <span className="text-xl font-extrabold text-gc-primary hidden sm:block">Special Squad</span>
                        </a>
                    </Link>

                    {/* Desktop Menu (Hidden on Mobile) */}
                    <nav className="hidden lg:flex space-x-6">
                        {navItems.map(item => (
                            <Link key={item.name} href={item.path} legacyBehavior>
                                <a className={`flex items-center space-x-2 py-2 px-3 rounded-full text-sm font-medium transition duration-200 ${
                                    isActive(item.path) 
                                    ? 'bg-gc-primary text-white shadow-md shadow-gc-primary/50' 
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}>
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </a>
                            </Link>
                        ))}
                    </nav>

                    {/* Profile Button (Desktop) / Menu Button (Mobile) */}
                    <div className="flex items-center space-x-4">
                        {/* Profile Button */}
                        <motion.div 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                            className="hidden lg:block"
                        >
                            <Link href={`/profile/${userProfile?.username || '#'}`} legacyBehavior>
                                <a className="flex items-center space-x-2 p-1.5 bg-gray-800 rounded-full border border-gc-secondary hover:bg-gray-700 transition duration-200">
                                    <img 
                                        src={userProfile?.profilePicUrl || '/default-avatar.png'} 
                                        alt="Avatar" 
                                        className="w-8 h-8 rounded-full object-cover" 
                                    />
                                    <span className="text-white text-sm font-semibold pr-2 hidden xl:block">
                                        @{userProfile?.username || 'user'}
                                    </span>
                                    {userProfile?.isAdmin && <FaCrown className="w-4 h-4 text-yellow-400 mr-2" />}
                                </a>
                            </Link>
                        </motion.div>
                        
                        {/* Mobile Menu Button */}
                        <motion.button 
                            onClick={toggleMenu} 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 lg:hidden text-white bg-gray-700 rounded-full"
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
                className="hidden lg:fixed lg:top-16 lg:left-0 lg:w-60 lg:h-[calc(100vh-64px)] lg:border-r lg:border-gray-700 lg:bg-gray-900 lg:p-4 lg:flex lg:flex-col z-40"
            >
                {/* Profile Card */}
                <div className="p-3 bg-gray-800 rounded-xl shadow-lg border border-gray-700 mb-6">
                    <Link href={`/profile/${userProfile?.username || '#'}`} legacyBehavior>
                        <a className="flex flex-col items-center space-y-2">
                            <img 
                                src={userProfile?.profilePicUrl || '/default-avatar.png'} 
                                alt="Avatar" 
                                className="w-16 h-16 rounded-full object-cover border-2 border-gc-primary" 
                            />
                            <div className="text-center">
                                <span className="text-white font-bold block">@{userProfile?.username}</span>
                                <span className="text-xs text-gray-400 block">
                                    {userProfile?.isAdmin ? 'Squad Admin' : userProfile?.isVerified ? 'Verified Member' : 'Member'}
                                </span>
                            </div>
                        </a>
                    </Link>
                </div>

                {/* Main Navigation */}
                <nav className="flex flex-col space-y-2 flex-grow">
                    {navItems.map(item => (
                        <Link key={item.name} href={item.path} legacyBehavior>
                            <a className={`flex items-center space-x-3 p-3 rounded-xl font-semibold transition duration-200 ${
                                isActive(item.path) 
                                ? 'bg-gc-secondary text-white shadow-lg shadow-gc-secondary/30' 
                                : 'text-gray-300 hover:bg-gray-700/70 hover:text-white'
                            }`}>
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </a>
                        </Link>
                    ))}

                    {/* Admin Link */}
                    {isAdmin && (
                        <Link href="/admin" legacyBehavior>
                            <a className={`flex items-center space-x-3 p-3 rounded-xl font-semibold transition duration-200 ${
                                isActive('/admin') 
                                ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-600/30' 
                                : 'text-yellow-400 hover:bg-gray-700/70 hover:text-yellow-300'
                            }`}>
                                <FiCrown className="w-5 h-5" />
                                <span>Admin Panel</span>
                            </a>
                        </Link>
                    )}
                </nav>
                
                {/* Footer Actions */}
                <div className="mt-4 border-t border-gray-700 pt-4">
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
                    className="fixed top-16 right-0 w-64 h-[calc(100vh-64px)] bg-gray-900 border-l border-gray-700 p-4 z-40 lg:hidden flex flex-col space-y-4"
                >
                    {[
                        ...navItems, 
                        { name: 'Profile', icon: FiSettings, path: `/profile/${userProfile?.username}` },
                        ...(isAdmin ? [{ name: 'Admin Panel', icon: FiCrown, path: '/admin' }] : []),
                    ].map(item => (
                        <Link key={item.name} href={item.path} legacyBehavior>
                            <a 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center space-x-3 p-3 rounded-xl font-semibold transition duration-200 ${
                                    isActive(item.path) 
                                    ? 'bg-gc-secondary text-white' 
                                    : 'text-gray-300 hover:bg-gray-700/70 hover:text-white'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </a>
                        </Link>
                    ))}
                    <motion.button
                        onClick={handleLogout}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center space-x-3 p-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition duration-200 mt-auto"
                    >
                        <FiLogOut className="w-5 h-5" />
                        <span>Log Out</span>
                    </motion.button>
                </motion.div>
            )}

            {/* Content Spacer for Fixed Header/Sidebar */}
            <div className="h-16 lg:h-0"></div>
            <div className="lg:ml-60"></div>
        </>
    );
};

export default Header;
