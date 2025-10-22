// src/pages/_app.js 
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../utils/AuthContext';
import AppShell from '../components/AppShell';

function MyApp({ Component, pageProps }) {
  // Check for minimal layout pages that shouldn't have the 3-column AppShell
  const isMinimalLayout = ['splash', 'login', 'register', 'gc-join', '404'].includes(Component.displayName || Component.name);

  return (
    <AuthProvider>
      {isMinimalLayout ? (
        <Component {...pageProps} />
      ) : (
        <AppShell>
          <Component {...pageProps} />
        </AppShell>
      )}
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
