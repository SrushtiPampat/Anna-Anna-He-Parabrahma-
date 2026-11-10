
import './App.css';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import OrderFood from './pages/OrderFood';
import RestaurantDetails from './pages/RestaurantDetails';
import RescueFood from './pages/RescueFood';
import About from './pages/About';
import Checkout from './pages/Checkout';

function App() {
    return (
        <>
            <Navbar />

            <Routes>

                {/* Home Page */}
                <Route path="/" element={<Home />} />

                {/* Food Ordering */}
                <Route path="/order" element={<OrderFood />} />

                {/* Individual Restaurant Menu */}
                <Route
                    path="/restaurant/:id"
                    element={<RestaurantDetails />}
                />

                {/* Food Rescue */}
                <Route path="/rescue" element={<RescueFood />} />

                {/* Common Cart and Checkout Dashboard */}
                <Route path="/checkout" element={<Checkout />} />

                {/* About Page */}
                <Route path="/about" element={<About />} />

                {/* Invalid URL */}
                <Route
                    path="*"
                    element={
                        <h2 style={{ textAlign: "center", margin: "50px" }}>
                            404 - Page Not Found
                        </h2>
                    }
                />

            </Routes>
        </>
    );
}

export default App;
