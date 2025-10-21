// src/utils/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { 
    onAuthStateChanged, 
    signOut, 
    signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [globalSettings, setGlobalSettings] = useState({ 
        GC_LINK: "https://chat.whatsapp.com/Ll3R7OUbdjq3HsehVpskpz", // Default fallback
        ADMIN_UID: "DEFAULT_ADMIN_UID_SET_ON_FIRST_LOGIN" // Must be updated after first login
    });

    // Real-time listener for Global Settings (GC Link, Admin UID)
    useEffect(() => {
        const settingsRef = doc(db, 'settings', 'general');
        const unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                setGlobalSettings(prev => ({
                    ...prev,
                    ...docSnap.data()
                }));
            }
        }, (error) => {
            console.error("Error fetching settings:", error);
            // Fallback to hardcoded defaults if Firestore fails
        });
        return () => unsubscribeSettings();
    }, []);

    // Listener for Auth State and Profile
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            
            if (user) {
                const profileRef = doc(db, 'users', user.uid);
                const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
                    const profileData = docSnap.exists() ? { uid: docSnap.id, ...docSnap.data() } : null;
                    setUserProfile(profileData);
                    
                    // Admin check: true if isAdmin field is true OR if UID matches hardcoded ADMIN_UID
                    const isUserAdmin = profileData?.isAdmin || (user.uid === globalSettings.ADMIN_UID);
                    setIsAdmin(isUserAdmin); 
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
    }, [globalSettings.ADMIN_UID]); // Re-run if Admin UID setting changes

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
    
    // Developer Admin Identification
    const DEV_ADMIN_EMAIL = "dev@specialsquad.com"; // Use this email to register and get the first admin UID

    const value = {
        currentUser,
        userProfile,
        loading,
        isAdmin,
        login,
        logout,
        GC_LINK: globalSettings.GC_LINK, // Use dynamic link
        DEV_CONTACT: "wa.me/2348082591190",
        DEV_ADMIN_EMAIL, // For instructions
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
