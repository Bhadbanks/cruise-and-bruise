// src/utils/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// --- HARDCODED ADMIN/GC DATA ---
const ADMIN_UID = 'special_squad_admin_uid_placeholder'; // Placeholder: REPLACE THIS with the actual UID of the 'admin@SpecialSquad.com' account in Firestore after its first login.
const ADMIN_USERNAME = 'Lowkey';
const GC_LINK_DOC_ID = 'settings';
const DEFAULT_GC_LINK = 'https://chat.whatsapp.com/Ll3R7OUbdjq3HsehVpskpz?mode=ems_copy_t';
const DEVELOPER_WHATSAPP = 'wa.me/2348082591190';

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [gcLink, setGcLink] = useState(DEFAULT_GC_LINK);

    const isAdmin = userProfile?.uid === ADMIN_UID;

    // --- Core Authentication Functions ---
    const register = async (email, password, userData) => {
        // 1. Check for unique username
        const usernameQuery = query(collection(db, 'users'), where('username', '==', userData.username));
        const usernameSnap = await getDocs(usernameQuery);
        if (!usernameSnap.empty) {
            throw new Error('Username already taken. Please choose another.');
        }

        // 2. Create Firebase User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // 3. Create Firestore Profile
        const profileData = {
            uid: user.uid,
            email: user.email,
            username: userData.username,
            bio: 'Hello, I just joined the Special Squad!',
            profilePicUrl: '/default-avatar.png',
            coverImageUrl: '/default-cover.jpg',
            isAdmin: user.uid === ADMIN_UID,
            isVerified: user.uid === ADMIN_UID, // Admin is auto-verified
            hasJoinedGC: false, // Enforce GC join immediately
            postsCount: 0,
            followersCount: 0,
            followingCount: 0,
            // Additional custom fields
            age: userData.age || '',
            location: userData.location || '',
            interests: userData.interests || '',
            sex: userData.sex || '',
            relationshipStatus: userData.relationshipStatus || '',
            whatsappNumber: userData.whatsappNumber || '',
            whatsappConvoLink: userData.whatsappConvoLink || '',
            createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, 'users', user.uid), profileData);
        
        // Success notification
        toast.success(`Welcome to the Squad, @${userData.username}!`);
        return user;
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        toast('Logged out successfully!', { icon: '👋' });
        return signOut(auth);
    };

    // --- Profile/GC Link Fetcher ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                
                // Fetch user profile
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserProfile(docSnap.data());
                } else {
                    // This handles cases where auth user exists but profile somehow doesn't
                    console.error('User profile not found in Firestore.');
                    setUserProfile(null);
                }
            } else {
                setCurrentUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });

        // Fetch GC Link globally
        const fetchGcLink = async () => {
            const docRef = doc(db, GC_LINK_DOC_ID, 'gcLink');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setGcLink(docSnap.data().url || DEFAULT_GC_LINK);
            } else {
                // Initialize default GC Link if doc doesn't exist
                await setDoc(docRef, { url: DEFAULT_GC_LINK, lastUpdated: new Date().toISOString() });
            }
        };

        fetchGcLink();
        
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userProfile,
        loading,
        isAdmin,
        register,
        login,
        logout,
        GC_LINK: gcLink,
        ADMIN_UID,
        ADMIN_USERNAME,
        DEVELOPER_WHATSAPP
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
