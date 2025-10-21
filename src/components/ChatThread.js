import { motion } from 'framer-motion';

const ChatThread = ({ thread, isActive, onSelect }) => {
    const partner = thread.partner;
    const lastMessage = thread.lastMessageText || 'No messages yet...';

    if (!partner) return null; // Hide thread if partner profile fails to load

    return (
        <motion.div 
            whileHover={{ scale: 1.01, backgroundColor: '#374151' }}
            onClick={onSelect}
            className={`p-3 border-b border-gray-700 cursor-pointer transition duration-150 ${isActive ? 'bg-gc-primary/30' : 'hover:bg-gray-700'}`}
        >
            <div className="flex items-center space-x-3">
                <img 
                    src={partner.profilePicUrl || '/default-avatar.png'} 
                    alt={partner.username} 
                    className="w-10 h-10 rounded-full object-cover" 
                />
                <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{partner.username}</p>
                    <p className="text-sm text-gray-400 truncate">{lastMessage}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default ChatThread;
