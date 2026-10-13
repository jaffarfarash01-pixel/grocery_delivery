
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        FreshBasket
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/cart">My Cart</Link>
        <Link to="/orders">My Orders</Link>
        <Link to="/subscriptions">Subscriptions</Link>
      </div>
    </nav>
  );
}

export default Navbar;
