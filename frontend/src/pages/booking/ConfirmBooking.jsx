import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ConfirmBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { box, selectedDate, selectedSlot } = location.state || {};

    // Redirect if no booking data
    useEffect(() => {
        if (!box || !selectedDate || !selectedSlot) {
            navigate('/boxes');
        }
    }, [box, selectedDate, selectedSlot, navigate]);

    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [duration, setDuration] = useState(1.0);
    const [playerMatching, setPlayerMatching] = useState(true);

    // Timer logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return {
            mins: mins.toString().padStart(2, '0'),
            secs: secs.toString().padStart(2, '0')
        };
    };

    const timeString = formatTime(timeLeft);

    // Format date for display
    const formatDisplayDate = (isoString) => {
        if (!isoString) return { day: '', full: '' };
        const date = new Date(isoString);
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Calculate end time based on duration
    const calculateEndTime = (startSlot, hours) => {
        if (!startSlot) return '';
        const [time, period] = startSlot.split(' ');
        let [hourNum] = time.split(':').map(Number);

        if (period === 'PM' && hourNum !== 12) hourNum += 12;
        if (period === 'AM' && hourNum === 12) hourNum = 0;

        hourNum += hours;

        const endPeriod = hourNum >= 12 && hourNum < 24 ? 'PM' : 'AM';
        if (hourNum >= 24) hourNum -= 24;
        if (hourNum > 12) hourNum -= 12;
        if (hourNum === 0) hourNum = 12;

        return `${hourNum.toString().padStart(2, '0')}:00 ${endPeriod}`;
    };

    // Pricing calculation
    const baseRate = box?.pricePerHour || 1200;
    const rentalFee = baseRate * duration;
    const matchingFee = playerMatching ? 150.00 : 0;
    const taxes = (rentalFee + matchingFee) * 0.18; // 18% GST
    const totalAmount = rentalFee + matchingFee + taxes;

    if (!box) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-[#f6f8f6]">
            <Header />

            {/* Breadcrumb & Header */}
            <div className="bg-[#f6f8f6] py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <nav className="flex items-center gap-2 text-sm text-[#6b7c72] mb-4">
                        <Link to="/" className="flex items-center gap-1 hover:text-[#13ec5b] transition-colors">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                            </svg>
                            Home
                        </Link>
                        <span>/</span>
                        <Link to="/boxes" className="hover:text-[#13ec5b] transition-colors">Surat Boxes</Link>
                        <span>/</span>
                        <span className="text-[#6b7c72]">Confirm Booking</span>
                    </nav>

                    <h1 className="text-3xl font-extrabold text-[#0d1b12] mb-2 font-display">Confirm Your Booking</h1>
                    <p className="text-[#6b7c72]">Review your slot and finalize the match details for {box.name}.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Column - Main Details */}
                    <div className="flex-1 space-y-6">

                        {/* Timer Alert */}
                        <div className="bg-[#e7fceb] border border-[#13ec5b]/30 rounded-2xl p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#13ec5b] flex items-center justify-center text-white">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="font-semibold text-[#0d1b12]">Slot held for you</span>
                            </div>
                            <div className="flex bg-white px-3 py-1.5 rounded-lg shadow-sm border border-green-100">
                                <div className="text-center px-2 border-r border-gray-100">
                                    <span className="block text-xl font-bold text-[#0d1b12] leading-none">{timeString.mins}</span>
                                    <span className="text-[10px] text-[#6b7c72] font-medium">MIN</span>
                                </div>
                                <div className="text-center px-2">
                                    <span className="block text-xl font-bold text-[#0d1b12] leading-none">{timeString.secs}</span>
                                    <span className="text-[10px] text-[#6b7c72] font-medium">SEC</span>
                                </div>
                            </div>
                        </div>

                        {/* Venue Card */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                            <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                                <img src={box.image} alt={box.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <span className="text-[#13ec5b] text-xs font-bold tracking-wider uppercase mb-1">Selected Venue</span>
                                <h3 className="text-xl font-bold text-[#0d1b12] mb-1">{box.name}</h3>
                                <p className="text-[#6b7c72] text-sm flex items-center gap-1 mb-4">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#6b7c72]">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                    {box.fullAddress || box.location}
                                </p>
                                <div className="flex flex-wrap gap-8 pt-4 border-t border-gray-100">
                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-[#6b7c72] tracking-wider block mb-0.5">Date</span>
                                        <span className="font-bold text-[#0d1b12]">{formatDisplayDate(selectedDate)}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-[#6b7c72] tracking-wider block mb-0.5">Slot</span>
                                        <span className="font-bold text-[#0d1b12]">{selectedSlot} - {calculateEndTime(selectedSlot, duration)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Match Duration */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="flex items-center gap-2 font-bold text-[#0d1b12] mb-4">
                                <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-5 h-5">
                                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                </svg>
                                Select Match Duration
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                {[1.0, 1.5, 2.0].map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setDuration(d)}
                                        className={`py-4 rounded-xl border-2 transition-all text-center ${duration === d
                                                ? 'border-[#13ec5b] bg-green-50 text-[#0d1b12]'
                                                : 'border-gray-100 text-[#6b7c72] hover:border-gray-300'
                                            }`}
                                    >
                                        <span className="block text-2xl font-bold">{d}</span>
                                        <span className="text-xs font-medium uppercase">{d === 1 ? 'Hour' : 'Hours'}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Player Matching */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#0d1b12] text-lg">Enable Player Matching</h3>
                                    <p className="text-sm text-[#6b7c72]">Short on players? We'll help you find teammates in {box.location} area to join your match.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPlayerMatching(!playerMatching)}
                                className={`w-14 h-8 rounded-full transition-colors relative ${playerMatching ? 'bg-[#13ec5b]' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform shadow-md ${playerMatching ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="w-full lg:w-[400px] shrink-0 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-extrabold text-[#0d1b12] text-xl mb-6">Booking Summary</h3>

                            <div className="space-y-4 mb-6 border-b border-gray-100 pb-6">
                                <div className="flex justify-between text-sm font-medium text-[#6b7c72]">
                                    <span>Box Rental ({duration} Hr)</span>
                                    <span className="text-[#0d1b12]">₹{rentalFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-[#6b7c72]">
                                    <span>Player Matching Fee</span>
                                    <div className="text-right">
                                        <span className="text-[#0d1b12] block">₹{matchingFee.toFixed(2)}</span>
                                        {!playerMatching && <span className="text-[10px] text-orange-500">Disabled</span>}
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-[#6b7c72]">
                                    <span>Taxes & GST (18%)</span>
                                    <span className="text-[#0d1b12]">₹{taxes.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-6">
                                <span className="text-sm font-bold text-[#6b7c72] uppercase tracking-wider">Total Amount</span>
                                <span className="text-3xl font-extrabold text-[#0d1b12]">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>

                            <div className="flex items-center gap-2 mb-6">
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Fully Refundable</span>
                            </div>

                            <button className="w-full py-4 bg-[#13ec5b] hover:bg-[#0fd650] text-[#0d1b12] font-bold text-lg rounded-xl transition-colors mb-3 flex items-center justify-center gap-2 shadow-lg shadow-[#13ec5b]/20">
                                Confirm Booking
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                            <button className="w-full py-4 bg-[#f3f4f6] hover:bg-gray-200 text-[#6b7c72] font-bold text-lg rounded-xl transition-colors">
                                Save for Later
                            </button>

                            <div className="mt-6 flex gap-3 p-3 bg-blue-50 rounded-xl">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-400 shrink-0">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                </svg>
                                <p className="text-[11px] leading-relaxed text-[#6b7c72]">
                                    By confirming, you agree to the Arena Rules and our Cancellation Policy. Bookings can be cancelled up to 4 hours before the slot for a full refund.
                                </p>
                            </div>
                        </div>

                        {/* Map Block */}
                        <div className="bg-gray-400 rounded-2xl h-48 w-full overflow-hidden relative group cursor-pointer">
                            {/* Placeholder for map */}
                            <div className="absolute inset-0 bg-gray-500 mix-blend-multiply opacity-50"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 group-hover:scale-105 transition-transform">
                                    <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-5 h-5">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                    <span className="font-bold text-[#0d1b12] text-sm">Open in Maps</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ConfirmBooking;
