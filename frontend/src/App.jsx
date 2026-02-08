import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Auth from './pages/auth/Auth';
import OTP from './pages/auth/OTP';
import Boxes from './pages/boxes/Boxes';
import BoxDetails from './pages/box/BoxDetails';
import ConfirmBooking from './pages/booking/ConfirmBooking';
import FindTeam from './pages/findteam/FindTeam';
import Dashboard from './pages/dashboard/Dashboard';
import Tournaments from './pages/tournaments/Tournaments';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth />} />
                <Route path="/verify-otp" element={<OTP />} />
                <Route path="/boxes" element={<Boxes />} />
                <Route path="/book" element={<Boxes />} />
                <Route path="/box/:slug" element={<BoxDetails />} />
                <Route path="/confirm-booking" element={<ConfirmBooking />} />
                <Route path="/find-team" element={<FindTeam />} />
                <Route path="/find-players" element={<FindTeam />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-bookings" element={<Dashboard />} />
                <Route path="/tournaments" element={<Tournaments />} />
            </Routes>
        </Router>
    );
}

export default App;
