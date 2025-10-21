import Head from 'next/head';
import Header from '../components/Header';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/router';
import CreatePost from '../components/CreatePost';
import UnifiedFeed from '../components/UnifiedFeed';
// Import the Particles component for the premium feature, assuming installation:
// npm install @tsparticles/react @tsparticles/slim
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import Particles to prevent server-side rendering issues
const ParticlesContainer = dynamic(() => import('../components/ParticlesContainer'), { ssr: false });

const Home = () => {
    const { currentUser, loading, userProfile } = useAuth();
    const router = useRouter();

    // Redirect unauthenticated users to login
    if (!loading && !currentUser) {
        router.push('/login');
        return null;
    }

    // Admin redirect
    if (!loading && userProfile?.isAdmin) {
        router.push('/admin');
        return null;
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white bg-gc-vibe">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-t-4 border-gc-primary border-t-transparent rounded-full"
            ></motion.div>
        </div>;
    }

    return (
        <div className="min-h-screen relative">
            <Head><title>Feed | Special Squad</title></Head>
            
            {/* Premium Particles Background (Hidden on mobile) */}
            <div className="absolute inset-0 z-0 hidden md:block">
                 {/* Only render if the user is verified/premium (e.g., isAdmin for demo) */}
                {userProfile?.isVerified && <ParticlesContainer />}
            </div>

            <Header />

            {/* Main content area, offset by the sidebar width (72) */}
            <main className="pl-0 lg:pl-72 py-8 px-4 lg:px-6 relative z-10">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-3xl font-extrabold mb-4 text-white border-b pb-2 border-gray-700">
                        Unified Squad Feed
                    </h1>
                    
                    <CreatePost />

                    <UnifiedFeed />
                </div>
            </main>
        </div>
    );
};

export default Home;
