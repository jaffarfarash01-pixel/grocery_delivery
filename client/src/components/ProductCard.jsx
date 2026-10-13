
function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>

      <p>Price: ₹{Number(product.price).toFixed(2)}</p>
      <p>Unit: {product.unit}</p>
      <p>Stock: {product.stock}</p>

      <button
        onClick={() => onAddToCart(product.id)}
        disabled={product.stock <= 0}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
