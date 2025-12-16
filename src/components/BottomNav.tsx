import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NavView } from "../types";

// Helper to determine active view
const getActiveView = (pathname: string): NavView => {
    if (pathname === "/") return NavView.DASHBOARD;
    if (pathname.startsWith("/quran")) return NavView.QURAN;
    if (pathname.startsWith("/smart-deen")) return NavView.SMART_DEEN;
    if (pathname.startsWith("/ibadah")) return NavView.IBADAH;
    if (pathname.startsWith("/iqra")) return NavView.IQRA;
    if (pathname.startsWith("/souq")) return NavView.SOUQ;
    if (pathname.startsWith("/media")) return NavView.MEDIA_STUDIO;
    if (pathname.startsWith("/profile")) return NavView.PROFILE;
    if (pathname.startsWith("/admin")) return NavView.ADMIN;
    return NavView.DASHBOARD;
};

interface BottomNavProps {
    activeViewOverride?: NavView; // Optional override for mockups
    onNavigate?: (view: NavView) => void; // Optional handler for mockups
}

const BottomNav: React.FC<BottomNavProps> = ({ activeViewOverride, onNavigate }) => {
    const location = useLocation();
    const currentView = activeViewOverride || getActiveView(location.pathname);

    const navItems = [
        {
            id: NavView.DASHBOARD,
            path: "/",
            icon: "fa-house",
            label: "Home",
            activeColor: "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]",
        },
        {
            id: NavView.QURAN,
            path: "/quran",
            icon: "fa-book-quran",
            label: "Al-Quran",
            activeColor: "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]",
        },
        {
            id: NavView.SMART_DEEN,
            path: "/smart-deen",
            icon: "fa-robot", // Robot icon for AI
            label: "Ustaz AI",
            isCenter: true,
            activeColor: "text-white",
        },
        {
            id: NavView.IBADAH,
            path: "/ibadah",
            icon: "fa-compass",
            label: "Kiblat",
            activeColor: "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]",
        },
        {
            id: NavView.IQRA,
            path: "/iqra",
            icon: "fa-microphone-lines", // Microphone/Reading
            label: "Iqra",
            activeColor: "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]",
        },
    ];

    return (
        <nav className="h-[88px] bg-[#020617]/90 backdrop-blur-xl border-t border-white/10 relative z-50 shrink-0 pb-5">
            <div className="flex items-center justify-around h-full px-2">
                {navItems.map((item) => {
                    const isActive = currentView === item.id;

                    // SPECIAL CENTER BUTTON (USTAZ AI)
                    if (item.isCenter) {
                        return (
                            <Link 
                                key={item.id} 
                                to={item.path} 
                                className="relative group -mt-10"
                                onClick={(e) => {
                                    if (onNavigate) {
                                        e.preventDefault();
                                        onNavigate(item.id);
                                    }
                                }}
                            >
                                {/* Pulse Effect */}
                                <div className={`absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 ${isActive ? 'animate-pulse' : ''}`}></div>
                                
                                {/* Hexagon Shape or Circle */}
                                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-white/20 transform rotate-45 group-hover:scale-110 transition-transform duration-300`}>
                                    <i className={`fa-solid ${item.icon} text-2xl text-white transform -rotate-45 drop-shadow-md`}></i>
                                </div>
                                
                                {/* Label */}
                                <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider uppercase whitespace-nowrap transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    }

                    // STANDARD BUTTONS
                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className="flex flex-col items-center justify-center w-16 group gap-1.5"
                            onClick={(e) => {
                                if (onNavigate) {
                                    e.preventDefault();
                                    onNavigate(item.id);
                                }
                            }}
                        >
                            <div className="relative">
                                {/* Active Indicator Dot */}
                                {isActive && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_rgba(34,211,238,1)]"></div>
                                )}
                                
                                <i className={`fa-solid ${item.icon} text-xl transition-all duration-300 ${isActive ? item.activeColor : 'text-slate-500 group-hover:text-slate-300'}`}></i>
                            </div>
                            
                            <span className={`text-[10px] font-medium tracking-wide transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;