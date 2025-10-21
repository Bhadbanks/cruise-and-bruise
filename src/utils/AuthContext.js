import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // 1. Listen to Firebase Authentication State
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return () => unsubscribeAuth();
    }, []);

    // 2. Listen to User Profile Data from Firestore
    useEffect(() => {
        if (currentUser) {
            const userDocRef = doc(db, "users", currentUser.uid);
            
            const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    const profileData = docSnap.data();
                    setUserProfile(profileData);
                    // Check for isAdmin flag (required for Admin Panel access)
                    setIsAdmin(profileData.isAdmin === true); 
                } else {
                    setUserProfile(null);
                    setIsAdmin(false);
                }
            }, (error) => {
                console.error("Error fetching user profile:", error);
            });

            return () => unsubscribeProfile();
        } else {
            setUserProfile(null);
            setIsAdmin(false);
        }
    }, [currentUser]);

    const value = {
        currentUser,
        userProfile,
        isAdmin,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
