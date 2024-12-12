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
                <div className="flex items-center justify-center w-12 bg-yellow-500">
                    <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM20 25C18.9 25 18 24.1 18 23C18 21.9 18.9 21 20 21C21.1 21 22 21.9 22 23C22 24.1 21.1 25 20 25ZM20 17.5C18.9 17.5 18 16.6 18 15.5V12.5C18 11.4 18.9 10.5 20 10.5C21.1 10.5 22 11.4 22 12.5V15.5C22 16.6 21.1 17.5 20 17.5Z" />
                    </svg>
                </div>

                <div className="flex-1 px-4 py-2 -mx-3">
                    <div className="mx-3">
                        <span className="font-semibold text-yellow-500 dark:text-yellow-400">Warning</span>
                        <p className="text-sm text-gray-600 dark:text-gray-200">{message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WarningAlert;
