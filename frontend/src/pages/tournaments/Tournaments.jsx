import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Import images
import boxIndoor from '../../assets/box_indoor.png';
import boxOutdoor from '../../assets/box_outdoor.png';
import boxPremium from '../../assets/box_premium.png';
import boxNetted from '../../assets/box_netted.png';

// Tournament Types
const TOURNAMENT_TYPES = [
    { id: 'all', name: 'All Tournaments' },
    { id: 'upcoming', name: 'Upcoming' },
    { id: 'ongoing', name: 'Live Now' },
    { id: 'completed', name: 'Completed' },
];

// Format Filter
const FORMATS = [
    { id: 'all', name: 'All Formats' },
    { id: 'knockout', name: 'Knockout' },
    { id: 'league', name: 'League' },
    { id: 'league-knockout', name: 'League + Knockout' },
];

// Static Tournament Data
const TOURNAMENTS = [
    {
        id: 1,
        name: "Surat Premier League 2026",
        image: boxPremium,
        status: "upcoming",
        format: "league-knockout",
        entryFee: 5000,
        prizePool: 50000,
        teams: { registered: 12, max: 16 },
        overs: 8,
        playersPerTeam: 6,
        venue: "Surat Sports Hub, Piplod",
        startDate: "2026-02-01",
        endDate: "2026-02-15",
        registrationDeadline: "2026-01-30",
        organizer: "Criczz Sports",
        description: "The biggest box cricket tournament in Surat! League stage followed by knockout rounds.",
        features: ["Live Streaming", "Professional Umpires", "Trophy + Medals", "Man of the Match Awards"],
    },
    {
        id: 2,
        name: "Night Knockout Challenge",
        image: boxNetted,
        status: "ongoing",
        format: "knockout",
        entryFee: 2000,
        prizePool: 20000,
        teams: { registered: 8, max: 8 },
        overs: 6,
        playersPerTeam: 6,
        venue: "The Cage, Adajan",
        startDate: "2026-01-24",
        endDate: "2026-01-26",
        registrationDeadline: "2026-01-23",
        organizer: "Adajan Cricket Club",
        description: "Fast-paced knockout tournament under floodlights. One loss and you're out!",
        features: ["Night Matches", "Refreshments", "Trophies"],
        currentMatch: {
            team1: "Thunder XI",
            team2: "Vesu Warriors",
            score1: "78/4",
            score2: "45/2",
            overs2: "4.2",
            stage: "Semi Final 1"
        }
    },
    {
        id: 3,
        name: "Corporate Cricket Cup",
        image: boxIndoor,
        status: "upcoming",
        format: "league",
        entryFee: 8000,
        prizePool: 75000,
        teams: { registered: 6, max: 10 },
        overs: 10,
        playersPerTeam: 8,
        venue: "Lords Box Cricket, Vesu",
        startDate: "2026-02-10",
        endDate: "2026-02-20",
        registrationDeadline: "2026-02-05",
        organizer: "Surat Corporate League",
        description: "Exclusive tournament for corporate teams. Network while you play!",
        features: ["Corporate Teams Only", "Networking Event", "Premium Prizes", "Dinner Included"],
    },
    {
        id: 4,
        name: "Weekend Warriors Cup",
        image: boxOutdoor,
        status: "completed",
        format: "knockout",
        entryFee: 1500,
        prizePool: 15000,
        teams: { registered: 16, max: 16 },
        overs: 6,
        playersPerTeam: 6,
        venue: "Power Play Arena, Varachha",
        startDate: "2026-01-18",
        endDate: "2026-01-19",
        registrationDeadline: "2026-01-17",
        organizer: "Varachha Sports Club",
        description: "Weekend knockout tournament for amateur players.",
        features: ["2-Day Event", "Medals for All"],
        winner: "Varachha Tigers",
        runnerUp: "City Strikers",
    },
    {
        id: 5,
        name: "Monsoon Madness T6",
        image: boxNetted,
        status: "upcoming",
        format: "knockout",
        entryFee: 2500,
        prizePool: 25000,
        teams: { registered: 4, max: 12 },
        overs: 6,
        playersPerTeam: 6,
        venue: "Indoor Arena, Citylight",
        startDate: "2026-02-08",
        endDate: "2026-02-09",
        registrationDeadline: "2026-02-06",
        organizer: "Citylight Cricket Academy",
        description: "Quick-fire T6 format. Maximum action, minimum time!",
        features: ["T6 Format", "Quick Matches", "Cash Prizes"],
    },
];

// Format display names
const FORMAT_LABELS = {
    'knockout': 'Knockout',
    'league': 'League',
    'league-knockout': 'League + KO',
};

const Tournaments = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [formatFilter, setFormatFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter tournaments
    const filteredTournaments = TOURNAMENTS.filter(tournament => {
        const matchesStatus = activeFilter === 'all' || tournament.status === activeFilter;
        const matchesFormat = formatFilter === 'all' || tournament.format === formatFilter;
        const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tournament.venue.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesFormat && matchesSearch;
    });

    // Get status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'upcoming':
                return <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full uppercase">Upcoming</span>;
            case 'ongoing':
                return (
                    <span className="px-3 py-1 bg-[#13ec5b] text-[#0d1b12] text-xs font-bold rounded-full uppercase flex items-center gap-1">
                        <span className="w-2 h-2 bg-[#0d1b12] rounded-full animate-pulse"></span>
                        Live Now
                    </span>
                );
            case 'completed':
                return <span className="px-3 py-1 bg-gray-100 text-[#6b7c72] text-xs font-bold rounded-full uppercase">Completed</span>;
            default:
                return null;
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    // Calculate days left
    const getDaysLeft = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return 'Closed';
        if (diffDays === 0) return 'Last Day!';
        if (diffDays === 1) return '1 day left';
        return `${diffDays} days left`;
    };

    return (
        <div className="min-h-screen bg-[#f6f8f6]">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#102216] to-[#0d1b12] py-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#13ec5b]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#13ec5b]/5 rounded-full blur-2xl"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                                🏆 Box Cricket Tournaments
                            </h1>
                            <p className="text-white/70 max-w-xl">
                                Join exciting tournaments in Surat. Compete with teams, win prizes, and become the champion!
                            </p>
                        </div>
                        <Link
                            to="/organize-tournament"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#13ec5b] text-[#0d1b12] font-bold rounded-xl hover:shadow-lg hover:shadow-[#13ec5b]/30 transition-all whitespace-nowrap"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                            Organize Tournament
                        </Link>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-[#13ec5b]">{TOURNAMENTS.filter(t => t.status === 'upcoming').length}</p>
                            <p className="text-white/70 text-sm">Upcoming</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-[#13ec5b]">{TOURNAMENTS.filter(t => t.status === 'ongoing').length}</p>
                            <p className="text-white/70 text-sm">Live Now</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-[#13ec5b]">₹{(TOURNAMENTS.reduce((sum, t) => sum + t.prizePool, 0) / 1000).toFixed(0)}K+</p>
                            <p className="text-white/70 text-sm">Total Prizes</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-[#13ec5b]">{TOURNAMENTS.reduce((sum, t) => sum + t.teams.registered, 0)}+</p>
                            <p className="text-white/70 text-sm">Teams Playing</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white border-b border-gray-100 sticky top-[73px] z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Status Filters */}
                        <div className="flex flex-wrap gap-2">
                            {TOURNAMENT_TYPES.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setActiveFilter(type.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === type.id
                                            ? 'bg-[#0d1b12] text-white'
                                            : 'bg-[#f6f8f6] text-[#6b7c72] hover:bg-[#e7fceb] hover:text-[#0d1b12]'
                                        }`}
                                >
                                    {type.name}
                                    {type.id === 'ongoing' && TOURNAMENTS.some(t => t.status === 'ongoing') && (
                                        <span className="ml-1.5 w-2 h-2 bg-[#13ec5b] rounded-full inline-block animate-pulse"></span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Search & Format Filter */}
                        <div className="flex gap-3">
                            <div className="relative flex-1 lg:w-64">
                                <svg viewBox="0 0 24 24" fill="#6b7c72" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2">
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search tournaments..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#13ec5b] focus:outline-none transition-colors"
                                />
                            </div>
                            <select
                                value={formatFilter}
                                onChange={(e) => setFormatFilter(e.target.value)}
                                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#0d1b12] bg-white focus:border-[#13ec5b] focus:outline-none cursor-pointer"
                            >
                                {FORMATS.map(format => (
                                    <option key={format.id} value={format.id}>{format.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tournament Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Live Tournament Banner */}
                {activeFilter !== 'completed' && TOURNAMENTS.some(t => t.status === 'ongoing') && (
                    <div className="mb-8">
                        {TOURNAMENTS.filter(t => t.status === 'ongoing').map(tournament => (
                            <div key={tournament.id} className="bg-gradient-to-r from-[#13ec5b] to-[#0fd650] rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                                        <span className="text-[#0d1b12] font-bold uppercase tracking-wider text-sm">Live Match</span>
                                    </div>
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-[#0d1b12] mb-1">{tournament.name}</h3>
                                            <p className="text-[#0d1b12]/70 text-sm">{tournament.currentMatch?.stage} • {tournament.venue}</p>
                                        </div>
                                        {tournament.currentMatch && (
                                            <div className="flex items-center gap-6 bg-white/20 backdrop-blur rounded-xl px-6 py-4">
                                                <div className="text-center">
                                                    <p className="font-bold text-[#0d1b12]">{tournament.currentMatch.team1}</p>
                                                    <p className="text-2xl font-extrabold text-[#0d1b12]">{tournament.currentMatch.score1}</p>
                                                </div>
                                                <div className="text-[#0d1b12]/50 font-bold text-lg">VS</div>
                                                <div className="text-center">
                                                    <p className="font-bold text-[#0d1b12]">{tournament.currentMatch.team2}</p>
                                                    <p className="text-2xl font-extrabold text-[#0d1b12]">{tournament.currentMatch.score2}</p>
                                                    <p className="text-xs text-[#0d1b12]/70">({tournament.currentMatch.overs2} ov)</p>
                                                </div>
                                            </div>
                                        )}
                                        <Link to={`/tournament/${tournament.id}`} className="px-6 py-3 bg-[#0d1b12] text-white font-bold rounded-xl hover:bg-[#1a2f20] transition-colors">
                                            Watch Live
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tournament Grid */}
                {filteredTournaments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTournaments.map(tournament => (
                            <div
                                key={tournament.id}
                                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#13ec5b] hover:shadow-xl hover:shadow-[#13ec5b]/10 transition-all group"
                            >
                                {/* Image */}
                                <div className="relative h-44 overflow-hidden">
                                    <img
                                        src={tournament.image}
                                        alt={tournament.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute top-3 left-3">
                                        {getStatusBadge(tournament.status)}
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span className="px-2 py-1 bg-white/90 text-[#0d1b12] text-xs font-semibold rounded-lg">
                                            {FORMAT_LABELS[tournament.format]}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <h3 className="text-white font-bold text-lg truncate">{tournament.name}</h3>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    {/* Venue & Date */}
                                    <div className="flex items-center gap-4 text-sm text-[#6b7c72] mb-4">
                                        <span className="flex items-center gap-1">
                                            <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-4 h-4">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                            </svg>
                                            {tournament.venue.split(',')[0]}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-4 h-4">
                                                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                                            </svg>
                                            {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                                        </span>
                                    </div>

                                    {/* Tournament Info */}
                                    <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-[#f6f8f6] rounded-xl">
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-[#0d1b12]">{tournament.overs}</p>
                                            <p className="text-xs text-[#6b7c72]">Overs</p>
                                        </div>
                                        <div className="text-center border-x border-gray-200">
                                            <p className="text-lg font-bold text-[#0d1b12]">{tournament.playersPerTeam}</p>
                                            <p className="text-xs text-[#6b7c72]">Players</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-[#0d1b12]">{tournament.teams.registered}/{tournament.teams.max}</p>
                                            <p className="text-xs text-[#6b7c72]">Teams</p>
                                        </div>
                                    </div>

                                    {/* Prize & Entry */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-xs text-[#6b7c72]">Prize Pool</p>
                                            <p className="text-xl font-bold text-[#13ec5b]">₹{tournament.prizePool.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-[#6b7c72]">Entry Fee</p>
                                            <p className="text-xl font-bold text-[#0d1b12]">₹{tournament.entryFee.toLocaleString()}</p>
                                            <p className="text-[10px] text-[#6b7c72]">per team</p>
                                        </div>
                                    </div>

                                    {/* Winner (for completed) */}
                                    {tournament.status === 'completed' && tournament.winner && (
                                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">🏆</span>
                                                <div>
                                                    <p className="text-xs text-yellow-700">Winner</p>
                                                    <p className="font-bold text-[#0d1b12]">{tournament.winner}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Registration Status */}
                                    {tournament.status === 'upcoming' && (
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2 w-24">
                                                    <div
                                                        className="bg-[#13ec5b] h-2 rounded-full"
                                                        style={{ width: `${(tournament.teams.registered / tournament.teams.max) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-[#6b7c72]">
                                                    {tournament.teams.max - tournament.teams.registered} spots left
                                                </span>
                                            </div>
                                            <span className={`text-xs font-semibold ${getDaysLeft(tournament.registrationDeadline) === 'Closed' ? 'text-red-500' : 'text-orange-500'}`}>
                                                {getDaysLeft(tournament.registrationDeadline)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <Link
                                        to={`/tournament/${tournament.id}`}
                                        className={`w-full flex items-center justify-center gap-2 py-3 font-semibold rounded-xl transition-all ${tournament.status === 'upcoming'
                                                ? 'bg-[#13ec5b] text-[#0d1b12] hover:shadow-lg hover:shadow-[#13ec5b]/30'
                                                : tournament.status === 'ongoing'
                                                    ? 'bg-[#0d1b12] text-white hover:bg-[#1a2f20]'
                                                    : 'border-2 border-gray-200 text-[#6b7c72] hover:border-[#13ec5b] hover:text-[#13ec5b]'
                                            }`}
                                    >
                                        {tournament.status === 'upcoming' ? (
                                            <>
                                                Register Now
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </>
                                        ) : tournament.status === 'ongoing' ? (
                                            <>
                                                <span className="w-2 h-2 bg-[#13ec5b] rounded-full animate-pulse"></span>
                                                View Live Scores
                                            </>
                                        ) : (
                                            'View Results'
                                        )}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-[#f6f8f6] rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg viewBox="0 0 24 24" fill="#6b7c72" className="w-12 h-12">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-[#0d1b12] mb-2">No Tournaments Found</h3>
                        <p className="text-[#6b7c72] mb-6">Try adjusting your filters or check back later.</p>
                        <button
                            onClick={() => { setActiveFilter('all'); setFormatFilter('all'); setSearchQuery(''); }}
                            className="px-6 py-3 bg-[#13ec5b] text-[#0d1b12] font-bold rounded-xl hover:shadow-lg transition-all"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* How Box Cricket Works */}
                <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-[#0d1b12] mb-6 text-center">📋 How Box Cricket Tournaments Work</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-4">
                            <div className="w-16 h-16 bg-[#e7fceb] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-8 h-8">
                                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-[#0d1b12] mb-2">Team Size</h3>
                            <p className="text-sm text-[#6b7c72]">6-8 players per team. Each player bowls 1-2 overs maximum.</p>
                        </div>

                        <div className="text-center p-4">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg viewBox="0 0 24 24" fill="#3b82f6" className="w-8 h-8">
                                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-[#0d1b12] mb-2">Match Duration</h3>
                            <p className="text-sm text-[#6b7c72]">6-10 overs per side. Quick matches, maximum fun!</p>
                        </div>

                        <div className="text-center p-4">
                            <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg viewBox="0 0 24 24" fill="#8b5cf6" className="w-8 h-8">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-[#0d1b12] mb-2">Tennis Ball</h3>
                            <p className="text-sm text-[#6b7c72]">Soft tennis ball used. Safe for indoor play.</p>
                        </div>

                        <div className="text-center p-4">
                            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg viewBox="0 0 24 24" fill="#f97316" className="w-8 h-8">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-[#0d1b12] mb-2">Scoring</h3>
                            <p className="text-sm text-[#6b7c72]">Side net = 1-2 runs, Back wall = 4, Roof = 6 runs.</p>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-[#f6f8f6] rounded-xl">
                        <h4 className="font-bold text-[#0d1b12] mb-3">Tournament Formats:</h4>
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#13ec5b] rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">KO</div>
                                <div>
                                    <p className="font-semibold text-[#0d1b12] text-sm">Knockout</p>
                                    <p className="text-xs text-[#6b7c72]">Lose once, you're out!</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">LG</div>
                                <div>
                                    <p className="font-semibold text-[#0d1b12] text-sm">League</p>
                                    <p className="text-xs text-[#6b7c72]">Play all teams, points table decides</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">L+K</div>
                                <div>
                                    <p className="font-semibold text-[#0d1b12] text-sm">League + Knockout</p>
                                    <p className="text-xs text-[#6b7c72]">Group stage → Top teams in knockouts</p>
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

export default Tournaments;
