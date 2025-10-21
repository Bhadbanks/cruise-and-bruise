// Function to redirect users to the official WhatsApp Group after successful registration
export const redirectToWhatsApp = () => {
    // The link is hardcoded here, but in a real app, it should be in .env.local
    const link = "https://chat.whatsapp.com/Ll3R7OUbdjq3HsehVpskpz"; 
    window.open(link, '_blank');
};

// Function to open a chat with the Admin/Developer
export const contactAdmin = () => {
    // Admin WhatsApp contract: wa.me/2348082591190
    window.open("https://wa.me/2348082591190", '_blank');
};

// Utility to upload file and return URL
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export const uploadFile = async (file, path) => {
    if (!file) return null;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
};
