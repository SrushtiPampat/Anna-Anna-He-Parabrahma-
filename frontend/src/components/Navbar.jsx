import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
    const { totalItems } = useCart();

    return (
        <nav className="navbar">

            <div className="logo">
                <h2>🌿 ANNA</h2>
                <p>Anna He Purna Brahma</p>
            </div>

            <div className="nav-links">

                <NavLink to="/">Home</NavLink>

                <NavLink to="/order">Order Food</NavLink>

                <NavLink to="/rescue">Rescue Food</NavLink>

                <NavLink to="/about">About</NavLink>

                <Link to="/checkout" className="cart-nav-link">
                    🛒 Cart ({totalItems})
                </Link>

            </div>

            <button className="signin-btn">
                Sign In
            </button>

        </nav>
    );
}

export default Navbar;