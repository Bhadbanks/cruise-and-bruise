// src/pages/_app.js
import Head from 'next/head';
import { AuthProvider } from '../utils/AuthContext';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import GlobalLoading from '../components/GlobalLoading';

// --- The FIX: Dynamic Import for the Shell Component ---
// This prevents the server from prerendering the components that rely on the 'useAuth' hook.
const DynamicAppShell = dynamic(() => import('../components/AppShell'), {
    ssr: false, // <-- CRITICAL: Disable Server-Side Rendering
    loading: () => <GlobalLoading />, // Show the loading spinner while waiting for the client to hydrate
});

// --- CRITICAL FIX: Ensure MyApp is the DEFAULT export ---
function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Head>
                <title>Special Squad - The Ultimatum</title>
                <link rel="icon" href="/logo.png" />
            </Head>
            
            {/* The actual application content, loaded only on the client */}
            <DynamicAppShell Component={Component} pageProps={pageProps} />
            
            <Toaster 
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#1C1525',
                        color: '#fff',
                        border: '1px solid #E91E63',
                    }
                }}
            />
        </AuthProvider>
    );
}

// THIS MUST BE THE DEFAULT EXPORT
export default MyApp;
