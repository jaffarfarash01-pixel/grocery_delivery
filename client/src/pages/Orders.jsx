
import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = 1;

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/user/${userId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Could not load orders"
          );
        }

        setOrders(
          Array.isArray(data) ? data : data.orders || []
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div className="product-card" key={order.id}>
            <h3>Order #{order.id}</h3>

            <p>
              Total: ₹
              {order.totalAmount ?? order.total ?? "N/A"}
            </p>

            <p>Status: {order.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
