// src/pages/index.js (Home Page)
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer'; // New
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/router';
import CreatePost from '../components/CreatePost';
import UnifiedFeed from '../components/UnifiedFeed';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';
import Link from 'next/link';

// Dynamically import Particles to prevent server-side rendering issues
const ParticlesContainer = dynamic(() => import('../components/ParticlesContainer'), { ssr: false });

// WhatsApp Group Link
const GC_LINK = "https://chat.whatsapp.com/Ll3R7OUbdjq3HsehVpskpz";

const Home = () => {
    const { currentUser, loading, userProfile, isAdmin, shouldRedirectToGC, GC_LINK: whatsappGC } = useAuth();
    const router = useRouter();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white bg-gc-vibe">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-t-4 border-gc-primary border-t-transparent rounded-full"
            ></motion.div>
        </div>;
    }
    
    // 1. Redirect unauthenticated users
    if (!currentUser) {
        router.push('/login');
        return null;
    }

    // 2. Admin redirect
    if (isAdmin) {
        router.push('/admin');
        return null;
    }
    
    // 3. GC Join Check (CRITICAL FIX)
    if (userProfile && !userProfile.hasJoinedGC) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl border-2 border-gc-primary"
                >
                    <FiAlertTriangle className="w-12 h-12 text-gc-primary mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-4 text-center">
                        Mandatory Group Join
                    </h1>
                    <p className="text-gray-400 mb-6 text-center">
                        You must join the 👑✨💥 **𝕊𝕡𝕖𝕔𝕚𝕒𝕝 𝕊𝕢𝕦𝕒𝕕** 💥✨👑ᵀʰᵉ ᵁˡᵗᶦᵐᵃᵗᵘᵐ WhatsApp group to access the main feed.
                    </p>
                    <Link href={whatsappGC} legacyBehavior>
                        <motion.a 
                            target="_blank"
                            onClick={() => {
                                // Assume joining, so update flag locally for immediate redirect
                                userProfile.hasJoinedGC = true; 
                                setTimeout(() => router.reload(), 1000); // Reload after 1s
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="block w-full text-center py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300"
                        >
                            Join WhatsApp Group Now
                        </motion.a>
                    </Link>
                </motion.div>
            </div>
        );
    }
    
    // Normal Feed View
    return (
        <div className="min-h-screen relative">
            <Head><title>Feed | Special Squad</title></Head>
            
            {/* Premium Particles Background */}
            <div className="absolute inset-0 z-0 hidden md:block opacity-30">
                {userProfile?.isVerified && <ParticlesContainer />}
            </div>

            <Header />

            {/* Main Content Area: Responsive Layout (Feed centered, right sidebar hidden on mobile) */}
            <div className="flex justify-center pt-16 lg:pt-20">
                <main className="w-full max-w-7xl relative z-10 flex">
                    {/* Left/Middle Column (Feed and Create Post) */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full lg:w-[600px] xl:w-[700px] border-x border-gray-700 mx-auto lg:mx-0"
                    >
                        <div className="p-4 space-y-6">
                            <h1 className="text-2xl font-extrabold text-white border-b pb-2 border-gray-700 sticky top-0 bg-gc-vibe/90 backdrop-blur-sm z-20">
                                Unified Squad Feed
                            </h1>
                            <CreatePost />
                            <UnifiedFeed />
                        </div>
                    </motion.div>

                    {/* Right Column (Placeholder for Trending/Widgets - Hidden on small screens) */}
                    <div className="hidden xl:block xl:w-[350px] p-4 sticky top-20 h-screen">
                         <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
                            <h2 className="text-xl font-bold text-white mb-4">Trending</h2>
                            <p className="text-gray-400">#TheUltimatum</p>
                            <p className="text-gray-400">#GcVibeCheck</p>
                        </div>
                    </div>
                </main>
            </div>
            
            <Footer />
        </div>
    );
};

export default Home;
