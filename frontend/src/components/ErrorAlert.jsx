// src/components/ErrorAlert.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { alertVariants } from './AlertVariants';

const ErrorAlert = ({ message }) => {
  return (
    <motion.div
      className="fixed top-4 right-12 z-50 max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-[#111827]"
      variants={alertVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="alert"
    >
      <div className="flex">
        <div className="flex items-center justify-center w-12 bg-red-500">
          <svg
            className="w-6 h-6 text-white fill-current"
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
          </svg>
        </div>

        <div className="flex-1 px-4 py-2 -mx-3">
          <div className="mx-3">
            <span className="font-semibold text-red-500 dark:text-red-400">Error</span>
            <p className="text-sm text-gray-600 dark:text-gray-200">{message}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorAlert;
