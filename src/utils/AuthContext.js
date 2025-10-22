// src/utils/AuthContext.js (in src/utils folder)
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from './firebase';
import { 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// ⚠️ CRITICAL: Replace this with the actual UID of your *first* admin registration
// Find this UID in your Firebase console after you register admin@SpecialSquad.com
const ADMIN_UID = "PLACEHOLDER_ADMIN_UID"; 

// Developer WhatsApp link for support
const DEVELOPER_WHATSAPP = "https://wa.me/YOUR_WHATSAPP_NUMBER"; 

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Check if the current user is an admin
    const isAdmin = userProfile?.uid === ADMIN_UID;
    
    // --- 1. Real-time Auth State Listener ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            
            if (user) {
                // Fetch User Profile
                const profileRef = doc(db, 'users', user.uid);
                const profileSnap = await getDoc(profileRef);
                
                if (profileSnap.exists()) {
                    const profileData = { ...profileSnap.data(), uid: user.uid };
                    setUserProfile(profileData);
                    
                    // CRITICAL REDIRECTION LOGIC 1: Authenticated user on Auth page -> Home
                    if (router.pathname === '/login' || router.pathname === '/register') {
                        router.push('/');
                    }
                    
                } else {
                    // CRITICAL REDIRECTION LOGIC 2: User exists but profile doesn't -> GC-Join/Profile Setup
                    setUserProfile(null);
                    if (router.pathname !== '/gc-join') {
                        router.push('/gc-join');
                    }
                }
            } else {
                setUserProfile(null);
                // CRITICAL REDIRECTION LOGIC 3: Unauthenticated user on protected page -> Login
                if (
                    router.pathname !== '/login' && 
                    router.pathname !== '/register' && 
                    router.pathname !== '/404'
                ) {
                    // router.push('/login'); // We disable this here to allow public view of the home feed
                }
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [router.pathname]);

    // --- 2. Auth Functions ---
    const register = async (email, password, userData) => {
        // Simple check for username uniqueness before creation
        const existingUsernameSnap = await getDoc(doc(db, 'usernames', userData.username.toLowerCase()));
        if (existingUsernameSnap.exists()) {
            throw new Error("Username already taken. Please choose another.");
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Initial user profile setup (will be completed on /gc-join)
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            username: userData.username,
            // ... all the other requested fields
            ...userData,
            isVerified: false,
            isAdmin: user.uid === ADMIN_UID,
            createdAt: new Date(),
            followersCount: 0,
            followingCount: 0,
            profilePicUrl: null,
            coverImageUrl: null,
        });
        
        // Reserve the username globally
        await setDoc(doc(db, 'usernames', userData.username.toLowerCase()), { uid: user.uid });
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        await signOut(auth);
        toast.success("Logged out successfully!");
        router.push('/login');
    };

    // --- 3. Profile Update Function (for settings page) ---
    const updateProfileData = async (newProfileData) => {
        if (!currentUser) throw new Error("User not logged in.");
        
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, newProfileData);
        
        // Update local state
        setUserProfile(prev => ({ ...prev, ...newProfileData }));
    };

    const value = {
        currentUser,
        userProfile,
        loading,
        isAdmin,
        DEVELOPER_WHATSAPP,
        register,
        login,
        logout,
        updateProfileData,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
