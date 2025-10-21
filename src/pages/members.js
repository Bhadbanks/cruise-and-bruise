import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import UserCard from '../components/UserCard';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/router';

const Members = () => {
    const { currentUser, loading: authLoading } = useAuth();
    const router = useRouter();
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !currentUser) {
            router.push('/login');
            return;
        }

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const usersCol = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCol);
                const usersList = usersSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(user => user.uid !== currentUser.uid); // Exclude current user from list

                setAllUsers(usersList);
                setFilteredUsers(usersList);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to load members list.");
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchUsers();
        }
    }, [currentUser, authLoading, router]);

    // Search Filtering
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredUsers(allUsers);
        } else {
            const lowerCaseSearch = searchTerm.toLowerCase();
            const results = allUsers.filter(user =>
                user.username.toLowerCase().includes(lowerCaseSearch) ||
                user.bio?.toLowerCase().includes(lowerCaseSearch) ||
                user.location?.toLowerCase().includes(lowerCaseSearch)
            );
            setFilteredUsers(results);
        }
    }, [searchTerm, allUsers]);

    if (authLoading || !currentUser) return null; // Wait for Auth context

    return (
        <div className="min-h-screen">
            <Head><title>Members | Special Squad</title></Head>
            <Header />

            <main className="pl-72 py-8 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-extrabold mb-8 text-white border-b pb-4 border-gray-700">
                        Squad Members Directory ({allUsers.length})
                    </h1>

                    {/* Search Bar */}
                    <div className="bg-gray-800 p-4 rounded-xl mb-8 shadow-lg">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search members by username, bio, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-full placeholder-gray-400 text-white focus:ring-2 focus:ring-gc-primary focus:outline-none transition duration-300"
                            />
                        </div>
                    </div>

                    {/* Members List */}
                    {loading ? (
                        <div className="text-center p-10 text-gray-400">
                            <FiRefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-gc-primary" />
                            <p>Loading members...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <p className="text-center text-gray-400 p-10">No members match your search.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredUsers.map(user => (
                                <UserCard key={user.uid} user={user} showFullDetails={true} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Members;
