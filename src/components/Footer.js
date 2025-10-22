// src/components/Footer.js
import React from 'react';
import { FaHeart } from 'react-icons/fa';

const DEV_NAME = "༺𝕷𝖔𝖜𝖐𝖊𝖞 𝕴𝖘 𝕳𝖎𝖒༻";

const Footer = () => {
    return (
        <footer className="w-full border-t border-gc-border/50 py-4 px-8 text-center bg-gc-vibe">
            <div className="text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
                <p className="order-2 md:order-1">
                    © 2025 **Special Squad**. All rights reserved.
                </p>
                <p className="flex items-center space-x-1 text-xs mb-2 md:mb-0 order-1 md:order-2">
                    <span>Built with</span>
                    <FaHeart className="text-gc-secondary animate-pulse" />
                    <span>by </span>
                    <a href="mailto:ayorindeayomide.dc@gmail.com" className="text-gc-primary hover:underline font-semibold">
                        {DEV_NAME}
                    </a>
                    <span>(Admin Support)</span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
