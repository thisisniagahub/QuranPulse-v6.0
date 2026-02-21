import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NavView } from "../types";

import { Icon } from "@iconify/react";

// Import Icons
// Import Icons
// import navUstazAiIcon from "@/assets/icons/nav-ustaz-ai.png"; // Deprecated

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
            icon: "solar:home-angle-bold-duotone",
            label: "Home",
            color: "from-raudhah-teal to-blue-500",
        },
        {
            id: NavView.QURAN,
            path: "/quran",
            icon: "solar:book-bookmark-bold-duotone",
            label: "Al-Quran",
            color: "from-raudhah-teal to-blue-500",
        },
        {
            id: NavView.SMART_DEEN,
            path: "/smart-deen",
            icon: "/ustaz-ai-icon.png", // New Public Image source
            label: "Ustaz AI",
            isCenter: true,
            color: "from-raudhah-teal to-amber-400",
        },
        {
            id: NavView.IBADAH,
            path: "/ibadah",
            icon: "solar:compass-bold-duotone",
            label: "Kiblat",
            color: "from-amber-400 to-cyan-500",
        },
        {
            id: NavView.IQRA,
            path: "/iqra",
            icon: "solar:square-academic-cap-bold-duotone",
            label: "Iqra",
            color: "from-raudhah-teal to-blue-500",
        },
    ];

    return (
        <nav
            className="bg-[#020617]/90 backdrop-blur-xl border-t border-[#00BFFF]/20 relative z-50 shrink-0 pb-safe-bottom min-h-safe-bottom"
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    const isCenter = item.isCenter;

                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            // FIXED: Touch target minimum 44x44px (was w-16 which is good)
                            className="flex flex-col items-center justify-center relative group min-w-[44px] min-h-[44px] w-16"
                            onClick={(e) => {
                                if (onNavigate) {
                                    e.preventDefault();
                                    onNavigate(item.id);
                                }
                            }}
                            aria-label={item.label}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <div
                                className={`
                                    relative rounded-full flex items-center justify-center transition-all duration-300 border
                                    ${isCenter ? "w-16 h-16 -mt-8" : "w-11 h-11"} 
                                    ${isActive && !isCenter
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

                                {/* ICON (IMAGE BASED or VECTOR) */}
                                {isCenter ? (
                                    // CENTER BUTTON (USTAZ AI) - KEEP IMAGE
                                    <div className="relative flex items-center justify-center w-full h-full -mt-8">
                                        <div className="relative w-20 h-20 flex items-center justify-center bg-[#020617] rounded-full">
                                            <img loading="lazy"
                                                src={item.icon}
                                                alt="" // Decorative, aria-label on Link
                                                width="80"
                                                height="80"
                                                className="w-full h-full object-contain scale-125 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    // STANDARD BUTTONS (SOLAR VECTORS)
                                    <div className="relative flex items-center justify-center w-full h-full p-2">
                                        <Icon
                                            icon={item.icon}
                                            aria-hidden="true"
                                            className={`text-2xl transition-all duration-300 ${isActive
                                                ? "text-white scale-110 drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                                                : "text-slate-500 group-hover:text-slate-300"
                                                }`}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Label */}
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


