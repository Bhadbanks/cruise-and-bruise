// src/components/AppShell.js
import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/AuthContext';
import GlobalLoading from './GlobalLoading';
import Header from './Header';
import Footer from './Footer';
import RightColumn from './RightColumn';

const protectedRoutes = ['/', '/members', '/chat', '/admin', '/settings'];
const authRoutes = ['/login', '/register', '/gc-join'];

const AppShell = ({ children }) => {
    const { currentUser, userProfile, loading, isAdmin } = useAuth();
    const router = useRouter();
    const isProtected = protectedRoutes.some(route => router.pathname.startsWith(route) && route !== '/');
    const isAuthRoute = authRoutes.includes(router.pathname);
    const isHomePage = router.pathname === '/';
    
    // --- 1. Initial Loading State ---
    if (loading) {
        return <GlobalLoading />;
    }

    // --- 2. Auth Protection Logic ---
    if (isProtected && !currentUser) {
        // Allow unauthenticated users to see a PUBLIC version of the feed/homepage
        if (isHomePage) {
            // No redirect, allow rendering with limited features
        } else {
            router.push('/login');
            return <GlobalLoading />; 
        }
    }
    
    // --- 3. Profile Setup Enforcement ---
    if (currentUser && !userProfile && router.pathname !== '/gc-join') {
        router.push('/gc-join');
        return <GlobalLoading />;
    }
    
    // --- 4. Post-Login Redirection (FIXED) ---
    if (currentUser && userProfile && isAuthRoute && router.pathname !== '/gc-join') {
        router.push('/');
        return <GlobalLoading />;
    }

    // --- 5. Admin Protection ---
    if (router.pathname === '/admin' && !isAdmin) {
        router.push('/');
        return <GlobalLoading />; 
    }

    // --- Render Logic ---
    const isFullPage = isAuthRoute || router.pathname === '/404';

    if (isFullPage) {
        return <>{children}</>;
    }
    
    return (
        <div className="min-h-screen bg-gc-vibe">
            <Header />
            <main className="max-w-6xl mx-auto px-4 pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_300px] gap-6">
                    {/* Left Column (Navigation - Hidden on mobile) */}
                    <div className="hidden lg:block">
                        <div className="sticky top-20">
                            {/* Navigation Links go here (e.g., in Header component) */}
                            <p className="text-gray-500">Navigation...</p>
                        </div>
                    </div>
                    
                    {/* Center Column (Main Content) */}
                    <div className="col-span-1 min-h-[80vh] border-x border-gc-border">
                        {children}
                    </div>

                    {/* Right Column (Widgets - Hidden on small screens) */}
                    <div className="hidden lg:block">
                        <RightColumn />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AppShell;
