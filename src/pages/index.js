import Head from 'next/head';
import Header from '../components/Header';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/router';
import CreatePost from '../components/CreatePost';
import UnifiedFeed from '../components/UnifiedFeed';

const Home = () => {
    const { currentUser, loading } = useAuth();
    const router = useRouter();

    // Redirect unauthenticated users to login
    if (!loading && !currentUser) {
        router.push('/login');
        return null;
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading App...</div>;
    }

    return (
        <div className="min-h-screen">
            <Head><title>Feed | Special Squad</title></Head>
            <Header />

            <main className="pl-0 lg:pl-72 py-8 px-4 lg:px-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-3xl font-extrabold mb-4 text-white border-b pb-2 border-gray-700">
                        Unified Squad Feed
                    </h1>
                    
                    <CreatePost />

                    <UnifiedFeed />
                </div>
            </main>
        </div>
    );
};

export default Home;
