import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/AuthContext';
import { auth } from '../utils/firebase';
import { FiHome, FiUsers, FiMessageSquare, FiLogOut, FiCrown, FiUser, FiCode } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { redirectToWhatsApp, contactAdmin } from '../utils/helpers';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Header = () => {
    const { currentUser, userProfile, isAdmin } = useAuth();
    const router = useRouter();
    
    // Developer's name for display
    const developerUsername = "༺𝕷𝖔𝖜𝖐𝖊𝖞 𝕴𝖘 𝕳𝖎𝖒༻";

    const handleLogout = async () => {
        try {
            await auth.signOut();
            toast.success("Logged out successfully!");
            router.push('/login');
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to log out.");
        }
    };

    const navItems = [
        { href: '/', icon: FiHome, label: 'Feed' },
        { href: '/members', icon: FiUsers, label: 'Members' },
        { href: '/chat', icon: FiMessageSquare, label: 'Chat Hub' },
    ];
    
    if (userProfile?.username) {
         navItems.push({ href: `/profile/${userProfile.username}`, icon: FiUser, label: 'My Profile' });
    }
    
    if (isAdmin) {
        navItems.push({ href: '/admin', icon: FiCrown, label: 'Admin Panel', className: 'text-yellow-400 font-bold' });
    }

    const NavLink = ({ href, icon: Icon, label, className = '' }) => {
        const isActive = router.pathname === href || (href.includes('/profile/') && router.pathname.startsWith('/profile/'));
        return (
            <Link href={href} legacyBehavior>
                <motion.a 
                    whileHover={{ scale: 1.05, backgroundColor: '#374151' }}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition duration-200 ${isActive ? 'bg-gc-primary/30 text-gc-primary' : 'hover:bg-gray-700'} ${className}`}
                >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                </motion.a>
            </Link>
        );
    };

    if (!currentUser) {
        return (
            <div className="fixed top-0 left-0 right-0 p-4 bg-gray-900 border-b border-gray-700 flex justify-between items-center z-10">
                <h1 className="text-xl font-bold text-white flex items-center">
                    <img src="/logo.png" alt="Squad Logo" className="w-6 h-6 mr-2" />
                    Special Squad
                </h1>
                <Link href="/login" legacyBehavior><a className="px-4 py-2 bg-gc-primary rounded-full text-white font-semibold">Log In</a></Link>
            </div>
        );
    }

    return (
        <header className="fixed top-0 left-0 w-72 h-full p-6 border-r border-gray-700 bg-gray-900 z-20 hidden lg:flex flex-col">
            <div className="flex flex-col h-full">
                {/* Logo and Profile Summary */}
                <div className="mb-8 border-b pb-4 border-gray-700">
                    <img src="/logo.png" alt="Squad Logo" className="w-10 h-10 mb-3" />
                    <h1 className="text-2xl font-extrabold text-white">Special Squad</h1>
                    <p className="text-sm text-gray-400 mt-1">@{userProfile?.username || 'Guest'}</p>
                </div>
                
                {/* Navigation Links */}
                <nav className="flex-1 space-y-2">
                    {navItems.map(item => <NavLink key={item.href} {...item} />)}
                </nav>

                {/* Footer Actions (WhatsApp & Logout) */}
                <div className="space-y-3 pt-6 border-t border-gray-700">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={contactAdmin}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gc-secondary text-white rounded-xl font-semibold transition duration-200 hover:bg-purple-700 shadow-lg"
                    >
                        <FiCode className="w-5 h-5" />
                        <span>Dev: {developerUsername}</span>
                    </motion.button>
                    
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={redirectToWhatsApp}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold transition duration-200 hover:bg-green-700 shadow-lg"
                    >
                        <FaWhatsapp className="w-5 h-5" />
                        <span>Join Group Chat</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold transition duration-200 hover:bg-red-700 shadow-lg"
                    >
                        <FiLogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </motion.button>
                </div>
            </div>
        </header>
    );
};

export default Header;
