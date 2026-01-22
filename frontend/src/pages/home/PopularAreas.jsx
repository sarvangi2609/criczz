// Popular areas in Surat
const popularAreas = [
    "Adajan",
    "Vesu",
    "Varachha",
    "Piplod",
    "Katargam",
    "Palanpur",
    "Rander",
    "Udhana"
];

const PopularAreas = () => {
    return (
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 sm:mb-8">
                Popular Areas in Surat
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
                {popularAreas.map((area) => (
                    <button
                        key={area}
                        className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:border-[#13ec5b] hover:bg-[#13ec5b]/5 hover:text-gray-900 transition-all"
                    >
                        {area}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default PopularAreas;
