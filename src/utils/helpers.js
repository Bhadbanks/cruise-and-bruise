// Helper functions for common tasks and external links
import { toast } from 'react-hot-toast'; // Assuming you use react-hot-toast for notifications

// 🔔 Welcome Notification on registration
export const showWelcomeNotification = (username) => {
    toast.success(`Welcome aboard🍾, ${username}!`, {
        duration: 5000,
        position: 'top-right',
    });
};

// 🔗 Users must join the WhatsApp GC automatically after registration
export const autoJoinWhatsAppGC = () => {
    const gcLink = process.env.NEXT_PUBLIC_GC_WHATSAPP_LINK;
    const gcName = process.env.NEXT_PUBLIC_GC_NAME;
    if (gcLink) {
        // Open in a new tab to avoid interrupting the main app flow
        window.open(gcLink, '_blank');
        toast(`Remember to join the official group: ${gcName}`, {
            icon: '🔗',
            duration: 8000,
        });
    }
};

// 🔗 Developer/Admin contact link
export const getDevWhatsAppLink = () => {
    return process.env.NEXT_PUBLIC_DEV_WHATSAPP_CONTACT;
};
