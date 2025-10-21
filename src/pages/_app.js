// src/pages/_app.js
import Head from 'next/head';
import { AuthProvider } from '../utils/AuthContext';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <link rel="icon" href="/logo.png" />
      </Head>
      <Component {...pageProps} />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            border: '1px solid #E91E63',
          },
          success: {
            iconTheme: {
              primary: '#9C27B0',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default MyApp;
