import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useAuth } from '../utils/AuthContext';
import { getDevWhatsAppLink } from '../utils/helpers';
import { FiHome, FiUsers, FiUser, FiLogOut, FiSend, FiSettings } from 'react-icons/fi';
import { FaWhatsapp, FaCrown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Header = () => {
    const router = useRouter();
    const { currentUser, userProfile, isAdmin, isVerified } = useAuth();
    const gcLink = process.env.NEXT_PUBLIC_GC_WHATSAPP_LINK;
    const devLink = getDevWhatsAppLink();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully!");
            router.push('/login');
        } catch (error) {
            console.error("Logout Error:", error);
            toast.error("Logout failed.");
        }
    };

    // Navigation links for the left sidebar
    const navItems = [
        { name: 'Home', href: '/', icon: FiHome, protected: true },
        { name: 'Members', href: '/members', icon: FiUsers, protected: true },
        ...(currentUser ? [{ name: 'My Profile', href: `/profile/${userProfile?.username || currentUser.uid}`, icon: FiUser, protected: true }] : []),
        ...(isAdmin ? [{ name: 'Admin Panel', href: '/admin', icon: FaCrown, protected: true }] : []),
    ];

    const LinkButton = ({ item }) => (
        <Link href={item.href} legacyBehavior>
            <motion.a 
                whileHover={{ scale: 1.05 }} 
                className={`flex items-center space-x-3 p-3 rounded-full transition duration-200 ${router.pathname === item.href ? 'bg-gc-primary text-white' : 'hover:bg-gray-700'}`}
            >
                <item.icon className="w-5 h-5" />
                <span className="font-semibold">{item.name}</span>
            </motion.a>
        </Link>
    );


    return (
        <header className="fixed top-0 left-0 h-full w-72 p-6 border-r border-gray-700 bg-gray-800 flex flex-col justify-between z-20">
            <div className="space-y-6">
                {/* Logo and Group Name */}
                <Link href="/" legacyBehavior>
                    <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-extrabold text-gc-primary flex items-center cursor-pointer mb-8"
                    >
                        <FaCrown className="w-6 h-6 mr-2 animate-pulse" />
                        {process.env.NEXT_PUBLIC_GC_NAME.split(' ')[0]}
                    </motion.div>
                </Link>

                {/* Main Navigation */}
                <nav className="space-y-2">
                    {navItems.map(item => (
                        <LinkButton key={item.name} item={item} />
                    ))}
                    <LinkButton item={{ name: 'Chat', href: '/chat', icon: FiSend, protected: true }} />
                    <LinkButton item={{ name: 'Settings', href: '/settings', icon: FiSettings, protected: true }} />
                </nav>
            </div>

            {/* User/Auth Section and WhatsApp Buttons */}
            <div className="space-y-4">
                {currentUser ? (
                    <>
                        {/* Profile Card and Logout */}
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-xl shadow-lg border border-gc-primary/50">
                            <div className="flex items-center space-x-3">
                                <img 
                                    src={userProfile?.profilePicUrl || '/default-avatar.png'} 
                                    alt="Profile" 
                                    className="w-10 h-10 rounded-full object-cover" 
                                />
                                <div>
                                    <p className="font-bold flex items-center">
                                        {userProfile?.username}
                                        {isVerified && <FaCrown className="w-4 h-4 ml-1 text-yellow-400" title="Verified Member" />}
                                    </p>
                                    <p className="text-xs text-gray-400">{isAdmin ? 'Admin' : 'Member'}</p>
                                </div>
                            </div>
                            <motion.button 
                                whileHover={{ rotate: 5 }}
                                onClick={handleLogout} 
                                className="text-gray-400 hover:text-gc-primary transition duration-200"
                            >
                                <FiLogOut className="w-5 h-5" title="Logout" />
                            </motion.button>
                        </div>
                        
                        {/* WhatsApp Buttons (External Links) */}
                        <div className="space-y-2">
                            <ExternalLinkButton 
                                href={gcLink} 
                                text="GC WhatsApp Group" 
                                className="bg-green-600 hover:bg-green-700" 
                            />
                            <ExternalLinkButton 
                                href={devLink} 
                                text="Developer Contact (Lowkey)" 
                                className="bg-blue-600 hover:bg-blue-700" 
                            />
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <Link href="/login" legacyBehavior>
                            <motion.a whileHover={{ scale: 1.05 }} className="w-full py-2 px-4 bg-gc-primary text-white font-bold rounded-lg block">
                                Login / Register
                            </motion.a>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

// Reusable component for external link buttons
const ExternalLinkButton = ({ href, text, className }) => (
    <motion.a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        whileHover={{ scale: 1.02 }} 
        className={`flex items-center justify-center space-x-2 py-2 rounded-lg font-semibold transition duration-300 ${className}`}
    >
        <FaWhatsapp className="w-5 h-5" />
        <span>{text}</span>
    </motion.a>
);

export default Header;
