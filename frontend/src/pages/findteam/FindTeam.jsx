import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Import images
import boxIndoor from '../../assets/box_indoor.png';
import boxOutdoor from '../../assets/box_outdoor.png';
import boxPremium from '../../assets/box_premium.png';
import boxNetted from '../../assets/box_netted.png';

// Static match data - Will come from API
const OPEN_MATCHES = [
    {
        id: 1,
        title: "Sunday Morning Slog",
        image: boxIndoor,
        pricePerPlayer: 150,
        venue: "Lords Box, Vesu",
        dateTime: "Sunday, Oct 22 • 08:00 AM",
        skillLevel: "Professional / Intermediate",
        slotsLeft: 4,
        creatorId: "user_1",
    },
    {
        id: 2,
        title: "Night Owls T20",
        image: boxOutdoor,
        pricePerPlayer: 200,
        venue: "The Cage, Adajan",
        dateTime: "Tonight • 09:30 PM",
        skillLevel: "Casual / Beginners",
        slotsLeft: 1,
        creatorId: "user_2",
    },
    {
        id: 3,
        title: "Corporate Clash",
        image: boxNetted,
        pricePerPlayer: 100,
        venue: "Power Play, Varachha",
        dateTime: "Saturday • 07:00 PM",
        skillLevel: "Mix Skills",
        slotsLeft: 6,
        creatorId: "user_3",
    },
    {
        id: 4,
        title: "Weekend Warriors",
        image: boxPremium,
        pricePerPlayer: 180,
        venue: "Surat Arena, Piplod",
        dateTime: "Sunday • 06:00 AM",
        skillLevel: "Intermediate",
        slotsLeft: 2,
        creatorId: "user_4",
    },
];

// Static incoming requests
const INCOMING_REQUESTS = [
    {
        id: 1,
        name: "Hardik Patel",
        avatar: "H",
        matchTitle: "Sunday Slog",
    },
    {
        id: 2,
        name: "Karan Shah",
        avatar: "K",
        matchTitle: "Sunday Slog",
    },
];


const AREAS = [
    { id: 'all', name: 'All Areas' },
    { id: 'vesu', name: 'Vesu' },
    { id: 'adajan', name: 'Adajan' },
    { id: 'piplod', name: 'Piplod' },
    { id: 'varachha', name: 'Varachha' },
];

const FindTeam = () => {
    const [selectedArea, setSelectedArea] = useState('all');
    const [requests, setRequests] = useState(INCOMING_REQUESTS);
    // const [chatMessage, setChatMessage] = useState('');
    // const [messages, setMessages] = useState(CHAT_MESSAGES);

    // These would come from user's actual data/API
    const [hasCreatedMatch, setHasCreatedMatch] = useState(true); // User has created a match
    const [hasActiveTeam, setHasActiveTeam] = useState(true); // User is part of a team

    const handleAcceptRequest = (requestId) => {
        // In real app, this would call API
        setRequests(requests.filter(r => r.id !== requestId));
        console.log('Accepted request:', requestId);
    };

    const handleRejectRequest = (requestId) => {
        setRequests(requests.filter(r => r.id !== requestId));
        console.log('Rejected request:', requestId);
    };



    return (
        <div className="min-h-screen bg-[#f6f8f6]">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Main Content - Match Listings */}
                    <div className="flex-1">
                        {/* Page Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d1b12] mb-2">Find Your Team</h1>
                            <p className="text-[#6b7c72]">Join open matches in your favorite Surat boxes or recruit players for your next session.</p>
                        </div>

                        {/* Area Filters */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {AREAS.map(area => (
                                <button
                                    key={area.id}
                                    onClick={() => setSelectedArea(area.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedArea === area.id
                                        ? 'bg-[#0d1b12] text-white'
                                        : 'bg-white border border-gray-200 text-[#6b7c72] hover:border-[#13ec5b]'
                                        }`}
                                >
                                    {area.name}
                                    {area.id !== 'all' && (
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 inline-block ml-1">
                                            <path d="M7 10l5 5 5-5z" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Section Title */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-6 bg-[#13ec5b] rounded-full"></div>
                            <h2 className="text-lg font-bold text-[#0d1b12]">Live Matches Seeking Players</h2>
                        </div>

                        {/* Match Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {OPEN_MATCHES.map(match => (
                                <div key={match.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#13ec5b] hover:shadow-lg hover:shadow-[#13ec5b]/10 transition-all">
                                    {/* Match Image */}
                                    <div className="relative h-36">
                                        <img src={match.image} alt={match.title} className="w-full h-full object-cover" />
                                        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase ${match.slotsLeft === 1
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-[#13ec5b] text-[#0d1b12]'
                                            }`}>
                                            {match.slotsLeft === 1 ? 'Last Spot!' : `${match.slotsLeft} Slots Left`}
                                        </span>
                                    </div>

                                    {/* Match Details */}
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-[#0d1b12] text-lg">{match.title}</h3>
                                            <span className="text-[#13ec5b] font-bold">₹{match.pricePerPlayer}<span className="text-xs font-normal text-[#6b7c72]">/pp</span></span>
                                        </div>

                                        <div className="space-y-1.5 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-[#6b7c72]">
                                                <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-4 h-4">
                                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                                </svg>
                                                {match.venue}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-[#6b7c72]">
                                                <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-4 h-4">
                                                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
                                                </svg>
                                                {match.dateTime}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-[#6b7c72]">
                                                <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-4 h-4">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                </svg>
                                                {match.skillLevel}
                                            </div>
                                        </div>

                                        <button className="w-full py-2.5 border-2 border-[#13ec5b] text-[#0d1b12] font-semibold rounded-xl hover:bg-[#13ec5b] hover:text-white transition-colors">
                                            Request to Join
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Create Match CTA */}
                        <div className="mt-6 p-6 bg-gradient-to-r from-[#102216] to-[#0d1b12] rounded-2xl text-center">
                            <h3 className="text-white font-bold text-lg mb-2">Can't find a match?</h3>
                            <p className="text-white/70 text-sm mb-4">Create your own and let players come to you!</p>
                            <Link to="/create-match" className="inline-flex items-center gap-2 px-6 py-3 bg-[#13ec5b] text-[#0d1b12] font-bold rounded-xl hover:shadow-lg hover:shadow-[#13ec5b]/40 transition-all">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                </svg>
                                Create Match
                            </Link>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-full lg:w-[360px] shrink-0 space-y-6">

                        {/* Incoming Requests */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-[#0d1b12] uppercase text-sm tracking-wider">Incoming Requests</h3>
                                {requests.length > 0 && (
                                    <span className="bg-[#13ec5b] text-[#0d1b12] text-xs font-bold px-2 py-0.5 rounded-full">
                                        {requests.length} NEW
                                    </span>
                                )}
                            </div>

                            {!hasCreatedMatch ? (
                                // No match created - Show prompt to create
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-[#f6f8f6] rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg viewBox="0 0 24 24" fill="#6b7c72" className="w-8 h-8">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-[#6b7c72] mb-3">Create a match to receive join requests from players</p>
                                    <Link to="/create-match" className="inline-flex items-center gap-1 text-sm font-semibold text-[#13ec5b] hover:underline">
                                        Create Match
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            ) : requests.length === 0 ? (
                                // Match created but no requests yet
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-[#e7fceb] rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-8 h-8">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-[#0d1b12] mb-1">You're all caught up!</p>
                                    <p className="text-xs text-[#6b7c72]">No pending requests at the moment</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {requests.map(request => (
                                        <div key={request.id} className="p-3 bg-[#f6f8f6] rounded-xl">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-[#13ec5b] rounded-full flex items-center justify-center text-white font-bold">
                                                    {request.avatar}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-[#0d1b12]">{request.name}</p>
                                                    <p className="text-xs text-[#6b7c72]">Requested for <span className="text-[#13ec5b] font-medium">{request.matchTitle}</span></p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAcceptRequest(request.id)}
                                                    className="flex-1 py-2 bg-[#13ec5b] text-[#0d1b12] font-semibold rounded-lg text-sm hover:bg-[#0fd650] transition-colors"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleRejectRequest(request.id)}
                                                    className="flex-1 py-2 bg-white border border-gray-200 text-[#6b7c72] font-semibold rounded-lg text-sm hover:border-red-300 hover:text-red-500 transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                        {/* Map Preview */}
                        <div className="bg-gray-300 rounded-2xl h-48 relative overflow-hidden group cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute bottom-4 left-4">
                                <p className="text-white text-xs font-medium mb-1">Surat Box Hotspots</p>
                                <p className="text-white/70 text-[10px]">Tap to explore nearby venues</p>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="w-8 h-8 bg-[#13ec5b] rounded-full flex items-center justify-center animate-pulse">
                                    <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
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

export default FindTeam;
