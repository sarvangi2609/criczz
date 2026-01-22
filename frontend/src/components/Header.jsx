import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="w-full border-b border-white/20 bg-white/70 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="bg-[#13ec5b] w-8 h-8 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                    </div>
                    <span className="text-xl font-extrabold text-gray-900 tracking-tight">Criczz</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-10">
                    <Link
                        to="/book"
                        className="text-gray-700 text-sm font-semibold hover:text-[#13ec5b] transition-colors"
                    >
                        Book Box
                    </Link>
                    <Link
                        to="/find-players"
                        className="text-gray-700 text-sm font-semibold hover:text-[#13ec5b] transition-colors"
                    >
                        Find Players
                    </Link>
                    <Link
                        to="/tournaments"
                        className="text-gray-700 text-sm font-semibold hover:text-[#13ec5b] transition-colors"
                    >
                        Tournaments
                    </Link>
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all"
                    >
                        Login
                    </Link>
                    <Link
                        to="/signup"
                        className="px-5 py-2.5 rounded-xl bg-[#13ec5b] text-gray-900 text-sm font-bold hover:opacity-90 transition-all"
                    >
                        Sign Up
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Header;
