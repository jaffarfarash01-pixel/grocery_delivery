
import { useEffect, useState } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Temporary customer ID from your existing database
  const userId = 1;

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : data.products || []);
      })
      .catch(() => setMessage("Could not load products"))
      .finally(() => setLoading(false));
  }, []);

  async function addToCart(productId) {
    try {
      const response = await fetch("http://localhost:5000/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not add product");
      }

      setMessage("Product added to cart!");
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (loading) return <p>Loading products...</p>;

  return (
    <>
      {message && <p>{message}</p>}

      <div className="products">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <h3>{product.name}</h3>
            <p>Price: ₹{product.price}</p>
            <p>Unit: {product.unit}</p>
            <p>Stock: {product.stock}</p>

            <button
              disabled={product.stock < 1 || product.isAvailable === false}
              onClick={() => addToCart(product.id)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default ProductList;
