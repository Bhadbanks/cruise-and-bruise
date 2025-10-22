// src/pages/_app.js (in src/pages folder)
import '../styles/globals.css'; // CRITICAL: Correct CSS import
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../utils/AuthContext';
import AppShell from '../components/AppShell';

// AppShell wraps all pages to apply global layout and auth protection
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppShell>
        <Component {...pageProps} />
      </AppShell>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1B152C', // gc-card
            color: '#EAEAEA',
            border: '1px solid #FF6B81', // gc-primary
          },
        }}
      />
    </AuthProvider>
  );
}

export default MyApp;
