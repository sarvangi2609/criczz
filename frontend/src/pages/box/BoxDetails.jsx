import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Import images
import boxIndoor from '../../assets/box_indoor.png';
import boxOutdoor from '../../assets/box_outdoor.png';
import boxPremium from '../../assets/box_premium.png';
import boxNetted from '../../assets/box_netted.png';

// Static box data - Will come from API
const BOXES_DATA = {
    'lords-box-cricket': {
        id: 1,
        name: "The Lords Box Cricket",
        slug: "lords-box-cricket",
        images: [boxIndoor, boxPremium, boxOutdoor, boxNetted],
        rating: 4.8,
        reviewCount: 120,
        type: "indoor",
        typeLabel: "Indoor Turf",
        pricePerHour: 1200,
        location: "Vesu, Surat",
        fullAddress: "Plot No. 123, Near City Mall, Vesu, Surat - 395007",
        amenities: [
            { icon: 'floodlights', label: 'Night Floodlights' },
            { icon: 'parking', label: 'Free Parking' },
            { icon: 'gear', label: 'Gear Included' },
            { icon: 'water', label: 'Drinking Water' },
            { icon: 'changing', label: 'Changing Rooms' },
            { icon: 'cctv', label: 'CCTV Secured' },
        ],
        rules: [
            'Maximum 16 players allowed on the turf at once',
            'Footwear: Rubber studs or flat shoes only. No metal spikes.',
            'Reporting time: 15 minutes before the slot starts.',
        ],
        description: 'Experience premium indoor cricket at The Lords Box Cricket. Our state-of-the-art facility features professional-grade artificial turf, modern LED floodlights, and all the amenities you need for an amazing game.',
        mapUrl: 'https://maps.google.com/?q=21.1702,72.8311',
    },
    'stadium-x-arena': {
        id: 2,
        name: "Stadium X Arena",
        slug: "stadium-x-arena",
        images: [boxOutdoor, boxIndoor, boxNetted, boxPremium],
        rating: 4.2,
        reviewCount: 85,
        type: "outdoor",
        typeLabel: "Outdoor Turf",
        pricePerHour: 800,
        location: "Adajan, Surat",
        fullAddress: "Stadium Road, Near ONGC, Adajan, Surat - 395009",
        amenities: [
            { icon: 'floodlights', label: 'Floodlights' },
            { icon: 'parking', label: 'Parking Available' },
            { icon: 'water', label: 'Filtered Water' },
            { icon: 'lockers', label: 'Lockers' },
        ],
        rules: [
            'Maximum 22 players allowed on the ground',
            'Only turf shoes allowed',
            'No food or drinks on the playing area',
        ],
        description: 'Stadium X Arena offers a fantastic outdoor cricket experience with natural grass and professional facilities.',
        mapUrl: 'https://maps.google.com/?q=21.1902,72.7911',
    },
    'surat-sports-hub': {
        id: 3,
        name: "Surat Sports Hub",
        slug: "surat-sports-hub",
        images: [boxPremium, boxIndoor, boxOutdoor, boxNetted],
        rating: 4.9,
        reviewCount: 210,
        type: "premium",
        typeLabel: "Premium Box",
        pricePerHour: 1500,
        location: "Piplod, Surat",
        fullAddress: "VIP Road, Piplod, Surat - 395007",
        amenities: [
            { icon: 'ac', label: 'Air Conditioned' },
            { icon: 'recording', label: 'Match Recording' },
            { icon: 'floodlights', label: 'LED Floodlights' },
            { icon: 'parking', label: 'Valet Parking' },
            { icon: 'cafe', label: 'In-house Cafe' },
            { icon: 'lockers', label: 'Premium Lockers' },
        ],
        rules: [
            'Maximum 12 players for premium experience',
            'Shoes provided at venue',
            'Advance booking required',
        ],
        description: 'The ultimate premium cricket experience with AC, match recording, and luxury amenities.',
        mapUrl: 'https://maps.google.com/?q=21.1502,72.7711',
    },
    'varachha-cricket-zone': {
        id: 4,
        name: "Varachha Cricket Zone",
        slug: "varachha-cricket-zone",
        images: [boxNetted, boxOutdoor, boxIndoor, boxPremium],
        rating: 4.3,
        reviewCount: 65,
        type: "netted",
        typeLabel: "Local Favorite",
        pricePerHour: 600,
        location: "Varachha, Surat",
        fullAddress: "Near Varachha Main Road, Surat - 395006",
        amenities: [
            { icon: 'gear', label: 'Gear Provided' },
            { icon: 'floodlights', label: 'Lights Available' },
            { icon: 'water', label: 'Drinking Water' },
        ],
        rules: [
            'Maximum 10 players per session',
            'Bring your own shoes',
            'First come first serve for equipment',
        ],
        description: 'Affordable and fun cricket experience for local players. Great for practice sessions.',
        mapUrl: 'https://maps.google.com/?q=21.2102,72.8511',
    },
};

// Sample reviews
const REVIEWS = [
    { id: 1, name: 'Parth Nakshatra', avatar: 'P', date: '2 days ago', rating: 5, comment: 'Best turf in Surat! Great. The bounce is very clean and the Lighting is perfect for night matches. Very well maintained.' },
    { id: 2, name: 'Raj Patel', avatar: 'R', date: '1 week ago', rating: 4, comment: 'Good facilities and friendly staff. Would recommend!' },
    { id: 3, name: 'Mihir Shah', avatar: 'M', date: '2 weeks ago', rating: 5, comment: 'Amazing experience! The turf quality is excellent.' },
];

// Available time slots
const TIME_SLOTS = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM',
];

const AmenityIcon = ({ type }) => {
    const icons = {
        floodlights: <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />,
        parking: <path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z" />,
        gear: <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />,
        water: <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />,
        changing: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />,
        cctv: <path d="M18 10.48V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4.48l4 3.98v-11l-4 3.98zM16 18H4V6h12v12z" />,
        ac: <path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z" />,
        recording: <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />,
        lockers: <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />,
        cafe: <path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3zM16 5v3h-2V5h2zm-4 0v3H8V5h4zm6.5 3H18V5h.5c.83 0 1.5.67 1.5 1.5S19.33 8 18.5 8zM4 19h16v2H4v-2z" />,
    };
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            {icons[type] || icons.gear}
        </svg>
    );
};

const BoxDetails = () => {
    const { slug } = useParams();
    const box = BOXES_DATA[slug] || BOXES_DATA['lords-box-cricket'];

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedDate, setSelectedDate] = useState(24);
    const [selectedSlot, setSelectedSlot] = useState('6:00 PM');
    const [duration, setDuration] = useState(1);

    // Generate next 7 dates
    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            date: date.getDate(),
        };
    });

    const totalAmount = box.pricePerHour * duration;

    return (
        <div className="min-h-screen bg-[#f6f8f6]">
            <Header />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                    <nav className="flex items-center gap-2 text-sm text-[#6b7c72]">
                        <Link to="/" className="hover:text-[#13ec5b] transition-colors">Home</Link>
                        <span>›</span>
                        <Link to="/boxes" className="hover:text-[#13ec5b] transition-colors">Surat Venues</Link>
                        <span>›</span>
                        <span className="text-[#0d1b12] font-medium">{box.name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* Image Gallery */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    {/* Main Image */}
                    <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80 lg:h-96">
                        <img src={box.images[selectedImage]} alt={box.name} className="w-full h-full object-cover" />
                        <button className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-black/70 text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                            </svg>
                            View All Photos
                        </button>
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-2 gap-3">
                        {box.images.slice(1, 5).map((img, i) => (
                            <div
                                key={i}
                                className={`rounded-xl overflow-hidden h-28 sm:h-36 lg:h-44 cursor-pointer border-2 transition-all ${selectedImage === i + 1 ? 'border-[#13ec5b]' : 'border-transparent hover:border-[#13ec5b]/50'}`}
                                onClick={() => setSelectedImage(i + 1)}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Content */}
                    <div className="flex-1">
                        {/* Box Header */}
                        <div className="bg-white rounded-2xl p-5 sm:p-6 mb-5">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-xl sm:text-2xl font-bold text-[#0d1b12]">{box.name}</h1>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#6b7c72]">
                                                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                                            </svg>
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#6b7c72]">
                                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="flex items-center gap-1 text-[#0d1b12] font-semibold">
                                            <svg viewBox="0 0 24 24" fill="#fbbf24" className="w-4 h-4">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                            </svg>
                                            {box.rating}
                                        </div>
                                        <span className="text-[#6b7c72]">({box.reviewCount} reviews)</span>
                                        <span className="text-[#6b7c72]">•</span>
                                        <span className="text-[#6b7c72]">{box.location}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[#6b7c72] text-sm">{box.description}</p>
                        </div>

                        {/* Amenities */}
                        <div className="bg-white rounded-2xl p-5 sm:p-6 mb-5">
                            <h2 className="text-lg font-bold text-[#0d1b12] mb-4">Amenities</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {box.amenities.map((amenity, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-[#f6f8f6] rounded-xl">
                                        <div className="w-10 h-10 bg-[#13ec5b]/10 rounded-lg flex items-center justify-center text-[#13ec5b]">
                                            <AmenityIcon type={amenity.icon} />
                                        </div>
                                        <span className="text-sm font-medium text-[#0d1b12]">{amenity.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Venue Rules */}
                        <div className="bg-white rounded-2xl p-5 sm:p-6 mb-5">
                            <h2 className="text-lg font-bold text-[#0d1b12] mb-4">Venue Rules</h2>
                            <ul className="space-y-3">
                                {box.rules.map((rule, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-[#6b7c72]">
                                        <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-5 h-5 flex-shrink-0 mt-0.5">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Location */}
                        <div className="bg-white rounded-2xl p-5 sm:p-6 mb-5">
                            <h2 className="text-lg font-bold text-[#0d1b12] mb-4">Location</h2>
                            <div className="bg-gray-200 rounded-xl h-48 flex items-center justify-center mb-3">
                                <div className="text-center">
                                    <svg viewBox="0 0 24 24" fill="#6b7c72" className="w-12 h-12 mx-auto mb-2">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                    <p className="text-[#6b7c72] text-sm">Map Preview</p>
                                </div>
                            </div>
                            <p className="text-sm text-[#6b7c72] mb-3">{box.fullAddress}</p>
                            <a href={box.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-[#13ec5b] hover:underline">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                                Get Directions
                            </a>
                        </div>

                        {/* Player Reviews */}
                        <div className="bg-white rounded-2xl p-5 sm:p-6">
                            <h2 className="text-lg font-bold text-[#0d1b12] mb-4">Player Reviews</h2>

                            {/* Rating Summary */}
                            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-[#0d1b12]">{box.rating}</div>
                                    <div className="flex items-center gap-0.5 justify-center my-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <svg key={star} viewBox="0 0 24 24" fill={star <= Math.floor(box.rating) ? '#fbbf24' : '#e5e7eb'} className="w-4 h-4">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <div className="text-xs text-[#6b7c72]">{box.reviewCount} Reviews</div>
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    {[5, 4, 3, 2, 1].map(rating => (
                                        <div key={rating} className="flex items-center gap-2">
                                            <span className="text-xs text-[#6b7c72] w-3">{rating}</span>
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#13ec5b] rounded-full"
                                                    style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 8 : 2}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-[#6b7c72] w-8">{rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '8%' : '2%'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reviews List */}
                            <div className="space-y-5">
                                {REVIEWS.map(review => (
                                    <div key={review.id} className="pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-[#13ec5b] rounded-full flex items-center justify-center text-white font-semibold">
                                                {review.avatar}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-[#0d1b12]">{review.name}</span>
                                                    <span className="text-xs text-[#6b7c72]">{review.date}</span>
                                                </div>
                                                <div className="flex items-center gap-0.5 mb-2">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <svg key={star} viewBox="0 0 24 24" fill={star <= review.rating ? '#fbbf24' : '#e5e7eb'} className="w-3.5 h-3.5">
                                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <p className="text-sm text-[#6b7c72]">{review.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-5 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-[#0d1b12] hover:border-[#13ec5b] transition-colors">
                                View All Reviews
                            </button>
                        </div>
                    </div>

                    {/* Right Sidebar - Booking */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-5 sm:p-6 sticky top-24">
                            {/* Price */}
                            <div className="text-right mb-5">
                                <span className="text-2xl font-bold text-[#13ec5b]">₹{box.pricePerHour}</span>
                                <span className="text-[#6b7c72]"> /hour</span>
                            </div>

                            {/* Date Selection */}
                            <div className="mb-5">
                                <label className="text-xs font-semibold text-[#0d1b12] mb-2 block">SELECT DATE</label>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {dates.map((d, i) => (
                                        <button
                                            key={i}
                                            className={`flex-shrink-0 w-14 py-2 rounded-lg text-center transition-all ${selectedDate === d.date ? 'bg-[#13ec5b] text-white' : 'bg-gray-100 text-[#6b7c72] hover:bg-gray-200'}`}
                                            onClick={() => setSelectedDate(d.date)}
                                        >
                                            <div className="text-[10px] font-medium">{d.day}</div>
                                            <div className="text-lg font-bold">{d.date}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Slot Selection */}
                            <div className="mb-5">
                                <label className="text-xs font-semibold text-[#0d1b12] mb-2 block">AVAILABLE SLOTS</label>
                                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                                    {TIME_SLOTS.slice(0, 9).map(slot => (
                                        <button
                                            key={slot}
                                            className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${selectedSlot === slot ? 'bg-[#13ec5b] text-white' : 'bg-gray-100 text-[#6b7c72] hover:bg-gray-200'}`}
                                            onClick={() => setSelectedSlot(slot)}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="mb-5">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-semibold text-[#0d1b12]">Hours</label>
                                    <span className="text-lg font-bold text-[#0d1b12]">{duration}hr</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl font-bold text-[#6b7c72] hover:bg-gray-200 transition-colors disabled:opacity-50"
                                        onClick={() => setDuration(Math.max(1, duration - 1))}
                                        disabled={duration <= 1}
                                    >
                                        -
                                    </button>
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full">
                                        <div className="h-full bg-[#13ec5b] rounded-full transition-all" style={{ width: `${(duration / 5) * 100}%` }} />
                                    </div>
                                    <button
                                        className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl font-bold text-[#6b7c72] hover:bg-gray-200 transition-colors disabled:opacity-50"
                                        onClick={() => setDuration(Math.min(5, duration + 1))}
                                        disabled={duration >= 5}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center py-4 border-t border-gray-100 mb-4">
                                <div>
                                    <div className="text-xs text-[#6b7c72]">Convenience Fee</div>
                                    <div className="text-lg font-bold text-[#0d1b12]">Total Amount</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-[#6b7c72]">₹49</div>
                                    <div className="text-xl font-bold text-[#13ec5b]">₹{totalAmount + 49}</div>
                                </div>
                            </div>

                            {/* Book Button */}
                            <button className="w-full py-4 bg-gradient-to-r from-[#13ec5b] to-[#0fd650] rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-[#13ec5b]/40 transition-all">
                                BOOK NOW
                            </button>

                            {/* Find Players */}
                            <div className="mt-5 p-4 bg-[#f6f8f6] rounded-xl">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-[#13ec5b]/10 rounded-lg flex items-center justify-center text-[#13ec5b]">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#0d1b12] text-sm">Short of players?</h4>
                                        <p className="text-xs text-[#6b7c72] mb-2">Find and request local players to join you or enroll in Adajan.</p>
                                        <Link to="/find-players" className="text-xs font-semibold text-[#13ec5b] hover:underline">
                                            Find Players →
                                        </Link>
                                    </div>
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

export default BoxDetails;
