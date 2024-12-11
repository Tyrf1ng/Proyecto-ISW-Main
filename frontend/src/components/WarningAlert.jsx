import React, { useEffect, useState } from 'react';

const Alert = ({ message, type }) => {
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

    // Determinamos las clases según el tipo de alerta
    let bgColor, iconColor, textColor, icon;
    let title;

    switch (type) {
        case 'success':
            bgColor = 'bg-emerald-500';
            iconColor = 'bg-emerald-500';
            textColor = 'text-emerald-500';
            icon = (
                <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
                </svg>
            );
            title = 'Success';
            break;

        case 'error':
            bgColor = 'bg-red-500';
            iconColor = 'bg-red-500';
            textColor = 'text-red-500';
            icon = (
                <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
                </svg>
            );
            title = 'Error';
            break;

        case 'warning':
        default:
            bgColor = 'bg-yellow-400';
            iconColor = 'bg-yellow-400';
            textColor = 'text-yellow-400';
            icon = (
                <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z" />
                </svg>
            );
            title = 'Warning';
            break;
    }

    return (
        <div className={`fixed top-4 right-12 z-50 max-w-sm overflow-hidden rounded-lg shadow-md dark:bg-gray-800 ${bgColor} ${fadeIn ? 'fade-in' : ''} ${bounce ? 'animate-bounce-slow' : ''} ${fadeOut ? 'fade-out' : ''}`}>
            <div className="flex">
                <div className={`flex items-center justify-center w-12 ${iconColor}`}>
                    {icon}
                </div>

                <div className="flex-1 px-4 py-2 -mx-3">
                    <div className="mx-3">
                        <span className={`font-semibold ${textColor} dark:text-gray-300`}>{title}</span>
                        <p className="text-sm text-gray-600 dark:text-gray-200">{message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Alert;
