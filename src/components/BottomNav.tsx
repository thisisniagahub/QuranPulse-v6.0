import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NavView } from "../types";

// Import Icons (Same as Layout.tsx)
import navHomeIcon from "@/assets/icons/nav-home-neon.png";
import navQuranIcon from "@/assets/icons/nav-quran-neon.png";
import navUstazAiIcon from "@/assets/icons/nav-ustaz-ai.png";
import navQiblatIcon from "@/assets/icons/nav-qiblat-neon.png";
import navIqraIcon from "@/assets/icons/nav-iqra-neon.png";

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
            icon: navHomeIcon,
            label: "Home",
            color: "from-cyan-400 to-blue-500",
        },
        {
            id: NavView.QURAN,
            path: "/quran",
            icon: navQuranIcon,
            label: "Al-Quran",
            color: "from-cyan-400 to-blue-500",
        },
        {
            id: NavView.SMART_DEEN,
            path: "/smart-deen",
            icon: navUstazAiIcon,
            label: "Ustaz AI",
            isCenter: true,
            color: "from-cyan-400 to-amber-400",
        },
        {
            id: NavView.IBADAH,
            path: "/ibadah",
            icon: navQiblatIcon,
            label: "Kiblat",
            color: "from-amber-400 to-cyan-500",
        },
        {
            id: NavView.IQRA,
            path: "/iqra",
            icon: navIqraIcon,
            label: "Iqra",
            color: "from-cyan-400 to-blue-500",
        },
    ];

    return (
        <nav className="h-[88px] bg-[#020617]/90 backdrop-blur-xl border-t border-white/10 relative z-50 shrink-0 pb-5">
            <div className="flex items-center justify-around h-full px-2">
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    const isCenter = item.isCenter;

                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className="flex flex-col items-center justify-center relative group w-16"
                            onClick={(e) => {
                                if (onNavigate) {
                                    e.preventDefault();
                                    onNavigate(item.id);
                                }
                            }}
                        >
                            <div
                                className={`
                                    relative rounded-full flex items-center justify-center transition-all duration-300 border
                                    ${isCenter ? "w-16 h-16 -mt-8" : "w-10 h-10"}
                                    ${
                                      isActive && !isCenter
                                        ? `bg-gradient-to-br ${item.color} border-white/20 shadow-lg shadow-cyan-500/20 scale-110`
                                        : isActive && isCenter
                                        ? "bg-transparent border-transparent scale-110"
                                        : "bg-transparent border-transparent text-slate-500 group-hover:bg-white/5 group-hover:text-slate-300"
                                    }
                                `}
                            >
                                {/* Inner Glass Reflection for Active State */}
                                {isActive && !isCenter && (
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
                                )}

                                {/* ICON (IMAGE BASED) - EXACTLY LIKE LAYOUT.TSX */}
                                {isCenter ? (
                                    // CENTER BUTTON (USTAZ AI)
                                    <div className="relative flex items-center justify-center w-full h-full -mt-8">
                                        <div className="relative w-20 h-20 flex items-center justify-center bg-[#020617] rounded-full">
                                            <img 
                                                src={item.icon} 
                                                alt={item.label}
                                                className="w-full h-full object-contain scale-125 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    // STANDARD BUTTONS
                                    <div className="relative flex items-center justify-center w-full h-full p-2">
                                        <img 
                                            src={item.icon} 
                                            alt={item.label}
                                            className={`w-full h-full object-contain transition-all duration-300 ${isActive ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] brightness-110" : "opacity-60 grayscale"}`}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Label (Visible on Active or Hover) - Hidden for Ustaz AI */}
                            {!isCenter && (
                                <span className={`text-[10px] font-bold mt-1 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-400'}`}>
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
