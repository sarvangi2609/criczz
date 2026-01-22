// Home Page - Main Entry
// All sections are imported from separate component files

import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from './home/HeroSection';
import FeaturedBoxes from './home/FeaturedBoxes';
import HowItWorks from './home/HowItWorks';
import PopularAreas from './home/PopularAreas';

const Home = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Header / Navigation */}
            <Header />

            {/* Hero Section with Search */}
            <HeroSection />

            {/* Featured Cricket Boxes */}
            <FeaturedBoxes />

            {/* How It Works */}
            <HowItWorks />

            {/* Popular Areas */}
            <PopularAreas />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;