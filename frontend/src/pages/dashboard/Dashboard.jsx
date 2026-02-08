import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Import images
import boxIndoor from '../../assets/box_indoor.png';
import boxOutdoor from '../../assets/box_outdoor.png';
import boxPremium from '../../assets/box_premium.png';

// Static user data - Will come from API/Auth
const USER_DATA = {
    name: "Rajesh Kumar",
    subtitle: "Surat All-rounder",
    avatar: boxIndoor, // Using image as avatar
    phone: "+91 98765 43210",
    email: "rajesh@example.com",
    memberSince: "Jan 2025",
    skillLevel: "Intermediate",
    preferredArea: "Vesu, Surat",
    preferredTime: "Evening",
};

// Static stats
const STATS = {
    totalBookings: 12,
    upcomingMatches: 2,
    matchesPlayed: 10,
    favoriteBoxes: 4,
};

// Static upcoming bookings
const UPCOMING_BOOKINGS = [
    {
        id: 1,
        boxName: "The Lords Box Cricket",
        boxImage: boxIndoor,
        location: "Vesu, Surat",
        date: "2026-01-26",
        displayDate: "Sun, 26 Jan",
        time: "06:00 PM - 08:00 PM",
        status: "confirmed",
        amount: 2400,
    },
    {
        id: 2,
        boxName: "Stadium X Arena",
        boxImage: boxOutdoor,
        location: "Adajan, Surat",
        date: "2026-01-28",
        displayDate: "Tue, 28 Jan",
        time: "07:00 AM - 08:00 AM",
        status: "pending",
        amount: 800,
    },
];

// Static past bookings
const PAST_BOOKINGS = [
    {
        id: 3,
        boxName: "Surat Sports Hub",
        boxImage: boxPremium,
        location: "Piplod, Surat",
        date: "2026-01-20",
        displayDate: "Mon, 20 Jan",
        time: "09:00 PM - 10:00 PM",
        status: "completed",
        amount: 1500,
    },
];

// Static favorite boxes
const FAVORITE_BOXES = [
    {
        id: 1,
        name: "The Lords Box Cricket",
        image: boxIndoor,
        location: "Vesu, Surat",
        rating: 4.8,
        pricePerHour: 1200,
    },
    {
        id: 2,
        name: "Stadium X Arena",
        image: boxOutdoor,
        location: "Adajan, Surat",
        rating: 4.2,
        pricePerHour: 800,
    },
    {
        id: 3,
        name: "Surat Sports Hub",
        image: boxPremium,
        location: "Piplod, Surat",
        rating: 4.9,
        pricePerHour: 1500,
    },
];

// Static player matching requests
const MY_REQUESTS = [
    {
        id: 1,
        matchTitle: "Sunday Morning Slog",
        venue: "Lords Box, Vesu",
        dateTime: "Sunday, Jan 26 • 06:00 PM",
        playersNeeded: 4,
        playersJoined: 2,
        requestsReceived: 3,
    },
];

// Static join requests sent
const SENT_REQUESTS = [
    {
        id: 1,
        matchTitle: "Night Owls T20",
        creatorName: "Rahul Shah",
        status: "pending",
    },
    {
        id: 2,
        matchTitle: "Corporate Clash",
        creatorName: "Meet Patel",
        status: "accepted",
    },
];

// Sidebar Menu Items
const MENU_ITEMS = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z" />
            </svg>
        ),
        path: '/dashboard',
    },
    {
        id: 'book',
        label: 'Book a Box',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
            </svg>
        ),
        path: '/boxes',
    },
    {
        id: 'find-matches',
        label: 'Find Matches',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
        ),
        path: '/find-team',
    },
    {
        id: 'booking-history',
        label: 'Booking History',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
            </svg>
        ),
        path: '/booking-history',
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
        ),
        path: '/settings',
    },
];

const BOTTOM_MENU_ITEMS = [
    {
        id: 'help',
        label: 'Help & Support',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
            </svg>
        ),
        path: '/support',
    },
    {
        id: 'logout',
        label: 'Logout',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
        ),
        path: '/logout',
        isLogout: true,
    },
];

const Dashboard = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Calculate days until next match
    const getCountdown = (dateString) => {
        const today = new Date();
        const matchDate = new Date(dateString);
        const diffTime = matchDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        return `${diffDays} days`;
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return <span className="px-2.5 py-1 bg-[#e7fceb] text-[#13ec5b] text-xs font-bold rounded-full uppercase">Confirmed</span>;
            case 'pending':
                return <span className="px-2.5 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-full uppercase">Pending</span>;
            case 'completed':
                return <span className="px-2.5 py-1 bg-gray-100 text-[#6b7c72] text-xs font-bold rounded-full uppercase">Completed</span>;
            case 'cancelled':
                return <span className="px-2.5 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full uppercase">Cancelled</span>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#f6f8f6]">
            <Header />

            <div className="flex">
                {/* Mobile Sidebar Toggle */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden fixed bottom-6 left-6 z-50 w-14 h-14 bg-[#13ec5b] rounded-full flex items-center justify-center shadow-lg shadow-[#13ec5b]/30"
                >
                    <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                        {isSidebarOpen ? (
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        ) : (
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                        )}
                    </svg>
                </button>

                {/* Sidebar Overlay for Mobile */}
                {isSidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Left Sidebar */}
                <aside className={`
                    fixed left-0 z-40
                    w-[260px] h-[calc(100vh-73px)] top-[73px]
                    bg-white border-r border-gray-100
                    flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    {/* Profile Section */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#13ec5b]">
                                <img
                                    src={USER_DATA.avatar}
                                    alt={USER_DATA.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#0d1b12] text-sm">{USER_DATA.name}</h3>
                                <p className="text-xs text-[#13ec5b] font-medium">{USER_DATA.subtitle}</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Menu */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <ul className="space-y-1">
                            {MENU_ITEMS.map(item => (
                                <li key={item.id}>
                                    <Link
                                        to={item.path}
                                        onClick={() => {
                                            setActiveMenu(item.id);
                                            setIsSidebarOpen(false);
                                        }}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                            ${activeMenu === item.id
                                                ? 'bg-[#e7fceb] text-[#0d1b12] font-semibold'
                                                : 'text-[#6b7c72] hover:bg-[#f6f8f6] hover:text-[#0d1b12]'
                                            }
                                        `}
                                    >
                                        <span className={activeMenu === item.id ? 'text-[#13ec5b]' : ''}>
                                            {item.icon}
                                        </span>
                                        <span className="text-sm">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Bottom Menu */}
                    <div className="p-4 border-t border-gray-100">
                        <ul className="space-y-1">
                            {BOTTOM_MENU_ITEMS.map(item => (
                                <li key={item.id}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                            ${item.isLogout
                                                ? 'text-red-500 hover:bg-red-50'
                                                : 'text-[#6b7c72] hover:bg-[#f6f8f6] hover:text-[#0d1b12]'
                                            }
                                        `}
                                    >
                                        <span className={item.isLogout ? 'text-red-500' : 'text-[#13ec5b]'}>
                                            {item.icon}
                                        </span>
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-h-[calc(100vh-73px)] lg:ml-[260px]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                        {/* Welcome Section */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d1b12]">
                                        Welcome back, {USER_DATA.name.split(' ')[0]}! 👋
                                    </h1>
                                    <p className="text-[#6b7c72]">Here's what's happening with your bookings</p>
                                </div>
                                <Link
                                    to="/boxes"
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#13ec5b] text-[#0d1b12] font-bold rounded-xl hover:shadow-lg hover:shadow-[#13ec5b]/30 transition-all"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </svg>
                                    Book New Match
                                </Link>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#13ec5b] hover:shadow-lg hover:shadow-[#13ec5b]/10 transition-all">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-[#e7fceb] rounded-xl flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-5 h-5">
                                            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-[#6b7c72]">Total Bookings</span>
                                </div>
                                <p className="text-3xl font-extrabold text-[#0d1b12]">{STATS.totalBookings}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#13ec5b] hover:shadow-lg hover:shadow-[#13ec5b]/10 transition-all">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="#3b82f6" className="w-5 h-5">
                                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-[#6b7c72]">Upcoming</span>
                                </div>
                                <p className="text-3xl font-extrabold text-[#0d1b12]">{STATS.upcomingMatches}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#13ec5b] hover:shadow-lg hover:shadow-[#13ec5b]/10 transition-all">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="#8b5cf6" className="w-5 h-5">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-[#6b7c72]">Matches Played</span>
                                </div>
                                <p className="text-3xl font-extrabold text-[#0d1b12]">{STATS.matchesPlayed}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#13ec5b] hover:shadow-lg hover:shadow-[#13ec5b]/10 transition-all">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="#ef4444" className="w-5 h-5">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-[#6b7c72]">Favorites</span>
                                </div>
                                <p className="text-3xl font-extrabold text-[#0d1b12]">{STATS.favoriteBoxes}</p>
                            </div>
                        </div>

                        <div className="flex flex-col xl:flex-row gap-6">
                            {/* Main Content */}
                            <div className="flex-1 space-y-6">
                                {/* Next Match Highlight */}
                                {UPCOMING_BOOKINGS.length > 0 && (
                                    <div className="bg-gradient-to-r from-[#102216] to-[#0d1b12] rounded-2xl p-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#13ec5b]/10 rounded-full blur-3xl"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-2 h-2 bg-[#13ec5b] rounded-full animate-pulse"></div>
                                                <span className="text-[#13ec5b] text-sm font-semibold uppercase tracking-wider">Next Match</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-2">{UPCOMING_BOOKINGS[0].boxName}</h3>
                                                    <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                                                        <span className="flex items-center gap-1">
                                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                                            </svg>
                                                            {UPCOMING_BOOKINGS[0].location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                                            </svg>
                                                            {UPCOMING_BOOKINGS[0].time}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur">
                                                        <span className="block text-2xl font-bold text-[#13ec5b]">{getCountdown(UPCOMING_BOOKINGS[0].date)}</span>
                                                        <span className="text-xs text-white/70 uppercase tracking-wider">to go</span>
                                                    </div>
                                                    <Link to={`/booking/${UPCOMING_BOOKINGS[0].id}`} className="px-5 py-3 bg-[#13ec5b] text-[#0d1b12] font-bold rounded-xl hover:shadow-lg hover:shadow-[#13ec5b]/40 transition-all">
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Bookings Section */}
                                <div className="bg-white rounded-2xl border border-gray-100">
                                    {/* Tabs */}
                                    <div className="flex border-b border-gray-100">
                                        <button
                                            onClick={() => setActiveTab('upcoming')}
                                            className={`flex-1 py-4 text-sm font-semibold transition-all relative ${activeTab === 'upcoming' ? 'text-[#0d1b12]' : 'text-[#6b7c72] hover:text-[#0d1b12]'}`}
                                        >
                                            Upcoming ({UPCOMING_BOOKINGS.length})
                                            {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#13ec5b]"></div>}
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('past')}
                                            className={`flex-1 py-4 text-sm font-semibold transition-all relative ${activeTab === 'past' ? 'text-[#0d1b12]' : 'text-[#6b7c72] hover:text-[#0d1b12]'}`}
                                        >
                                            Past Bookings ({PAST_BOOKINGS.length})
                                            {activeTab === 'past' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#13ec5b]"></div>}
                                        </button>
                                    </div>

                                    {/* Booking Cards */}
                                    <div className="p-4 space-y-4">
                                        {activeTab === 'upcoming' ? (
                                            UPCOMING_BOOKINGS.length > 0 ? (
                                                UPCOMING_BOOKINGS.map(booking => (
                                                    <div key={booking.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-[#f6f8f6] rounded-xl hover:bg-[#e7fceb]/50 transition-colors">
                                                        <img src={booking.boxImage} alt={booking.boxName} className="w-full sm:w-28 h-24 rounded-lg object-cover" />
                                                        <div className="flex-1">
                                                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                                                <h4 className="font-bold text-[#0d1b12]">{booking.boxName}</h4>
                                                                {getStatusBadge(booking.status)}
                                                            </div>
                                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#6b7c72] mb-3">
                                                                <span className="flex items-center gap-1">
                                                                    <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-4 h-4">
                                                                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                                                                    </svg>
                                                                    {booking.displayDate}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-4 h-4">
                                                                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                                                    </svg>
                                                                    {booking.time}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-4 h-4">
                                                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                                                    </svg>
                                                                    {booking.location}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                                <span className="text-lg font-bold text-[#13ec5b]">₹{booking.amount.toLocaleString()}</span>
                                                                <div className="flex gap-2">
                                                                    <button className="px-4 py-2 border-2 border-gray-200 text-[#6b7c72] text-sm font-medium rounded-lg hover:border-red-300 hover:text-red-500 transition-all">
                                                                        Cancel
                                                                    </button>
                                                                    <button className="px-4 py-2 bg-[#0d1b12] text-white text-sm font-medium rounded-lg hover:bg-[#1a2f20] transition-colors">
                                                                        View
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-10">
                                                    <div className="w-20 h-20 bg-[#f6f8f6] rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <svg viewBox="0 0 24 24" fill="#6b7c72" className="w-10 h-10">
                                                            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="font-bold text-[#0d1b12] mb-1">No Upcoming Bookings</h3>
                                                    <p className="text-sm text-[#6b7c72] mb-4">Book your first match and start playing!</p>
                                                    <Link to="/boxes" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#13ec5b] text-[#0d1b12] font-semibold rounded-xl hover:shadow-lg transition-all">
                                                        Explore Boxes
                                                    </Link>
                                                </div>
                                            )
                                        ) : (
                                            PAST_BOOKINGS.length > 0 ? (
                                                PAST_BOOKINGS.map(booking => (
                                                    <div key={booking.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-[#f6f8f6] rounded-xl opacity-80">
                                                        <img src={booking.boxImage} alt={booking.boxName} className="w-full sm:w-28 h-24 rounded-lg object-cover grayscale" />
                                                        <div className="flex-1">
                                                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                                                <h4 className="font-bold text-[#0d1b12]">{booking.boxName}</h4>
                                                                {getStatusBadge(booking.status)}
                                                            </div>
                                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#6b7c72] mb-3">
                                                                <span>{booking.displayDate}</span>
                                                                <span>{booking.time}</span>
                                                                <span>{booking.location}</span>
                                                            </div>
                                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                                <span className="text-lg font-bold text-[#6b7c72]">₹{booking.amount.toLocaleString()}</span>
                                                                <button className="px-4 py-2 border-2 border-[#13ec5b] text-[#13ec5b] text-sm font-medium rounded-lg hover:bg-[#13ec5b] hover:text-white transition-all">
                                                                    Book Again
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-10">
                                                    <p className="text-[#6b7c72]">No past bookings yet</p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Player Matching Section */}
                                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-[#0d1b12] text-lg">Player Matching</h3>
                                        <Link to="/find-team" className="text-[#13ec5b] text-sm font-semibold hover:underline">View All</Link>
                                    </div>

                                    {/* My Created Matches */}
                                    {MY_REQUESTS.length > 0 && (
                                        <div className="mb-4">
                                            <span className="text-xs font-bold text-[#6b7c72] uppercase tracking-wider">Your Matches</span>
                                            {MY_REQUESTS.map(req => (
                                                <div key={req.id} className="mt-3 p-4 bg-[#f6f8f6] rounded-xl">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-semibold text-[#0d1b12]">{req.matchTitle}</h4>
                                                        {req.requestsReceived > 0 && (
                                                            <span className="bg-[#13ec5b] text-[#0d1b12] text-xs font-bold px-2 py-0.5 rounded-full">
                                                                {req.requestsReceived} NEW
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-[#6b7c72] mb-3">{req.venue} • {req.dateTime}</p>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex -space-x-2">
                                                                {[...Array(req.playersJoined)].map((_, i) => (
                                                                    <div key={i} className="w-7 h-7 bg-[#13ec5b] rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                                                                        P
                                                                    </div>
                                                                ))}
                                                                {[...Array(req.playersNeeded - req.playersJoined)].map((_, i) => (
                                                                    <div key={i} className="w-7 h-7 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-gray-400 text-xs">
                                                                        ?
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <span className="text-xs text-[#6b7c72]">{req.playersJoined}/{req.playersNeeded} joined</span>
                                                        </div>
                                                        <button className="px-4 py-2 bg-[#0d1b12] text-white text-sm font-medium rounded-lg">
                                                            Manage
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Sent Requests Status */}
                                    <div>
                                        <span className="text-xs font-bold text-[#6b7c72] uppercase tracking-wider">Your Requests</span>
                                        <div className="mt-3 space-y-2">
                                            {SENT_REQUESTS.map(req => (
                                                <div key={req.id} className="flex items-center justify-between p-3 bg-[#f6f8f6] rounded-xl">
                                                    <div>
                                                        <p className="font-medium text-[#0d1b12] text-sm">{req.matchTitle}</p>
                                                        <p className="text-xs text-[#6b7c72]">by {req.creatorName}</p>
                                                    </div>
                                                    {req.status === 'pending' ? (
                                                        <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">Pending</span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-[#e7fceb] text-[#13ec5b] text-xs font-bold rounded-full">Accepted ✓</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Sidebar - Favorites*/}
                            <div className="w-full xl:w-[320px] shrink-0 space-y-6">
                                {/* Favorite Boxes */}
                                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-[#0d1b12]">Favorite Boxes</h3>
                                        <Link to="/favorites" className="text-[#13ec5b] text-sm font-semibold hover:underline">See All</Link>
                                    </div>
                                    <div className="space-y-3">
                                        {FAVORITE_BOXES.slice(0, 3).map(box => (
                                            <Link key={box.id} to={`/box/${box.id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f6f8f6] transition-colors">
                                                <img src={box.image} alt={box.name} className="w-14 h-14 rounded-lg object-cover" />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-[#0d1b12] text-sm truncate">{box.name}</h4>
                                                    <div className="flex items-center gap-2 text-xs text-[#6b7c72]">
                                                        <span className="flex items-center gap-0.5">
                                                            <svg viewBox="0 0 24 24" fill="#fbbf24" className="w-3 h-3">
                                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                            </svg>
                                                            {box.rating}
                                                        </span>
                                                        <span>•</span>
                                                        <span>₹{box.pricePerHour}/hr</span>
                                                    </div>
                                                </div>
                                                <svg viewBox="0 0 24 24" fill="#ef4444" className="w-5 h-5 shrink-0">
                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                </svg>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </main>
            </div>

        </div>
    );
};

export default Dashboard;
