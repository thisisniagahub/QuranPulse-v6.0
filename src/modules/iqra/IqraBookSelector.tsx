import React from 'react';
import { IQRA_BOOKS_DATA, IqraBook } from './data';

interface IqraBookSelectorProps {
    currentBookId: string;
    onSelectBook: (bookId: string) => void;
}

const IqraBookSelector: React.FC<IqraBookSelectorProps> = ({ currentBookId, onSelectBook }) => {
    return (
        <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar shrink-0 px-1">
            {IQRA_BOOKS_DATA.map((book: IqraBook) => (
                <button 
                    key={book.id}
                    onClick={() => onSelectBook(book.id)}
                    className={`flex-shrink-0 w-16 h-20 rounded-xl font-bold transition-all relative overflow-hidden group ${
                        currentBookId === book.id 
                        ? `bg-gradient-to-br ${book.color} text-white shadow-lg ${book.shadow} scale-105 ring-2 ring-white/20` 
                        : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300'
                    }`}
                >
                    <span className="absolute top-1 left-2 text-[10px] uppercase opacity-70">Vol</span>
                    <span className="text-2xl">{book.icon}</span>
                    {currentBookId === book.id && (
                        <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>
                    )}
                </button>
            ))}
        </div>
    );
};

export default IqraBookSelector;
