import { AuthProvider } from '../utils/AuthContext';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast'; 

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      {/* Global Toast Provider and Custom Styles */}
      <Toaster 
        position="top-center" // Changed to top-center for better visibility
        reverseOrder={false} 
        toastOptions={{ 
            style: { 
                background: '#333', 
                color: '#fff',
                borderRadius: '8px'
            } 
        }} 
      />
    </AuthProvider>
  );
}

export default MyApp;
