import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Import images - These will come from backend/database later
import boxIndoor from '../../assets/box_indoor.png';
import boxOutdoor from '../../assets/box_outdoor.png';
import boxPremium from '../../assets/box_premium.png';
import boxNetted from '../../assets/box_netted.png';

// Static data - Will be replaced with API calls to backend
const BOXES_DATA = [
    {
        id: 1,
        name: "The Lords Box Cricket",
        slug: "lords-box-cricket",
        image: boxIndoor,
        rating: 4.8,
        reviewCount: 120,
        type: "indoor",
        typeLabel: "Indoor Turf",
        pricePerHour: 1200,
        location: "Vesu, Surat",
        amenities: ["Floodlights", "Free Parking", "Canteen"],
    },
    {
        id: 2,
        name: "Stadium X Arena",
        slug: "stadium-x-arena",
        image: boxOutdoor,
        rating: 4.2,
        reviewCount: 85,
        type: "outdoor",
        typeLabel: "Outdoor Turf",
        pricePerHour: 800,
        location: "Adajan, Surat",
        amenities: ["Lockers", "Parking", "Filtered Water"],
    },
    {
        id: 3,
        name: "Surat Sports Hub",
        slug: "surat-sports-hub",
        image: boxPremium,
        rating: 4.9,
        reviewCount: 210,
        type: "premium",
        typeLabel: "Premium Box",
        pricePerHour: 1500,
        location: "Piplod, Surat",
        amenities: ["Air Conditioned", "Recording"],
    },
    {
        id: 4,
        name: "Varachha Cricket Zone",
        slug: "varachha-cricket-zone",
        image: boxNetted,
        rating: 4.3,
        reviewCount: 65,
        type: "netted",
        typeLabel: "Local Favorite",
        pricePerHour: 600,
        location: "Varachha, Surat",
        amenities: ["Gear Provided", "Lights"],
    },
];

const AREAS = [
    { id: 'all', name: 'All of Surat' },
    { id: 'vesu', name: 'Vesu' },
    { id: 'adajan', name: 'Adajan' },
    { id: 'piplod', name: 'Piplod' },
    { id: 'varachha', name: 'Varachha' },
    { id: 'citylight', name: 'City Light' },
    { id: 'althan', name: 'Althan' },
];

const TYPE_COLORS = {
    indoor: 'bg-[#13ec5b]',
    outdoor: 'bg-sky-500',
    premium: 'bg-violet-500',
    netted: 'bg-orange-500',
};

const Boxes = () => {
    const [selectedArea, setSelectedArea] = useState('all');
    const [priceRange, setPriceRange] = useState(13000);
    const [sortBy, setSortBy] = useState('relevance');
    const [viewType, setViewType] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        indoorBox: true,
        outdoorTurf: false,
        nettedBox: false,
        floodlights: false,
        parking: false,
        canteen: false,
    });

    const handleFilterChange = (filterName) => {
        setFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
    };

    const resetFilters = () => {
        setSelectedArea('all');
        setPriceRange(13000);
        setFilters({
            indoorBox: false,
            outdoorTurf: false,
            nettedBox: false,
            floodlights: false,
            parking: false,
            canteen: false,
        });
    };

    return (
        <div className="min-h-screen bg-[#f6f8f6]">
            <Header />

            {/* Page Header */}
            <div className="bg-white border-b border-gray-200 py-4 lg:py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                    <div>
                        <nav className="flex items-center gap-2 text-sm text-[#6b7c72] mb-2">
                            <Link to="/" className="hover:text-[#13ec5b] transition-colors">Home</Link>
                            <span>›</span>
                            <Link to="/boxes" className="hover:text-[#13ec5b] transition-colors">Surat</Link>
                            <span>›</span>
                            <span className="text-[#0d1b12] font-medium">Cricket Boxes</span>
                        </nav>
                        <h1 className="text-xl sm:text-2xl font-bold text-[#0d1b12]">Cricket Boxes in Surat</h1>
                        <p className="text-sm text-[#6b7c72] mt-1">Showing 42 premium turfs available for booking</p>
                    </div>
                    <div className="flex gap-3">
                        {/* Mobile Filter Toggle */}
                        <button
                            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-[#0d1b12] hover:border-[#13ec5b] transition-all"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
                            </svg>
                            Filters
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-[#0d1b12] hover:border-[#13ec5b] hover:text-[#13ec5b] transition-all">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span className="hidden sm:inline">Show Map</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Filters Sidebar */}
                    <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 flex-shrink-0`}>
                        <div className="bg-white rounded-2xl p-5 sticky top-24">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-lg font-bold text-[#0d1b12]">Filters</h3>
                                <button className="text-sm text-[#13ec5b] font-medium hover:underline" onClick={resetFilters}>RESET</button>
                            </div>

                            {/* Area Filter */}
                            <div className="mb-5 pb-5 border-b border-gray-100">
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-[#0d1b12] mb-3">
                                    <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-4 h-4">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                    Area
                                </h4>
                                <select
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-[#0d1b12] bg-white focus:border-[#13ec5b] focus:outline-none transition-colors cursor-pointer"
                                    value={selectedArea}
                                    onChange={(e) => setSelectedArea(e.target.value)}
                                >
                                    {AREAS.map(area => (
                                        <option key={area.id} value={area.id}>{area.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="mb-5 pb-5 border-b border-gray-100">
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-[#0d1b12] mb-3">
                                    <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-4 h-4">
                                        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                                    </svg>
                                    Price Range (per hr)
                                </h4>
                                <input
                                    type="range"
                                    className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#13ec5b]"
                                    min="500" max="13000" value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                />
                                <div className="flex justify-between text-xs text-[#6b7c72] mt-2">
                                    <span>₹500</span>
                                    <span>₹{priceRange}+</span>
                                </div>
                            </div>

                            {/* Turf Type */}
                            <div className="mb-5 pb-5 border-b border-gray-100">
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-[#0d1b12] mb-3">
                                    <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-4 h-4">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                                    Turf Type
                                </h4>
                                <div className="space-y-2.5">
                                    {[
                                        { id: 'indoorBox', label: 'Indoor Box' },
                                        { id: 'outdoorTurf', label: 'Outdoor Turf' },
                                        { id: 'nettedBox', label: 'Netted Box' },
                                    ].map(item => (
                                        <label key={item.id} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 accent-[#13ec5b] cursor-pointer"
                                                checked={filters[item.id]}
                                                onChange={() => handleFilterChange(item.id)}
                                            />
                                            <span className="text-sm text-[#0d1b12]">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="mb-5">
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-[#0d1b12] mb-3">
                                    <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-4 h-4">
                                        <path d="M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14zM6 13h5v4H6zm6-6h4v3h-4zM6 7h5v5H6zm6 4h4v6h-4z" />
                                    </svg>
                                    Amenities
                                </h4>
                                <div className="space-y-2.5">
                                    {[
                                        { id: 'floodlights', label: 'Floodlights' },
                                        { id: 'parking', label: 'Parking' },
                                        { id: 'canteen', label: 'Canteen' },
                                    ].map(item => (
                                        <label key={item.id} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 accent-[#13ec5b] cursor-pointer"
                                                checked={filters[item.id]}
                                                onChange={() => handleFilterChange(item.id)}
                                            />
                                            <span className="text-sm text-[#0d1b12]">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button className="w-full py-3 bg-[#13ec5b] text-white font-semibold rounded-xl hover:bg-[#0fd650] transition-colors">
                                Apply Filters
                            </button>
                        </div>
                    </aside>

                    {/* Boxes Listing */}
                    <main className="flex-1">
                        {/* Sort & View Options */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5">
                            <div className="flex flex-wrap gap-2">
                                {['relevance', 'price-low', 'top-rated'].map(sort => (
                                    <button
                                        key={sort}
                                        className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${sortBy === sort ? 'border-[#13ec5b] text-[#0d1b12] bg-green-50' : 'border-gray-200 text-[#6b7c72] bg-white hover:border-[#13ec5b]'}`}
                                        onClick={() => setSortBy(sort)}
                                    >
                                        {sort === 'relevance' ? 'Relevance' : sort === 'price-low' ? 'Price: Low-High' : 'Top Rated'}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg self-start">
                                <button
                                    className={`p-2 rounded-md transition-all ${viewType === 'grid' ? 'bg-white shadow-sm text-[#0d1b12]' : 'text-[#6b7c72]'}`}
                                    onClick={() => setViewType('grid')}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z" />
                                    </svg>
                                </button>
                                <button
                                    className={`p-2 rounded-md transition-all ${viewType === 'list' ? 'bg-white shadow-sm text-[#0d1b12]' : 'text-[#6b7c72]'}`}
                                    onClick={() => setViewType('list')}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Boxes Grid/List */}
                        <div className={`grid gap-4 ${viewType === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                            {BOXES_DATA.map(box => (
                                <div
                                    key={box.id}
                                    className={`bg-white rounded-2xl overflow-hidden border border-transparent hover:border-[#13ec5b] hover:shadow-lg hover:shadow-[#13ec5b]/10 transition-all hover:-translate-y-1 ${viewType === 'list' ? 'flex flex-col sm:flex-row' : ''}`}
                                >
                                    {/* Image */}
                                    <div className={`relative ${viewType === 'list' ? 'sm:w-64 sm:min-w-[16rem] h-44 sm:h-auto' : 'h-40'}`}>
                                        <img src={box.image} alt={box.name} className="w-full h-full object-cover" />
                                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white px-2.5 py-1 rounded-md text-xs font-semibold text-[#0d1b12]">
                                            <svg viewBox="0 0 24 24" fill="#fbbf24" className="w-3 h-3">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                            </svg>
                                            {box.rating} ({box.reviewCount})
                                        </div>
                                        <span className={`absolute bottom-3 right-3 px-3 py-1 rounded-md text-xs font-semibold text-white uppercase ${TYPE_COLORS[box.type]}`}>
                                            {box.typeLabel}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className={`p-4 ${viewType === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-[#0d1b12]">{box.name}</h3>
                                                <div className="text-right">
                                                    <span className="text-xs text-[#6b7c72] block">Starts from</span>
                                                    <span className="text-lg font-bold text-[#13ec5b]">₹{box.pricePerHour}<small className="text-xs font-normal">/hr</small></span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm text-[#6b7c72] mb-3">
                                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                                </svg>
                                                {box.location}
                                            </div>
                                            <div className="flex flex-wrap gap-3 pb-3 mb-3 border-b border-gray-100">
                                                {box.amenities.map((amenity, i) => (
                                                    <span key={i} className="flex items-center gap-1.5 text-xs text-[#6b7c72]">
                                                        <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-3.5 h-3.5">
                                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                        </svg>
                                                        {amenity}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <Link
                                            to={`/box/${box.slug}`}
                                            className={`flex items-center justify-center gap-2 py-3 bg-[#13ec5b] text-white font-semibold rounded-xl hover:bg-[#0fd650] transition-colors ${viewType === 'list' ? 'sm:w-fit sm:px-6' : 'w-full'}`}
                                        >
                                            View Details & Book
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <button className="w-9 h-9 flex items-center justify-center border-2 border-gray-200 rounded-lg text-[#6b7c72] disabled:opacity-50" disabled>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M15 18l-6-6 6-6" /></svg>
                            </button>
                            {[1, 2, 3].map(page => (
                                <button
                                    key={page}
                                    className={`w-9 h-9 flex items-center justify-center border-2 rounded-lg font-medium transition-all ${currentPage === page ? 'border-[#13ec5b] bg-[#13ec5b] text-white' : 'border-gray-200 text-[#6b7c72] hover:border-[#13ec5b]'}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <span className="text-[#6b7c72]">...</span>
                            <button className="w-9 h-9 flex items-center justify-center border-2 border-gray-200 rounded-lg text-[#6b7c72] hover:border-[#13ec5b] transition-all" onClick={() => setCurrentPage(12)}>12</button>
                            <button className="w-9 h-9 flex items-center justify-center border-2 border-gray-200 rounded-lg text-[#6b7c72] hover:border-[#13ec5b] transition-all">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M9 18l6-6-6-6" /></svg>
                            </button>
                        </div>
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Boxes;
