// src/pages/_app.js (The new App Shell/Layout)
import Head from 'next/head';
import { AuthProvider, useAuth } from '../utils/AuthContext';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

// Define paths that do NOT need the full social app shell (Header/Footer/Sidebar)
const NO_LAYOUT_PATHS = ['/login', '/register'];

// Global Loading Spinner Component
const GlobalLoading = () => (
    <div className="min-h-screen flex items-center justify-center text-white bg-gc-vibe">
        <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-t-4 border-gc-primary border-t-transparent rounded-full"
        ></motion.div>
    </div>
);

// App Shell Component (Includes Header, Footer, Sidebar for non-auth pages)
const AppShell = ({ Component, pageProps }) => {
    const { currentUser, loading, userProfile, isAdmin } = useAuth();
    const router = useRouter();
    const needsFullLayout = !NO_LAYOUT_PATHS.includes(router.pathname);

    // Show global loading if Auth state is unresolved
    if (loading) {
        return <GlobalLoading />;
    }

    // Auth and Login/Register pages render without the shell
    if (!currentUser || !needsFullLayout) {
        return (
            <motion.div
                key={router.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Component {...pageProps} />
            </motion.div>
        );
    }
    
    // All other pages get the full social app layout
    return (
        <div className="min-h-screen relative">
            <Header />

            {/* Main Content Area: Mimicking Twitter/X structure */}
            <div className="flex justify-center pt-16 lg:pt-0">
                
                {/* Fixed Left Sidebar (Desktop Only) */}
                <div className="hidden lg:block lg:w-60">
                    {/* Header handles the positioning of the fixed sidebar content */}
                </div>

                {/* Center Content Column */}
                <main className="w-full lg:w-[600px] xl:w-[700px] relative z-10 min-h-[80vh]">
                     <motion.div
                        key={router.pathname}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Component {...pageProps} />
                    </motion.div>
                </main>

                {/* Right Column (Widgets - Hidden on small screens) */}
                <div className="hidden xl:block xl:w-[350px] p-4 sticky top-16 h-screen">
                    <div className="p-4 rounded-xl shadow-lg border border-gray-700 mt-4 bg-gray-800/80 backdrop-blur-sm">
                        <h2 className="text-xl font-bold text-white mb-4">Trending Now</h2>
                        <p className="text-gray-400 hover:text-gc-primary transition duration-200 cursor-pointer">#TheUltimatum</p>
                        <p className="text-gray-400 hover:text-gc-primary transition duration-200 cursor-pointer">#GcVibeCheck</p>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}


function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Head>
                <title>Special Squad - The Ultimatum</title>
                <link rel="icon" href="/logo.png" />
            </Head>
            <AppShell Component={Component} pageProps={pageProps} />
            <Toaster 
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#333',
                        color: '#fff',
                        border: '1px solid #E91E63',
                    }
                }}
            />
        </AuthProvider>
    );
}

export default MyApp;
