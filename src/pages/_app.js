// src/pages/_app.js (Modification)

// ... (existing imports and functions)

// App Shell Component (Includes Header, Footer, Sidebar for non-auth pages)
const AppShell = ({ Component, pageProps }) => {
    const { currentUser, loading, userProfile, isAdmin } = useAuth();
    const router = useRouter();
    const needsFullLayout = !NO_LAYOUT_PATHS.includes(router.pathname);

    // Show global loading if Auth state is unresolved
    if (loading) {
        return <GlobalLoading />;
    }
    
    // Check 1: Redirect unauthenticated users
    if (!currentUser) {
        if (router.pathname !== '/login' && router.pathname !== '/register') {
             router.push('/login');
             return null;
        }
    }
    
    // Check 2: Redirect Admin to admin dashboard
    if (isAdmin && router.pathname !== '/admin') {
         router.push('/admin');
         return null;
    }
    
    // Check 3: Redirect if GC not joined (The most robust check)
    if (currentUser && userProfile && !userProfile.hasJoinedGC && router.pathname !== '/gc-join') {
        router.push('/gc-join');
        return null;
    }


    // Auth and Login/Register pages render without the shell
    if (!needsFullLayout || router.pathname === '/gc-join') {
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
    // ... (rest of the AppShell component is the same)
}

// ... (rest of MyApp function is the same)
