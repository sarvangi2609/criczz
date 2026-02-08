import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#f8f9fa] border-t border-gray-200 py-10 sm:py-14">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
                {/* Logo & Tagline */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-4">
                        {/* Heart/Check Icon */}
                        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                            <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                fill="#13ec5b"
                            />
                            <path
                                d="M9 12l2 2 4-4"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-xl font-bold text-[#2c3e50]">SuratBoxCricket</span>
                    </Link>
                    <p className="text-[#6b7c72] text-sm max-w-md mx-auto leading-relaxed">
                        The ultimate platform for booking cricket boxes and connecting with players across Surat.
                    </p>
                </div>

                {/* Links */}
                <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-8">
                    <Link
                        to="/privacy"
                        className="text-[#2c3e50] text-sm font-medium hover:text-[#13ec5b] transition-colors"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        to="/terms"
                        className="text-[#2c3e50] text-sm font-medium hover:text-[#13ec5b] transition-colors"
                    >
                        Terms of Service
                    </Link>
                    <Link
                        to="/contact"
                        className="text-[#2c3e50] text-sm font-medium hover:text-[#13ec5b] transition-colors"
                    >
                        Contact Us
                    </Link>
                </div>

                {/* Copyright */}
                <div className="text-center">
                    <p className="text-[#9ca3af] text-xs uppercase tracking-wider">
                        © 2024 SuratBoxCricket Arena. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
