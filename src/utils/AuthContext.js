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

// ⚠️ REQUIRED: Replace this with the actual UID of your *first* admin registration
const ADMIN_UID = "PLACEHOLDER_ADMIN_UID_REQUIRED"; 

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const isAdmin = userProfile?.uid === ADMIN_UID;
    
    // --- 1. Real-time Auth State Listener (FIXED ROBUSTNESS) ---
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
                    
                    // REDIRECTION FIX: Authenticated user on Auth page -> Home
                    if (router.pathname === '/login' || router.pathname === '/register') {
                        router.push('/');
                    }
                } else {
                    // REDIRECTION FIX: User exists but profile doesn't -> Profile Setup
                    setUserProfile(null);
                    if (router.pathname !== '/gc-join') {
                        router.push('/gc-join');
                    }
                }
            } else {
                setUserProfile(null);
                // Allow public access to / and auth pages
            }
            // CRITICAL FIX: Ensure loading is set to false after the check completes
            setLoading(false);
        });

        return unsubscribe;
    }, [router.pathname]);

    // --- 2. Auth Functions (Integrated Custom Fields) ---
    const register = async (email, password, initialData) => {
        const existingUsernameSnap = await getDoc(doc(db, 'usernames', initialData.username.toLowerCase()));
        if (existingUsernameSnap.exists()) {
            throw new Error("Username already taken. Please choose another.");
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Initial user profile (will be completed on /gc-join)
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            // Custom fields from register form
            username: initialData.username,
            age: initialData.age || '',
            location: initialData.location || '',
            
            // Default/Empty custom fields for later setup
            bio: '',
            sex: '',
            relationshipStatus: '',
            interests: '',
            whatsappNumber: '',
            whatsappConvoLink: '',
            
            // Admin/Verification logic
            isVerified: user.uid === ADMIN_UID,
            isAdmin: user.uid === ADMIN_UID,
            createdAt: new Date(),
            followersCount: 0,
            followingCount: 0,
            profilePicUrl: null,
            coverImageUrl: null,
        });
        
        await setDoc(doc(db, 'usernames', initialData.username.toLowerCase()), { uid: user.uid });
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        await signOut(auth);
        toast.success("Logged out successfully!");
        router.push('/login');
    };
    
    // --- 3. Admin Function: Toggle Verification ---
    const toggleVerification = async (targetUid, status) => {
        if (!isAdmin) throw new Error("Permission denied.");
        
        const userRef = doc(db, 'users', targetUid);
        await updateDoc(userRef, { isVerified: status });
    };


    const value = {
        currentUser,
        userProfile,
        loading,
        isAdmin,
        register,
        login,
        logout,
        updateProfileData: async (data) => { /* Update logic for Firestore */ }, 
        toggleVerification
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
