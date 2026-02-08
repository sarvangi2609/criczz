import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';

// Import images
import boxIndoor from '../../assets/box_indoor.png';

// Static Owner Data
const OWNER_DATA = {
    name: "Rajesh Patel",
    boxName: "The Lords Box Cricket",
    avatar: boxIndoor,
    phone: "+91 98765 43210",
    location: "Vesu, Surat",
};

// Time Slots Configuration
const TIME_SLOTS = [
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
];

// Sample Bookings Data
const INITIAL_BOOKINGS = [
    { id: 1, date: '2026-01-27', slot: '06:00 PM', customerName: 'Rahul Shah', phone: '+91 99887 76655', type: 'online', status: 'confirmed', amount: 1200 },
    { id: 2, date: '2026-01-27', slot: '07:00 PM', customerName: 'Meet Patel', phone: '+91 88776 65544', type: 'offline', status: 'confirmed', amount: 1200 },
    { id: 3, date: '2026-01-27', slot: '08:00 PM', customerName: 'Kiran Modi', phone: '+91 77665 54433', type: 'online', status: 'pending', amount: 1200 },
    { id: 4, date: '2026-01-28', slot: '09:00 AM', customerName: 'Vijay Kumar', phone: '+91 66554 43322', type: 'offline', status: 'confirmed', amount: 1200 },
];

// Stats
const STATS = {
    todayBookings: 8,
    todayRevenue: 9600,
    monthlyBookings: 156,
    monthlyRevenue: 187200,
    onlineBookings: 112,
    offlineBookings: 44,
};

// Owner Menu Items
const OWNER_MENU = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z' },
    { id: 'bookings', label: 'All Bookings', icon: 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z' },
    { id: 'calendar', label: 'Slot Calendar', icon: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z' },
    { id: 'offline', label: 'Add Offline Booking', icon: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z', highlight: true },
    { id: 'revenue', label: 'Revenue Report', icon: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z' },
    { id: 'settings', label: 'Box Settings', icon: 'M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58z' },
];

const OwnerDashboard = () => {
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
    const [showOfflineModal, setShowOfflineModal] = useState(false);
    const [offlineForm, setOfflineForm] = useState({ customerName: '', phone: '', date: selectedDate, slot: '' });

    // Get dates for next 7 days
    const getDates = () => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            return {
                full: date.toISOString().split('T')[0],
                day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
                date: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'short' }),
            };
        });
    };

    // Get bookings for selected date
    const getBookingsForDate = (date) => bookings.filter(b => b.date === date);

    // Get booked slots for selected date
    const getBookedSlots = (date) => bookings.filter(b => b.date === date).map(b => b.slot);

    // Check if slot is booked
    const isSlotBooked = (slot) => getBookedSlots(selectedDate).includes(slot);

    // Get booking for a slot
    const getBookingForSlot = (slot) => bookings.find(b => b.date === selectedDate && b.slot === slot);

    // Add offline booking
    const handleAddOfflineBooking = () => {
        if (!offlineForm.customerName || !offlineForm.phone || !offlineForm.slot) {
            alert('Please fill all fields');
            return;
        }
        const newBooking = {
            id: Date.now(),
            date: offlineForm.date,
            slot: offlineForm.slot,
            customerName: offlineForm.customerName,
            phone: offlineForm.phone,
            type: 'offline',
            status: 'confirmed',
            amount: 1200,
        };
        setBookings([...bookings, newBooking]);
        setShowOfflineModal(false);
        setOfflineForm({ customerName: '', phone: '', date: selectedDate, slot: '' });
    };

    // Cancel booking
    const handleCancelBooking = (id) => {
        if (confirm('Are you sure you want to cancel this booking?')) {
            setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
        }
    };

    // Today's bookings
    const todayBookings = getBookingsForDate(new Date().toISOString().split('T')[0]);

    return (
        <div className="min-h-screen bg-[#f6f8f6]">
            <Header />

            <div className="flex">
                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden fixed bottom-6 left-6 z-50 w-14 h-14 bg-[#13ec5b] rounded-full flex items-center justify-center shadow-lg"
                >
                    <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                        {isSidebarOpen ? (
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        ) : (
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                        )}
                    </svg>
                </button>

                {/* Overlay */}
                {isSidebarOpen && (
                    <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsSidebarOpen(false)} />
                )}

                {/* Sidebar */}
                <aside className={`fixed left-0 z-40 w-[260px] h-[calc(100vh-73px)] top-[73px] bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                    {/* Owner Profile */}
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#102216] to-[#0d1b12]">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#13ec5b]">
                                <img src={OWNER_DATA.avatar} alt={OWNER_DATA.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">{OWNER_DATA.name}</h3>
                                <p className="text-xs text-[#13ec5b] font-medium">Box Owner</p>
                            </div>
                        </div>
                        <div className="mt-3 px-3 py-2 bg-white/10 rounded-lg">
                            <p className="text-white text-sm font-medium">{OWNER_DATA.boxName}</p>
                            <p className="text-white/70 text-xs">{OWNER_DATA.location}</p>
                        </div>
                    </div>

                    {/* Menu */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <ul className="space-y-1">
                            {OWNER_MENU.map(item => (
                                <li key={item.id}>
                                    <button
                                        onClick={() => {
                                            if (item.id === 'offline') {
                                                setShowOfflineModal(true);
                                            } else {
                                                setActiveMenu(item.id);
                                            }
                                            setIsSidebarOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.highlight
                                                ? 'bg-[#13ec5b] text-[#0d1b12] font-semibold'
                                                : activeMenu === item.id
                                                    ? 'bg-[#e7fceb] text-[#0d1b12] font-semibold'
                                                    : 'text-[#6b7c72] hover:bg-[#f6f8f6]'
                                            }`}
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d={item.icon} />
                                        </svg>
                                        <span className="text-sm">{item.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-100">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                            </svg>
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-h-[calc(100vh-73px)] lg:ml-[260px]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d1b12]">Owner Dashboard 🏏</h1>
                                <p className="text-[#6b7c72]">Manage your box bookings and revenue</p>
                            </div>
                            <button
                                onClick={() => setShowOfflineModal(true)}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#13ec5b] text-[#0d1b12] font-bold rounded-xl hover:shadow-lg hover:shadow-[#13ec5b]/30 transition-all"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                </svg>
                                Add Offline Booking
                            </button>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#13ec5b] transition-all">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-[#e7fceb] rounded-xl flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-5 h-5">
                                            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-[#6b7c72]">Today</span>
                                </div>
                                <p className="text-3xl font-extrabold text-[#0d1b12]">{STATS.todayBookings}</p>
                                <p className="text-xs text-[#6b7c72]">bookings</p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#13ec5b] transition-all">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="#22c55e" className="w-5 h-5">
                                            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-[#6b7c72]">Today Revenue</span>
                                </div>
                                <p className="text-3xl font-extrabold text-[#0d1b12]">₹{STATS.todayRevenue.toLocaleString()}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-400 transition-all">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="#3b82f6" className="w-5 h-5">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-[#6b7c72]">Online</span>
                                </div>
                                <p className="text-3xl font-extrabold text-[#0d1b12]">{STATS.onlineBookings}</p>
                                <p className="text-xs text-blue-500">this month</p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-orange-400 transition-all">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="#f97316" className="w-5 h-5">
                                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-[#6b7c72]">Offline</span>
                                </div>
                                <p className="text-3xl font-extrabold text-[#0d1b12]">{STATS.offlineBookings}</p>
                                <p className="text-xs text-orange-500">this month</p>
                            </div>
                        </div>

                        {/* Date Selector */}
                        <div className="bg-white rounded-2xl p-5 mb-6 border border-gray-100">
                            <h3 className="font-bold text-[#0d1b12] mb-4">Select Date</h3>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {getDates().map(d => (
                                    <button
                                        key={d.full}
                                        onClick={() => setSelectedDate(d.full)}
                                        className={`flex-shrink-0 w-16 py-3 rounded-xl text-center transition-all ${selectedDate === d.full
                                                ? 'bg-[#13ec5b] text-[#0d1b12]'
                                                : 'bg-[#f6f8f6] text-[#6b7c72] hover:bg-gray-200'
                                            }`}
                                    >
                                        <div className="text-[10px] font-medium">{d.day}</div>
                                        <div className="text-xl font-bold">{d.date}</div>
                                        <div className="text-[10px]">{d.month}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Slot Grid */}
                        <div className="bg-white rounded-2xl p-5 mb-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-[#0d1b12]">Slot Availability</h3>
                                <div className="flex items-center gap-4 text-xs">
                                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#13ec5b] rounded"></span> Available</span>
                                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded"></span> Online</span>
                                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded"></span> Offline</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                {TIME_SLOTS.map(slot => {
                                    const booking = getBookingForSlot(slot);
                                    const isBooked = !!booking;
                                    return (
                                        <div
                                            key={slot}
                                            className={`p-3 rounded-xl text-center cursor-pointer transition-all ${isBooked
                                                    ? booking.type === 'online'
                                                        ? 'bg-blue-100 border-2 border-blue-500'
                                                        : 'bg-orange-100 border-2 border-orange-500'
                                                    : 'bg-[#e7fceb] border-2 border-[#13ec5b] hover:shadow-md'
                                                }`}
                                            onClick={() => {
                                                if (!isBooked) {
                                                    setOfflineForm({ ...offlineForm, slot, date: selectedDate });
                                                    setShowOfflineModal(true);
                                                }
                                            }}
                                        >
                                            <div className={`text-sm font-bold ${isBooked ? (booking.type === 'online' ? 'text-blue-700' : 'text-orange-700') : 'text-[#0d1b12]'}`}>
                                                {slot}
                                            </div>
                                            {isBooked && (
                                                <div className={`text-[10px] mt-1 truncate ${booking.type === 'online' ? 'text-blue-600' : 'text-orange-600'}`}>
                                                    {booking.customerName}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Today's Bookings List */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100">
                            <h3 className="font-bold text-[#0d1b12] mb-4">
                                Bookings for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </h3>
                            <div className="space-y-3">
                                {getBookingsForDate(selectedDate).length > 0 ? (
                                    getBookingsForDate(selectedDate).map(booking => (
                                        <div key={booking.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl ${booking.status === 'cancelled' ? 'bg-red-50 opacity-60' : 'bg-[#f6f8f6]'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${booking.type === 'online' ? 'bg-blue-100' : 'bg-orange-100'}`}>
                                                    <svg viewBox="0 0 24 24" fill={booking.type === 'online' ? '#3b82f6' : '#f97316'} className="w-6 h-6">
                                                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#0d1b12]">{booking.slot}</p>
                                                    <p className="text-sm text-[#6b7c72]">{booking.customerName} • {booking.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${booking.type === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {booking.type.toUpperCase()}
                                                </span>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${booking.status === 'confirmed' ? 'bg-[#e7fceb] text-[#13ec5b]' :
                                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-600'
                                                    }`}>
                                                    {booking.status.toUpperCase()}
                                                </span>
                                                <span className="font-bold text-[#13ec5b]">₹{booking.amount}</span>
                                                {booking.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => handleCancelBooking(booking.id)}
                                                        className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-[#f6f8f6] rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg viewBox="0 0 24 24" fill="#6b7c72" className="w-8 h-8">
                                                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                                            </svg>
                                        </div>
                                        <h4 className="font-bold text-[#0d1b12] mb-1">No Bookings</h4>
                                        <p className="text-sm text-[#6b7c72]">No bookings for this date</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Offline Booking Modal */}
            {showOfflineModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#0d1b12]">Add Offline Booking</h3>
                            <button onClick={() => setShowOfflineModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <svg viewBox="0 0 24 24" fill="#6b7c72" className="w-5 h-5">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#0d1b12] mb-1">Customer Name *</label>
                                <input
                                    type="text"
                                    value={offlineForm.customerName}
                                    onChange={(e) => setOfflineForm({ ...offlineForm, customerName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#13ec5b]"
                                    placeholder="Enter customer name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#0d1b12] mb-1">Phone Number *</label>
                                <input
                                    type="tel"
                                    value={offlineForm.phone}
                                    onChange={(e) => setOfflineForm({ ...offlineForm, phone: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#13ec5b]"
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#0d1b12] mb-1">Date</label>
                                <input
                                    type="date"
                                    value={offlineForm.date}
                                    onChange={(e) => setOfflineForm({ ...offlineForm, date: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#13ec5b]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#0d1b12] mb-1">Select Slot *</label>
                                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                                    {TIME_SLOTS.filter(slot => !getBookedSlots(offlineForm.date).includes(slot)).map(slot => (
                                        <button
                                            key={slot}
                                            onClick={() => setOfflineForm({ ...offlineForm, slot })}
                                            className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${offlineForm.slot === slot
                                                    ? 'bg-[#13ec5b] text-[#0d1b12]'
                                                    : 'bg-[#f6f8f6] text-[#6b7c72] hover:bg-gray-200'
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowOfflineModal(false)}
                                    className="flex-1 py-3 border-2 border-gray-200 text-[#6b7c72] font-semibold rounded-xl hover:border-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddOfflineBooking}
                                    className="flex-1 py-3 bg-[#13ec5b] text-[#0d1b12] font-bold rounded-xl hover:shadow-lg hover:shadow-[#13ec5b]/30"
                                >
                                    Add Booking
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerDashboard;
