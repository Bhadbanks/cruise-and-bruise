// src/components/AppShell.js
import { useAuth } from '../utils/AuthContext';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import GlobalLoading from './GlobalLoading'; // Import the loading spinner
import dynamic from 'next/dynamic';

// Define pages that do NOT need the full social app shell (Header/Footer/Sidebar)
const NO_LAYOUT_PATHS = ['/login', '/register'];

// Component for the fixed Right Column (Dynamically imported for optimization)
const RightColumn = dynamic(() => import('./RightColumn'), { ssr: false });

const AppShell = ({ Component, pageProps }) => {
    const { currentUser, userProfile, isAdmin } = useAuth();
    const router = useRouter();
    const needsFullLayout = !NO_LAYOUT_PATHS.includes(router.pathname);

    // This component runs on the client. We assume useAuth handles the initial loading state correctly.
    
    // Quick initial check (if userProfile is null but currentUser is true, we are still loading profile)
    if (currentUser && !userProfile) {
        return <GlobalLoading />;
    }

    // 1. Redirect unauthenticated users
    if (!currentUser) {
        if (router.pathname !== '/login' && router.pathname !== '/register') {
             router.replace('/login');
             return null;
        }
    }
    
    // 2. Redirect Admin to admin dashboard (if not already there)
    if (isAdmin && router.pathname !== '/admin') {
         router.replace('/admin');
         return null;
    }
    
    // 3. Redirect if GC not joined (The most robust check)
    if (currentUser && userProfile && !userProfile.hasJoinedGC && router.pathname !== '/gc-join') {
        router.replace('/gc-join');
        return null;
    }


    // Auth pages and GC Join page render without the shell
    if (!needsFullLayout || router.pathname === '/gc-join') {
        return (
            <motion.div
                key={router.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="min-h-screen bg-gc-vibe"
            >
                <Component {...pageProps} />
            </motion.div>
        );
    }
    
    // All other pages get the full social app layout
    return (
        <div className="min-h-screen relative bg-gc-vibe text-white">
            <Header />

            {/* Main Content Wrapper: Provides padding for fixed header on top, and layout for sidebars */}
            <div className="pt-16 lg:pt-0 min-h-screen"> 
                 <div className="flex justify-center max-w-7xl mx-auto">
                    
                    {/* Left Sidebar Spacer (Fixed Left column content is handled inside Header.js) */}
                    <div className="hidden lg:block lg:w-60"></div> 
                    
                    {/* Center Content Column (The main feed) */}
                    <main className="w-full lg:w-[600px] xl:w-[700px] relative z-10 min-h-[90vh] px-4 pt-4 lg:px-0">
                        <motion.div
                            key={router.pathname}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Component {...pageProps} />
                        </motion.div>
                    </main>

                    {/* Right Column (Widgets) */}
                    <div className="hidden xl:block xl:w-[350px] p-4 sticky top-0 h-screen overflow-y-auto pt-16">
                        <RightColumn />
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default AppShell;
