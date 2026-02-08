import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import stadiumBanner from '../../assets/stadium_banner.png';

const OTP = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { phone, authType, email, area } = location.state || {};

    // Redirect if no phone data
    useEffect(() => {
        if (!phone) {
            navigate('/login');
        }
    }, [phone, navigate]);

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    const handleOtpChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto focus next input
            if (value && index < 5) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pastedData) {
            const newOtp = [...otp];
            pastedData.split('').forEach((char, i) => {
                if (i < 6) newOtp[i] = char;
            });
            setOtp(newOtp);
            // Focus last filled or last input
            const lastIndex = Math.min(pastedData.length - 1, 5);
            const lastInput = document.getElementById(`otp-${lastIndex}`);
            if (lastInput) lastInput.focus();
        }
    };

    const handleResendOTP = () => {
        if (!canResend) return;

        setCanResend(false);
        setResendTimer(30);
        // Simulate resend OTP
        console.log('Resending OTP to:', phone);
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();

        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            alert('Please enter complete 6-digit OTP');
            return;
        }

        setIsLoading(true);

        // Simulate verification delay
        setTimeout(() => {
            setIsLoading(false);
            console.log('Verifying OTP:', {
                phone,
                otp: otpValue,
                authType,
                ...(authType === 'signup' && { email, area })
            });

            // On success, navigate to home or dashboard
            navigate('/');
        }, 1500);
    };

    const formatPhone = (phoneNumber) => {
        if (!phoneNumber) return '';
        return `+91 ${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`;
    };

    if (!phone) {
        return null;
    }

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
                            Almost There!
                        </h1>
                        <p className="text-white/70 text-base xl:text-lg">
                            Verify your number and start booking.
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

                {/* Right Side - OTP Form */}
                <div className="flex-1 flex items-center justify-center bg-[#f6f8f6] p-4 sm:p-6 lg:p-8">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
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

                        {/* Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-[#6b7c72] hover:text-[#0d1b12] mb-4 transition-colors"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-sm font-medium">Back</span>
                        </button>

                        <h2 className="text-xl sm:text-2xl font-bold text-[#0d1b12] mb-1">Verify OTP</h2>
                        <p className="text-sm text-[#6b7c72] mb-6">
                            We've sent a 6-digit code to <span className="font-semibold text-[#0d1b12]">{formatPhone(phone)}</span>
                        </p>

                        <form onSubmit={handleVerifyOTP}>
                            {/* OTP Input */}
                            <div className="mb-6">
                                <label className="block text-xs font-semibold text-[#0d1b12] mb-3">Enter OTP</label>
                                <div className="flex gap-2 sm:gap-3 justify-center">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            className="w-11 h-13 sm:w-12 sm:h-14 border-2 border-gray-200 rounded-xl text-center text-xl font-bold focus:border-[#13ec5b] focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            onPaste={index === 0 ? handleOtpPaste : undefined}
                                            maxLength={1}
                                            autoComplete="one-time-code"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Resend OTP */}
                            <div className="text-center mb-6">
                                {canResend ? (
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        className="text-sm font-semibold text-[#13ec5b] hover:underline"
                                    >
                                        Resend OTP
                                    </button>
                                ) : (
                                    <p className="text-sm text-[#6b7c72]">
                                        Resend OTP in <span className="font-semibold text-[#0d1b12]">{resendTimer}s</span>
                                    </p>
                                )}
                            </div>

                            {/* Verify Button */}
                            <button
                                type="submit"
                                disabled={isLoading || otp.join('').length !== 6}
                                className="w-full py-3.5 bg-gradient-to-r from-[#13ec5b] to-[#0fd650] rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#13ec5b]/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Verify & {authType === 'signup' ? 'Sign Up' : 'Login'}
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            {/* Info */}
                            <div className="mt-6 p-4 bg-[#f6f8f6] rounded-xl">
                                <div className="flex gap-3">
                                    <svg viewBox="0 0 24 24" fill="#13ec5b" className="w-5 h-5 shrink-0">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                    </svg>
                                    <p className="text-xs text-[#6b7c72]">
                                        Didn't receive the code? Check your SMS inbox or try resending after the timer expires.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OTP;
