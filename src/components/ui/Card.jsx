import React from 'react';
import { Pin } from 'lucide-react';

const Card = ({ title, children, onClick, className = '' }) => {
    return (
        <div 
            onClick={onClick} 
            className={`bg-white border rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 
                flex flex-col items-center justify-center space-y-2 sm:space-y-3 lg:space-y-4 
                cursor-pointer hover:shadow-md transition-shadow duration-200
                min-h-[120px] sm:min-h-[140px] lg:min-h-[180px]
                touch-manipulation
                ${className}`}
        >
            <div className="w-full flex justify-end">
                <Pin size={12} className="sm:w-4 sm:h-4 text-gray-400" />
            </div>
            <div className="flex-1 flex items-center justify-center w-full">
                {children}
            </div>
            <h3 className="text-center font-semibold text-gray-700 text-xs sm:text-sm leading-tight">{title}</h3>
        </div>
    );
};

export default Card;
