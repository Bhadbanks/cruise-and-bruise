import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/AuthContext';
import Header from '../components/Header';
import CreatePost from '../components/CreatePost';
import UnifiedFeed from '../components/UnifiedFeed';
import { FiSearch, FiMessageCircle } from 'react-icons/fi';

const Home = () => {
    const { currentUser, loading } = useAuth();
    const router = useRouter();

    // Enforce authentication for the main feed
    if (loading) {
        // Loading state: show nothing or a spinner
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!currentUser) {
        // Not logged in: redirect to login
        router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen">
            <Head>
                <title>Home | Special Squad Feed</title>
            </Head>

            <Header /> {/* Left Sidebar */}

            <main className="pl-72 flex">
                {/* Center Column: Post Creation and Feed */}
                <div className="flex-1 max-w-3xl border-x border-gray-700">
                    <div className="p-6">
                        <h1 className="text-3xl font-extrabold mb-6 text-white border-b pb-3 border-gray-700">
                            Home Feed
                        </h1>
                        <CreatePost />
                        <UnifiedFeed />
                    </div>
                </div>

                {/* Right Column: Search and Trends */}
                <div className="w-80 p-6 sticky top-0 h-screen hidden lg:block">
                    <div className="bg-gray-800 p-4 rounded-xl mb-6 shadow-lg">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users or posts"
                                className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-full placeholder-gray-400 text-white focus:ring-2 focus:ring-gc-primary focus:outline-none transition duration-300"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-xl shadow-lg space-y-3">
                        <h2 className="font-bold text-xl mb-3 text-gc-primary">Squad Trends</h2>
                        <div className="text-sm">
                            <p className="font-semibold hover:text-gc-primary cursor-pointer">#LowkeyIsHim</p>
                            <p className="text-gray-400">12.5k posts</p>
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold hover:text-gc-primary cursor-pointer">#SquadGoals</p>
                            <p className="text-gray-400">8.1k posts</p>
                        </div>
                        <div className="text-center pt-3 border-t border-gray-700">
                            <Link href="/chat" legacyBehavior>
                                <a className="text-purple-400 hover:text-purple-300 font-medium flex items-center justify-center">
                                    <FiMessageCircle className="mr-1" /> Open Public Chat
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
