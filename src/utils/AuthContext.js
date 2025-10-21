// src/utils/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { 
    onAuthStateChanged, 
    signOut, 
    sendPasswordResetEmail,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Hardcoded WhatsApp Group Link
    const GC_LINK = "https://chat.whatsapp.com/Ll3R7OUbdjq3HsehVpskpz";

    // Listener for Auth State and Profile
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            
            if (user) {
                // 1. Set up real-time profile listener
                const profileRef = doc(db, 'users', user.uid);
                const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const profileData = { uid: docSnap.id, ...docSnap.data() };
                        setUserProfile(profileData);
                        
                        // Admin check: true if isAdmin field is true
                        const isUserAdmin = profileData.isAdmin || false;
                        setIsAdmin(isUserAdmin); 
                    } else {
                        // Profile missing but auth exists (shouldn't happen after register)
                        setUserProfile(null);
                        setIsAdmin(false);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error listening to profile:", error);
                    setLoading(false);
                });
                
                return () => unsubscribeProfile();

            } else {
                setUserProfile(null);
                setIsAdmin(false);
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    // Function to check if user must join the GC
    const shouldRedirectToGC = () => {
        return userProfile && !userProfile.hasJoinedGC;
    };
    
    // Auth functions wrapped for toast messages
    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Welcome back, Squad member!");
        } catch (error) {
            toast.error("Login Failed: " + error.message);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully.");
        } catch (error) {
            toast.error("Logout Failed: " + error.message);
        }
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    const value = {
        currentUser,
        userProfile,
        loading,
        isAdmin,
        login,
        logout,
        resetPassword,
        shouldRedirectToGC,
        GC_LINK,
        DEV_CONTACT: "wa.me/2348082591190",
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
