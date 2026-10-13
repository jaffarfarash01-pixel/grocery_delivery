import { useEffect, useState } from "react";

function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/cart/1")
      .then((res) => {
        if (!res.ok) throw new Error("Could not load cart");
        return res.json();
      })
      .then(setCart)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>{error}</p>;
  if (!cart) return <p>Loading cart...</p>;

  return (
    <div>
      <h2>My Cart</h2>

      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.items.map((item) => (
          <div className="product-card" key={item.id}>
            <h3>{item.product.name}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ₹{item.product.price}</p>
          </div>
        ))
      )}

      <h3>Total: ₹{cart.total}</h3>
    </div>
  );
}

export default Cart;