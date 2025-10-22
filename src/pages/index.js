// src/pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/AuthContext';
import GlobalLoading from '../components/GlobalLoading';

const IndexRedirect = () => {
    const router = useRouter();
    const { currentUser, loading, userProfile } = useAuth();
    
    useEffect(() => {
        if (!loading) {
            if (currentUser) {
                // Check for mandatory profile setup
                if (userProfile && !userProfile.bio) {
                    router.replace('/gc-join');
                } else {
                    // Logged in and profile complete: Go to the main feed
                    router.replace('/feed'); 
                }
            } else {
                // Not logged in: Go to the splash page
                router.replace('/splash');
            }
        }
    }, [currentUser, loading, router, userProfile]);

    return <GlobalLoading />;
};

IndexRedirect.displayName = 'index'; 

export default IndexRedirect;
