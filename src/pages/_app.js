// src/pages/_app.js (in src/pages folder)
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../utils/AuthContext';
import AppShell from '../components/AppShell';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppShell>
        <Component {...pageProps} />
      </AppShell>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#15151F', // gc-card
            color: '#E7E9EA',
            border: '1px solid #1D9BF0', // gc-primary
          },
        }}
      />
    </AuthProvider>
  );
}

export default MyApp;
