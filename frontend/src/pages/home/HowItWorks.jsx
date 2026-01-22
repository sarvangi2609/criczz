// How it works steps data
const steps = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path d="M8.25 10.875a2.625 2.625 0 115.25 0 2.625 2.625 0 01-5.25 0z" />
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.125 4.5a4.125 4.125 0 102.338 7.524l2.007 2.006a.75.75 0 101.06-1.06l-2.006-2.007a4.125 4.125 0 00-3.399-6.463z" clipRule="evenodd" />
            </svg>
        ),
        title: "1. Find a Box",
        description: "Enter your area and preferred time to see available slots in real-time.",
        bgClass: "bg-[#13ec5b]",
        iconColor: "text-white",
        rotate: "rotate-6"
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
            </svg>
        ),
        title: "2. Instant Booking",
        description: "Secure your slot with easy online payment options and get instant confirmation.",
        bgClass: "bg-gray-900",
        iconColor: "text-[#13ec5b]",
        rotate: "-rotate-3"
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path fillRule="evenodd" d="M8.478 1.6a.75.75 0 01.273 1.025 3.72 3.72 0 00-.425 1.122c.058.057.118.114.18.168A4.491 4.491 0 0112 2.25a4.491 4.491 0 013.494 1.665 4.8 4.8 0 01.18-.168 3.72 3.72 0 00-.425-1.122.75.75 0 111.298-.75 5.22 5.22 0 01.578 2.082 4.484 4.484 0 011.124 2.349 4.5 4.5 0 01-.09 3.036.75.75 0 01-1.418-.471c.154-.464.193-.95.102-1.433a4.49 4.49 0 01-3.343 1.562 4.49 4.49 0 01-3.343-1.562c-.091.484-.052.969.102 1.433a.75.75 0 01-1.418.47 4.5 4.5 0 01-.09-3.035 4.484 4.484 0 011.124-2.35 5.22 5.22 0 01.579-2.081.75.75 0 011.024-.273zM12 6a3 3 0 100 6 3 3 0 000-6z" clipRule="evenodd" />
                <path d="M12 13.5a5.25 5.25 0 00-5.25 5.25v.75a.75.75 0 001.5 0v-.75a3.75 3.75 0 117.5 0v.75a.75.75 0 001.5 0v-.75A5.25 5.25 0 0012 13.5z" />
            </svg>
        ),
        title: "3. Start Playing",
        description: "Show up at the turf with your team and enjoy a professional cricket experience.",
        bgClass: "bg-[#13ec5b]",
        iconColor: "text-white",
        rotate: "rotate-3"
    }
];

// Step Card Component
const StepCard = ({ step }) => (
    <div className="flex flex-col items-center text-center p-4 sm:p-6">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${step.bgClass} flex items-center justify-center mb-5 sm:mb-6 shadow-lg ${step.rotate}`}>
            <span className={step.iconColor}>
                {step.icon}
            </span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{step.title}</h3>
        <p className="text-gray-500 text-sm sm:text-base max-w-xs">{step.description}</p>
    </div>
);

const HowItWorks = () => {
    return (
        <section className="bg-[#13ec5b]/10 py-12 sm:py-20">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-10 sm:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3 sm:mb-4">
                        How It Works
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
                        Getting on the field is easier than ever. Follow these simple steps.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12">
                    {steps.map((step, index) => (
                        <StepCard key={index} step={step} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
