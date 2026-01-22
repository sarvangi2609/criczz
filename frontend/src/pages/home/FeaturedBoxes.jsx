import { Link } from 'react-router-dom';

// Featured cricket boxes data
const featuredBoxes = [
    {
        id: 1,
        name: "Lords Indoor Cricket",
        location: "Vesu, Surat",
        price: 800,
        rating: 4.8,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMhJ8HtAVmFCj8TmVJg1zaN8IomyY2koZd-PYKsl-mpVRpof0y8dfWCjGII_eLxRJc5tZatsu2W06hoYUOski8BVlUPa2f9fAYyZslbvg-YqGdKGndO6mVFyIxLAPMnAC3HX3FpJwmSV2H79bhiqmF4AP3WIYiQRwcV8qcmSpafho3435IoE95bP0ilkx6vcY8qLR_wqE332dA5ESOGZgrXAUOuXlNy77TzqeFisjHv3THMZLoRq0JkbWVfbq6zH1G0CUonoOryQla"
    },
    {
        id: 2,
        name: "Vesu Turf Masters",
        location: "VIP Road, Surat",
        price: 1000,
        rating: 4.9,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8Me8Vc-kRhbKUgIJGf47WDi1GlEx2haVxk7yKcsMH581JqUdZQ3xS_DdbmIqGNa0hGoZgodtMTT6N1kug6NEeuYIU70EauUQazOFz2jLnesd61LWPlM75GuUmquq_N2G3Pwa-Cj00tWUxYpGfFDRpSQM130-Bp3xKkXb65iZerax9cJ-ggEVvXThvbJKJ2QplsQJslxAc4QrvBcEadGwZugwDlAuL22QEIJujIxwp9Ja2FQbofzY0vZ367e_1w7K8vFJwqk1vWx4A"
    },
    {
        id: 3,
        name: "The Pavilion Adajan",
        location: "LP Savani, Surat",
        price: 750,
        rating: 4.7,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZTb3XNYCTezkyeSdO-bUee1imZSrGZPEfxt_U65_zb19FfHYGDZ-WeLE8-LEUZU8vqWrASfNyBXRkqfSzRkVvGGFBxTzFv9CwOaisr42uZau-Kj6NwTVDyI6dGDgZ0kMVs8_72FFpxQN_kXIX6vjHhi0GFMQnhzyM0iTw2IgQkbTe0JgyDKnFiBk8CrmGpMTjbHBd5VrMnyiPcqiLphvbOsKYWlOrVtWif2p_ChuKy8QuSsXMmPL4eqZNOaV7drnyWl6gzO2VQDgV"
    },
    {
        id: 4,
        name: "Surat Smashers",
        location: "Varachha, Surat",
        price: 900,
        rating: 4.6,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUOSDWpgvhZ0q_ySE77jPhrnJaB2QCIpTFQbiLTmDHrMQnHm3zpd6d6Wyl_3vWBWrrEArkQyvjNXoJC-3MsStoD3_N2ZqzNYa66ic4r2R24Nlo-TBgnYNR7mpfUxAcI0ggRjfdGmdTGrr0TFo6PVJ9JFfu7VMY8NAhvclPGjmv6kiptayElpw7eeXt6H94kmyuDFu06P2aXLLJddgSvNlwVtRHuwO2jNPSyPhVQC0dViFnMU_IFdaXkEX4fL7I9A_8_5U3L5_QAJSs"
    }
];

// Cricket Box Card Component
const CricketBoxCard = ({ box }) => (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
            <img
                src={box.image}
                alt={box.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Rating Badge */}
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-bold text-gray-800">{box.rating}</span>
            </div>
        </div>

        {/* Content */}
        <div className="p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{box.name}</h3>
            <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
                    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                </svg>
                {box.location}
            </p>

            {/* Price and Button */}
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-xl font-black text-[#13ec5b]">₹{box.price}</span>
                    <span className="text-gray-400 text-sm font-medium"> / hr</span>
                </div>
                <Link
                    to={`/box/${box.id}`}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                    Book Now
                </Link>
            </div>
        </div>
    </div>
);

const FeaturedBoxes = () => {
    return (
        <section className="bg-[#f6f8f6] py-12 sm:py-16">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
                    <div>
                        <span className="text-[#13ec5b] font-bold text-xs uppercase tracking-widest mb-2 block">
                            Top Rated
                        </span>
                        <h2 className="text-gray-900 text-2xl sm:text-3xl md:text-4xl font-black">
                            Featured Cricket Boxes
                        </h2>
                    </div>
                    <Link
                        to="/explore"
                        className="text-[#13ec5b] font-semibold flex items-center gap-1 group text-sm"
                    >
                        View All
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {featuredBoxes.map((box) => (
                        <CricketBoxCard key={box.id} box={box} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedBoxes;
