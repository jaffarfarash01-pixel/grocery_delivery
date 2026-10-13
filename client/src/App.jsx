import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProductList from "./ProductList";
import Cart from "./Cart";
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
            <Link to="/">Home</Link> | <Link to="/cart">My Cart</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;