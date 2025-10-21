// src/components/GlobalLoading.js
import { motion } from 'framer-motion';

const GlobalLoading = () => (
    <div className="min-h-screen flex items-center justify-center text-white bg-gc-vibe">
        <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-t-4 border-gc-primary border-t-transparent rounded-full"
        ></motion.div>
    </div>
);

export default GlobalLoading;
