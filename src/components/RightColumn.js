// src/components/RightColumn.js
import { motion } from 'framer-motion';
import { useAuth } from '../utils/AuthContext';
import { FaWhatsapp, FaCrown } from 'react-icons/fa';

const RightColumn = () => {
    const { GC_LINK, DEVELOPER_WHATSAPP } = useAuth();
    
    const trendItems = [
        { title: '#TheUltimatum', count: '1.2k Posts' },
        { title: '#GcVibeCheck', count: '980 Posts' },
        { title: '#SpecialSquad', count: 'Trending' },
        { title: '#Lowkey', count: 'Admin Chat' },
    ];

    return (
        <div className="space-y-4">
            {/* Action Card: Join GC */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-xl shadow-xl border border-gc-primary/50 bg-gc-card/80 backdrop-blur-sm"
            >
                <h2 className="text-xl font-bold text-gc-primary mb-3 flex items-center space-x-2"><FaCrown /><span>Squad HQ</span></h2>
                <p className="text-gray-400 mb-4 text-sm">Join the official WhatsApp group for real-time engagement and announcements.</p>
                <motion.a
                    href={GC_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(74, 20, 140, 0.8)' }}
                    whileTap={{ scale: 0.95 }}
                    className="block w-full text-center py-2 bg-gc-secondary text-white font-semibold rounded-full transition duration-300"
                >
                    <span className='flex items-center justify-center space-x-2'><FaWhatsapp /> Join Group Chat</span>
                </motion.a>
            </motion.div>

            {/* Trending Section */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl shadow-xl border border-gc-border bg-gc-card/80 backdrop-blur-sm"
            >
                <h2 className="text-xl font-bold text-white mb-3">What's Happening</h2>
                {trendItems.map((item, index) => (
                    <motion.div 
                        key={index} 
                        whileHover={{ backgroundColor: '#2b2233', x: 5 }}
                        className="py-2 px-1 cursor-pointer rounded-lg transition duration-200"
                    >
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.count}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default RightColumn;
