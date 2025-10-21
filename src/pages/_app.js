import { AuthProvider } from '../utils/AuthContext'; // We will define this context next
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
