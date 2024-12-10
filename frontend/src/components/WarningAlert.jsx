import React, { useEffect, useState } from 'react';

const WarningAlert = ({ message }) => {
    const [visible, setVisible] = useState(true);
    const [fadeIn, setFadeIn] = useState(true);
    const [bounce, setBounce] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const fadeInTimer = setTimeout(() => {
            setFadeIn(false);
            setBounce(true);
        }, 500); 

        const bounceTimer = setTimeout(() => {
            setBounce(false);
            setFadeOut(true);
            setTimeout(() => {
                setVisible(false);
            }, 500); 
        }, 2500); 

        return () => {
            clearTimeout(fadeInTimer);
            clearTimeout(bounceTimer);
        };
    }, []);

    if (!visible) return null;

    return (
        <div className={`fixed top-4 right-12 z-50 max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-[#111827] ${fadeIn ? 'fade-in' : ''} ${bounce ? 'animate-bounce-slow' : ''} ${fadeOut ? 'fade-out' : ''}`}>
            <div className="flex">
                <div className="flex items-center justify-center w-12 bg-yellow-400">
                    <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z" />
                    </svg>
                </div>

                <div className="flex-1 px-4 py-2 -mx-3">
                    <div className="mx-3">
                        <span className="font-semibold text-yellow-400 dark:text-yellow-300">Warning</span>
                        <p className="text-sm text-gray-600 dark:text-gray-200">{message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WarningAlert;