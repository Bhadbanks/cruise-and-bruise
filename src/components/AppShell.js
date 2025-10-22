// src/components/AppShell.js
import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/AuthContext';
import GlobalLoading from './GlobalLoading';
import Header from './Header';
import RightColumn from './RightColumn'; // We'll keep this separate
import Footer from './Footer';

const authRoutes = ['/login', '/register', '/gc-join'];

const AppShell = ({ children }) => {
    const { currentUser, userProfile, loading, isAdmin } = useAuth();
    const router = useRouter();
    const isAuthRoute = authRoutes.includes(router.pathname);
    
    // --- 1. Initial Loading State (Show centered global loader) ---
    if (loading) {
        return <GlobalLoading />;
    }
    
    // --- 2. Auth Protection Logic ---
    // If not logged in and on a protected page (excluding /), redirect.
    if (!currentUser && !isAuthRoute && router.pathname !== '/') {
        router.push('/login');
        return <GlobalLoading />;
    }

    // --- 3. Full Page Layout (Login/Register/404) ---
    if (isAuthRoute || router.pathname === '/404') {
        return <>{children}</>;
    }

    // --- 4. Main App Layout (Twitter/X 3-Column Style) ---
    return (
        <div className="min-h-screen bg-gc-vibe">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[200px_1fr_300px] xl:grid-cols-[250px_1fr_350px] gap-0">
                
                {/* 1. Left Column (Navigation - Fixed and sticky on desktop) */}
                <div className="hidden lg:block border-r border-gc-border/50">
                    <div className="sticky top-0 h-screen overflow-y-auto custom-scrollbar">
                        <Header /> 
                    </div>
                </div>
                
                {/* 2. Center Column (Main Content - Feed, Profile, Chat) */}
                <div className="col-span-1 border-x border-gc-border/50">
                    <header className="lg:hidden">
                        <Header /> {/* Mobile Header for Navigation */}
                    </header>
                    <main className="min-h-[90vh] pb-20">
                        {children}
                    </main>
                </div>

                {/* 3. Right Column (Widgets - Fixed and sticky on desktop) */}
                <div className="hidden lg:block border-l border-gc-border/50">
                    <div className="sticky top-0 h-screen overflow-y-auto custom-scrollbar p-4">
                        <RightColumn />
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default AppShell;
