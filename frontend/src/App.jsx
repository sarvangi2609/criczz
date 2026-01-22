import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Auth from './pages/auth/Auth';
import Boxes from './pages/boxes/Boxes';
import BoxDetails from './pages/box/BoxDetails';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth />} />
                <Route path="/boxes" element={<Boxes />} />
                <Route path="/book" element={<Boxes />} />
                <Route path="/box/:slug" element={<BoxDetails />} />
            </Routes>
        </Router>
    );
}

export default App;

