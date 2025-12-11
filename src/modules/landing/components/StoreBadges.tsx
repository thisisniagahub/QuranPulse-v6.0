import React from 'react';

export const AppStoreBadge = () => (
  <svg className="h-10 sm:h-12 w-auto cursor-pointer hover:scale-105 transition-transform" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="40" rx="8" fill="black"/>
    <path d="M26.9 19.8C26.9 16.5 29.7 14.8 29.8 14.7C27.7 11.7 24.5 11.6 23.4 11.6C20.7 11.3 18.1 13.2 16.7 13.2C15.3 13.2 13.2 11.6 10.9 11.6C8 11.6 5.3 13.3 3.9 15.8C1 20.8 3.2 28.2 6 32.3C7.4 34.3 9 36.5 11.3 36.4C13.5 36.3 14.3 35 17 35C19.6 35 20.4 36.4 22.7 36.4C25.1 36.4 26.6 34.2 28 32.2C29.6 29.8 30.3 27.5 30.3 27.4C30.3 27.3 25.9 25.6 25.9 20.7C25.9 19.8 26.9 19.8 26.9 19.8Z" fill="white"/>
    <path d="M22.3 9.4C23.5 8 24.3 6 24.1 4C22.3 4.1 20.1 5.2 18.8 6.7C17.7 8 16.8 10 17.1 11.9C19 12.1 21.1 10.9 22.3 9.4Z" fill="white"/>
    <text x="40" y="26" fill="white" fontSize="14" fontFamily="sans-serif" fontWeight="bold">App Store</text>
    <text x="40" y="14" fill="#ccc" fontSize="8" fontFamily="sans-serif">Download on the</text>
  </svg>
);

export const PlayStoreBadge = () => (
  <svg className="h-10 sm:h-12 w-auto cursor-pointer hover:scale-105 transition-transform" viewBox="0 0 135 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="135" height="40" rx="8" fill="black"/>
    <path d="M26.5 20.2L9.8 3.5C9.4 3.1 8.8 3.2 8.5 3.7L20.5 26.2L26.5 20.2Z" fill="#00F076"/>
    <path d="M26.5 20.2L20.5 14.2L8.5 36.7C8.8 37.2 9.4 37.3 9.8 36.9L26.5 20.2Z" fill="#FF3D00"/>
    <path d="M26.5 20.2L20.5 26.2L20.5 14.2L26.5 20.2Z" fill="#FFC107"/>
    <path d="M26.5 20.2L9.8 36.9C9.4 37.3 8.8 37.2 8.5 36.7V3.7C8.8 3.2 9.4 3.1 9.8 3.5L26.5 20.2Z" fill="#2196F3"/>
    <text x="40" y="26" fill="white" fontSize="14" fontFamily="sans-serif" fontWeight="bold">Google Play</text>
    <text x="40" y="14" fill="#ccc" fontSize="8" fontFamily="sans-serif">GET IT ON</text>
  </svg>
);
