// src/utils/AuthContext.js
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from './firebase';
import { 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// ⚠️ REQUIRED: Replace this with the actual UID of your *first* admin registration
// Find this UID in your Firebase console after registering as the Admin.
const ADMIN_UID = "YOUR_ADMIN_UID_HERE"; 

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const isAdmin = userProfile?.uid === ADMIN_UID;
    
    // --- Online Status (Presence System) ---
    const isInitialLoad = useRef(true);

    useEffect(() => {
        if (!currentUser) return;
        
        const userRef = doc(db, 'users', currentUser.uid);
        const updatePresence = (status) => {
            updateDoc(userRef, { 
                isOnline: status, 
                lastActive: serverTimestamp() 
            }).catch(e => console.error("Presence update failed:", e));
        };

        // Set online status on mount
        updatePresence(true); 

        // Set offline status on window close/tab switch (imperfect but functional)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                updatePresence(false);
            } else {
                updatePresence(true);
            }
        };

        window.addEventListener('beforeunload', () => updatePresence(false));
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            updatePresence(false); // Set offline on unmount/component cleanup
            window.removeEventListener('beforeunload', () => updatePresence(false));
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [currentUser]);

    // --- Real-time Auth State & Profile Listener (FIXED ROBUSTNESS) ---
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (!user) {
                setUserProfile(null);
                setLoading(false);
                return;
            }

            // Listen to profile changes in real-time
            const profileRef = doc(db, 'users', user.uid);
            const unsubscribeProfile = onSnapshot(profileRef, (snap) => {
                if (snap.exists()) {
                    const profileData = { ...snap.data(), uid: user.uid };
                    setUserProfile(profileData);
                    
                    // --- CRITICAL FEATURE: Mandatory Profile/GC Setup Check ---
                    const isProfileComplete = !!profileData.bio;
                    const isAuthPage = ['/login', '/register', '/splash'].includes(router.pathname);
                    
                    if (isProfileComplete) {
                        if (isAuthPage) {
                            router.replace('/feed');
                        }
                    } else if (router.pathname !== '/gc-join' && !isAuthPage) {
                        router.replace('/gc-join'); 
                    }
                } else {
                    setUserProfile(null);
                    if (router.pathname !== '/gc-join') {
                        router.replace('/gc-join');
                    }
                }

                if (isInitialLoad.current) {
                    setLoading(false);
                    isInitialLoad.current = false;
                }
            }, (error) => {
                console.error("Error fetching real-time profile:", error);
                setLoading(false);
            });
            
            return () => unsubscribeProfile();
        });

        // Cleanup for auth listener
        return () => unsubscribeAuth();
    }, [router.pathname]);

    // --- Auth Functions ---
    const register = async (email, password, initialData) => {
        const usernameLower = initialData.username.toLowerCase();
        const existingUsernameSnap = await getDoc(doc(db, 'usernames', usernameLower));
        if (existingUsernameSnap.exists()) {
            throw new Error("Username already taken. Please choose another.");
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        const initialProfile = {
            uid: user.uid,
            email: user.email,
            username: initialData.username,
            // Empty fields that will be filled in /gc-join (used for profile check)
            bio: '', 
            age: '',
            location: '',
            sex: '',
            relationshipStatus: '',
            interests: '',
            whatsappNumber: '',
            whatsappConvoLink: '',
            
            // Admin/Verification/Presence logic
            isVerified: user.uid === ADMIN_UID,
            isAdmin: user.uid === ADMIN_UID,
            isOnline: true, // Set true on registration
            lastActive: serverTimestamp(),
            createdAt: new Date(),
            followersCount: 0,
            followingCount: 0,
            profilePicUrl: null,
            coverImageUrl: null,
        };

        await setDoc(doc(db, 'users', user.uid), initialProfile);
        await setDoc(doc(db, 'usernames', usernameLower), { uid: user.uid });
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        await updateDoc(doc(db, 'users', currentUser.uid), { isOnline: false, lastActive: serverTimestamp() });
        await signOut(auth);
        toast.success("Logged out successfully! See you soon.");
        router.push('/splash');
    };
    
    // --- Admin Function: Toggle Verification ---
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
        toggleVerification,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
