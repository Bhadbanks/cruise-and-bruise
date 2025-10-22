// src/components/AppShell.js
import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/AuthContext';
import GlobalLoading from './GlobalLoading';
import Header from './Header';
import RightColumn from './RightColumn'; 
import Footer from './Footer';

const authRoutes = ['/login', '/register', '/splash'];

const AppShell = ({ children }) => {
    const { currentUser, userProfile, loading } = useAuth();
    const router = useRouter();
    const isAuthRoute = authRoutes.includes(router.pathname);
    
    // --- 1. Initial Loading State ---
    if (loading) {
        return <GlobalLoading />;
    }
    
    // --- 2. Auth Protection & Profile Check ---
    if (!currentUser && !isAuthRoute) {
        router.push('/splash'); 
        return <GlobalLoading />;
    }
    
    // CRITICAL: Mandatory Profile/GC Setup Check
    const isProfileIncomplete = currentUser && userProfile && !userProfile.bio;
    if (isProfileIncomplete && router.pathname !== '/gc-join') {
        router.push('/gc-join');
        return <GlobalLoading />;
    }

    // --- 3. Full Page Layout (Auth/Setup Pages) ---
    if (isAuthRoute || router.pathname === '/gc-join' || router.pathname === '/404') {
        return <>{children}</>;
    }

    // --- 4. Main App Layout (Twitter/X 3-Column Style) ---
    return (
        <div className="min-h-screen bg-gc-vibe">
            {/* Main Grid Container: 3 fixed columns on large screens */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[200px_1fr_300px] xl:grid-cols-[250px_1fr_350px] gap-0">
                
                {/* 1. Left Column (Navigation - Fixed and sticky) */}
                <div className="hidden lg:block border-r border-gc-border/50">
                    <div className="sticky top-0 h-screen overflow-y-auto custom-scrollbar">
                        <Header /> 
                    </div>
                </div>
                
                {/* 2. Center Column (Main Content) */}
                <div className="col-span-1 border-x border-gc-border/50">
                    <header className="lg:hidden">
                        <Header /> {/* Mobile Header for Navigation */}
                    </header>
                    <main className="min-h-[90vh] pb-20">
                        {children}
                    </main>
                </div>

                {/* 3. Right Column (Widgets - Fixed and sticky) */}
                <div className="hidden lg:block border-l border-gc-border/50">
                    <div className="sticky top-0 h-screen overflow-y-auto custom-scrollbar p-4">
                        <RightColumn />
                    </div>
                </div>
            </div>
            
            {/* Footer is outside the grid to span full width below the columns */}
            <Footer />
        </div>
    );
};

export default AppShell;
