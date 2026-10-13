
import { useEffect, useState } from "react";

function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [placingOrder, setPlacingOrder] = useState(false);

  const userId = 1;

  // Load cart from backend
  async function loadCart() {
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${userId}`
      );

      if (!response.ok) {
        throw new Error("Could not load cart");
      }

      const data = await response.json();

      setCart(data.cart);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  // Place order
  async function placeOrder() {
    try {
      setPlacingOrder(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not place order");
      }

      alert("Order placed successfully!");

      // Refresh cart after successful order
      await loadCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacingOrder(false);
    }
  }

  if (!cart && !error) {
    return <p>Loading cart...</p>;
  }

  if (error && !cart) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>My Cart</h2>

      {error && <p>{error}</p>}

      {!cart.items || cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.items.map((item) => (
          <div className="product-card" key={item.id}>
            <h3>{item.product?.name || "Grocery Product"}</h3>

            <p>Quantity: {item.quantity}</p>

            <p>
              Price: ₹{item.product?.price ?? "N/A"}
            </p>
          </div>
        ))
      )}

      <h3>Total: ₹{total}</h3>

      <button
        onClick={placeOrder}
        disabled={
          placingOrder ||
          !cart.items ||
          cart.items.length === 0
        }
      >
        {placingOrder ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}

export default Cart;
