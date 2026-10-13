
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Subscriptions from "./pages/Subscriptions";
import Footer from "./components/Footer";

import Navbar from "./components/Navbar";
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
        <Navbar />

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

         <Footer
    storeName="FreshBasket"
    message="Fresh groceries, delivered to your door."
  />

      </div>
    </BrowserRouter>
  );
}

export default App;
