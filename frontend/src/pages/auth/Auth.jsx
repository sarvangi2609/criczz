import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import stadiumBanner from '../../assets/stadium_banner.png';

// Surat areas for player matching
const SURAT_AREAS = [
    { id: '', name: 'Select your area' },
    { id: 'vesu', name: 'Vesu' },
    { id: 'adajan', name: 'Adajan' },
    { id: 'piplod', name: 'Piplod' },
    { id: 'varachha', name: 'Varachha' },
    { id: 'citylight', name: 'City Light' },
    { id: 'althan', name: 'Althan' },
    { id: 'katargam', name: 'Katargam' },
    { id: 'udhna', name: 'Udhna' },
    { id: 'athwa', name: 'Athwa' },
    { id: 'magdalla', name: 'Magdalla' },
    { id: 'pal', name: 'Pal' },
    { id: 'dumas', name: 'Dumas' },
];

const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getInitialTab = () => {
        if (location.pathname === '/signup') return 'signup';
        return 'login';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab());
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [signupData, setSignupData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        area: ''
    });

    // Generate username from name or email
    const generateUsername = () => {
        if (signupData.firstName || signupData.lastName) {
            return `${signupData.firstName} ${signupData.lastName}`.trim();
        }
        if (signupData.email) {
            return signupData.email.charAt(0).toUpperCase();
        }
        return 'U';
    };

    useEffect(() => {
        setActiveTab(getInitialTab());
    }, [location.pathname]);

    const handleTabChange = (tab) => {
        if (tab === 'login') {
            navigate('/login');
        } else {
            navigate('/signup');
        }
    };

    const validatePhone = (phoneNumber) => {
        return /^[6-9]\d{9}$/.test(phoneNumber);
    };

    const handleSendOTP = (e) => {
        e.preventDefault();

        const phoneToValidate = activeTab === 'login' ? phone : signupData.phone;

        if (!validatePhone(phoneToValidate)) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }

        if (activeTab === 'signup') {
            if (!signupData.email) {
                alert('Please enter your email');
                return;
            }
            if (!signupData.area) {
                alert('Please select your area');
                return;
            }
        }

        setIsLoading(true);

        // Simulate OTP send delay
        setTimeout(() => {
            setIsLoading(false);
            // Navigate to OTP page with user data
            navigate('/verify-otp', {
                state: {
                    phone: phoneToValidate,
                    authType: activeTab,
                    ...(activeTab === 'signup' && {
                        firstName: signupData.firstName,
                        lastName: signupData.lastName,
                        username: generateUsername(),
                        email: signupData.email,
                        area: signupData.area
                    })
                }
            });
        }, 1000);
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-[#102216] to-[#0d1b12]">
            <main className="flex h-full w-full">
                {/* Left Side - Branding (Hidden on mobile) */}
                <div className="hidden lg:flex flex-1 flex-col justify-between p-6 xl:p-10 relative overflow-hidden">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 text-white font-extrabold text-xl xl:text-2xl z-10">
                        <div className="w-10 h-10 bg-[#13ec5b] rounded-xl flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                            </svg>
                        </div>
                        Criczz
                    </Link>

                    {/* Branding Content */}
                    <div className="text-center z-10">
                        <h1 className="text-3xl xl:text-5xl font-bold italic mb-3 bg-gradient-to-r from-[#13ec5b] to-[#0fd650] bg-clip-text text-transparent">
                            Step onto the Turf
                        </h1>
                        <p className="text-white/70 text-base xl:text-lg">
                            Join the largest community of cricket enthusiasts.
                        </p>
                    </div>

                    {/* Background Image */}
                    <div className="absolute bottom-0 left-0 right-0 h-[45%] opacity-40"
                        style={{
                            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)'
                        }}>
                        <img src={stadiumBanner} alt="Cricket Stadium" className="w-full h-full object-cover" />
                    </div>

                    {/* Trust Badges */}
                    <div className="flex justify-center gap-8 z-10">
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                            <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-5 h-5">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                            </svg>
                            Secure
                        </div>
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                            <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-5 h-5">
                                <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" />
                            </svg>
                            24/7 Support
                        </div>
                    </div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="flex-1 flex items-center justify-center bg-[#f6f8f6] p-4 sm:p-6 lg:p-8">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex justify-center mb-6">
                            <Link to="/" className="flex items-center gap-2 text-[#0d1b12] font-extrabold text-xl">
                                <div className="w-9 h-9 bg-[#13ec5b] rounded-lg flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                                </div>
                                Criczz
                            </Link>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-6 mb-6 border-b-2 border-gray-100">
                            <button
                                className={`pb-3 text-base font-semibold relative transition-opacity ${activeTab === 'login' ? 'opacity-100 text-[#0d1b12]' : 'opacity-50 text-[#0d1b12]'}`}
                                onClick={() => handleTabChange('login')}
                            >
                                Login
                                {activeTab === 'login' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#13ec5b] rounded-full" />}
                            </button>
                            <button
                                className={`pb-3 text-base font-semibold relative transition-opacity ${activeTab === 'signup' ? 'opacity-100 text-[#0d1b12]' : 'opacity-50 text-[#0d1b12]'}`}
                                onClick={() => handleTabChange('signup')}
                            >
                                Sign Up
                                {activeTab === 'signup' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#13ec5b] rounded-full" />}
                            </button>
                        </div>

                        <form onSubmit={handleSendOTP}>
                            {activeTab === 'login' ? (
                                <>
                                    <h2 className="text-xl sm:text-2xl font-bold text-[#0d1b12] mb-1">Welcome Back</h2>
                                    <p className="text-sm text-[#6b7c72] mb-5">Enter your mobile number to receive OTP</p>

                                    {/* Phone Input */}
                                    <div className="mb-5">
                                        <label className="block text-xs font-semibold text-[#0d1b12] mb-1.5">
                                            Mobile Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-[#13ec5b] focus-within:ring-2 focus-within:ring-[#13ec5b]/20 transition-all">
                                            <span className="px-3 sm:px-4 py-3 bg-[#f6f8f6] text-[#0d1b12] font-medium text-sm border-r-2 border-gray-200">+91</span>
                                            <input
                                                type="tel"
                                                className="flex-1 px-3 sm:px-4 py-3 text-sm outline-none bg-transparent"
                                                placeholder="98765 43210"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                                maxLength={10}
                                            />
                                        </div>
                                    </div>

                                    {/* Send OTP Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3.5 bg-gradient-to-r from-[#13ec5b] to-[#0fd650] rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#13ec5b]/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Sending OTP...
                                            </>
                                        ) : (
                                            <>
                                                Send OTP
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center mt-4 text-xs text-[#6b7c72]">
                                        By continuing, you agree to our <Link to="/terms" className="text-[#0d1b12] underline">Terms</Link> and <Link to="/privacy" className="text-[#0d1b12] underline">Privacy Policy</Link>.
                                    </p>

                                    <p className="text-center mt-3 text-sm text-[#6b7c72]">
                                        Don't have an account? <Link to="/signup" className="text-[#13ec5b] font-semibold hover:underline">Sign Up</Link>
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-xl sm:text-2xl font-bold text-[#0d1b12] mb-1">Create Account</h2>
                                    <p className="text-sm text-[#6b7c72] mb-5">Join the cricket community today</p>

                                    {/* Name Fields */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#0d1b12] mb-1.5">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-3 sm:px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#13ec5b] focus:ring-2 focus:ring-[#13ec5b]/20 transition-all"
                                                placeholder="Virat"
                                                value={signupData.firstName}
                                                onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-[#0d1b12] mb-1.5">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-3 sm:px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#13ec5b] focus:ring-2 focus:ring-[#13ec5b]/20 transition-all"
                                                placeholder="Kohli"
                                                value={signupData.lastName}
                                                onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Email Input */}
                                    <div className="mb-4">
                                        <label className="block text-xs font-semibold text-[#0d1b12] mb-1.5">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-[#13ec5b] focus-within:ring-2 focus-within:ring-[#13ec5b]/20 transition-all">
                                            <input
                                                type="email"
                                                className="flex-1 px-3 sm:px-4 py-3 text-sm outline-none bg-transparent"
                                                placeholder="virat@email.com"
                                                value={signupData.email}
                                                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Input */}
                                    <div className="mb-4">
                                        <label className="block text-xs font-semibold text-[#0d1b12] mb-1.5">
                                            Mobile Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-[#13ec5b] focus-within:ring-2 focus-within:ring-[#13ec5b]/20 transition-all">
                                            <span className="px-3 sm:px-4 py-3 bg-[#f6f8f6] text-[#0d1b12] font-medium text-sm border-r-2 border-gray-200">+91</span>
                                            <input
                                                type="tel"
                                                className="flex-1 px-3 sm:px-4 py-3 text-sm outline-none bg-transparent"
                                                placeholder="98765 43210"
                                                value={signupData.phone}
                                                onChange={(e) => setSignupData({ ...signupData, phone: e.target.value.replace(/\D/g, '') })}
                                                maxLength={10}
                                            />
                                        </div>
                                    </div>

                                    {/* Area Selection */}
                                    <div className="mb-5">
                                        <label className="block text-xs font-semibold text-[#0d1b12] mb-1.5">
                                            Your Area <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                className="w-full px-3 sm:px-4 py-3 text-sm border-2 border-gray-200 rounded-xl bg-white focus:border-[#13ec5b] focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all appearance-none cursor-pointer"
                                                value={signupData.area}
                                                onChange={(e) => setSignupData({ ...signupData, area: e.target.value })}
                                            >
                                                {SURAT_AREAS.map(area => (
                                                    <option key={area.id} value={area.id}>{area.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg viewBox="0 0 24 24" fill="#6b7c72" className="w-5 h-5">
                                                    <path d="M7 10l5 5 5-5z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-[#6b7c72] mt-1 flex items-center gap-1">
                                            <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-3 h-3">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                            </svg>
                                            Used for Player Matching notifications
                                        </p>
                                    </div>

                                    {/* Send OTP Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3.5 bg-gradient-to-r from-[#13ec5b] to-[#0fd650] rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#13ec5b]/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Sending OTP...
                                            </>
                                        ) : (
                                            <>
                                                Send OTP
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center mt-4 text-xs text-[#6b7c72]">
                                        By continuing, you agree to our <Link to="/terms" className="text-[#0d1b12] underline">Terms</Link> and <Link to="/privacy" className="text-[#0d1b12] underline">Privacy Policy</Link>.
                                    </p>

                                    <p className="text-center mt-3 text-sm text-[#6b7c72]">
                                        Already have an account? <Link to="/login" className="text-[#13ec5b] font-semibold hover:underline">Login</Link>
                                    </p>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Auth;
