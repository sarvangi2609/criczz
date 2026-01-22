import { useState } from 'react';
import heroBg from '../../assets/hero_bg.png';

const HeroSection = () => {
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    return (
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl min-h-[400px] sm:min-h-[480px] flex flex-col items-center justify-center text-center p-4 sm:p-8 bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%), url("${heroBg}")`
                }}
            >
                <div className="max-w-3xl">
                    {/* Main Heading */}
                    <h1 className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-4 sm:mb-6">
                        Book Your Slot.
                        <br />
                        <span className="text-[#13ec5b]">Own the Pitch.</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-white/90 text-sm sm:text-base md:text-lg font-normal mb-6 sm:mb-10 max-w-xl mx-auto">
                        The simplest way to discover and book the best cricket boxes across Surat.
                    </p>

                    {/* Search Bar */}
                    <div className="bg-white p-2 rounded-[10px] shadow-2xl flex flex-col sm:flex-row items-center gap-1 w-full max-w-3xl mx-auto">
                        {/* Location Input */}
                        <div className="flex flex-1 items-center gap-2 px-4 w-full py-2 sm:py-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#13ec5b] flex-shrink-0">
                                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                            <input
                                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-gray-700 placeholder:text-gray-400 text-sm font-medium"
                                placeholder="Area in Surat"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        {/* Divider - Hidden on mobile */}
                        <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

                        {/* Date Input */}
                        <div className="flex flex-1 items-center gap-2 px-4 w-full py-2 sm:py-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#13ec5b] flex-shrink-0">
                                <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                                <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                            </svg>
                            <input
                                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-gray-700 placeholder:text-gray-400 text-sm font-medium"
                                placeholder="Select Date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        {/* Divider - Hidden on mobile */}
                        <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

                        {/* Time Select */}
                        <div className="flex flex-1 items-center gap-2 px-4 w-full py-2 sm:py-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#13ec5b] flex-shrink-0">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                            </svg>
                            <select
                                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-gray-700 text-sm font-medium appearance-none cursor-pointer"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            >
                                <option value="">Choose</option>
                                <option value="morning">Morning (6am - 12pm)</option>
                                <option value="afternoon">Afternoon (12pm - 5pm)</option>
                                <option value="evening">Evening (5pm - 9pm)</option>
                                <option value="night">Night (9pm - 2am)</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </div>

                        {/* Search Button */}
                        <button className="w-full sm:w-auto px-6 py-3 bg-[#13ec5b] text-gray-900 font-bold rounded-[10px] hover:opacity-90 transition-all flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                            </svg>
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
