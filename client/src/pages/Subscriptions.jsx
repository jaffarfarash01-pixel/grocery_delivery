
function Subscriptions() {
  const plans = [
    {
      id: 1,
      name: "Daily Essentials",
      description:
        "Essential groceries for your everyday needs.",
      price: 499,
      period: "week",
    },
    {
      id: 2,
      name: "Family Basket",
      description:
        "A grocery package suitable for the whole family.",
      price: 999,
      period: "week",
    },
    {
      id: 3,
      name: "Fresh Basket",
      description:
        "Fresh fruits and vegetables for your home.",
      price: 299,
      period: "week",
    },
  ];

  return (
    <div>
      <h2>Grocery Subscription Plans</h2>
      <p>Choose a plan that suits your grocery needs.</p>

      <div className="products">
        {plans.map((plan) => (
          <div className="product-card" key={plan.id}>
            <h3>{plan.name}</h3>

            <p>{plan.description}</p>

            <h2>₹{plan.price}</h2>
            <p>Per {plan.period}</p>

            <button
              onClick={() =>
                alert(
                  "Subscription plans are for demonstration. Subscription booking is not available yet."
                )
              }
            >
              View Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subscriptions;
