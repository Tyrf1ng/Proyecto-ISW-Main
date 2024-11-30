import React, { useEffect, useState } from 'react';

const SuccessAlert = ({ message }) => {
    const [visible, setVisible] = useState(true);
    const [fadeIn, setFadeIn] = useState(true);
    const [bounce, setBounce] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const fadeInTimer = setTimeout(() => {
            setFadeIn(false);
            setBounce(true);
        }, 500); // Duración de la animación de desvanecimiento

        const bounceTimer = setTimeout(() => {
            setBounce(false);
            setFadeOut(true);
            setTimeout(() => {
                setVisible(false);
            }, 500); // Duración de la animación de desvanecimiento
        }, 2500); // 3 segundos para 3 rebotes (1s por rebote) + 0.5s de fade-in

        return () => {
            clearTimeout(fadeInTimer);
            clearTimeout(bounceTimer);
        };
    }, []);

    if (!visible) return null;

    return (
        <div className={`fixed top-4 right-12 z-50 max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-[#111827] ${fadeIn ? 'fade-in' : ''} ${bounce ? 'animate-bounce-slow' : ''} ${fadeOut ? 'fade-out' : ''}`}>
            <div className="flex">
                <div className="flex items-center justify-center w-12 bg-emerald-500">
                    <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
                    </svg>
                </div>

                <div className="flex-1 px-4 py-2 -mx-3">
                    <div className="mx-3">
                        <span className="font-semibold text-emerald-500 dark:text-emerald-400">Success</span>
                        <p className="text-sm text-gray-600 dark:text-gray-200">{message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessAlert;