
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Subscriptions from "./pages/Subscriptions";
import "./App.css";

function Home() {
  return (
    <>
      <h2>Available Products</h2>
      <ProductList />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <header>
          <h1>FreshBasket</h1>
          <p>Fresh groceries, delivered to your door.</p>

          <nav>
            <Link to="/">Home</Link>
            {" | "}
            <Link to="/cart">My Cart</Link>
            {" | "}
            <Link to="/orders">My Orders</Link>
            {" | "}
            <Link to="/subscriptions">Subscriptions</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route
              path="/subscriptions"
              element={<Subscriptions />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
