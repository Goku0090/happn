import React from 'react';
import { Search, User, Bell } from 'lucide-react';

const Header = () => {
    return (
        <header className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between px-6 z-20">
            <div className="flex items-center gap-4 bg-gray-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-gray-800 w-96">
                <Search className="w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search events..." 
                    className="bg-transparent border-none outline-none text-sm w-full text-white"
                />
            </div>
            
            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                    GN
                </div>
            </div>
        </header>
    );
};

export default Header;
