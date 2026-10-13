const express = require("express");
const sequelize = require("./config/database");
const { createCategory, getAllcategories } = require("./controllers/categoryController");
const router = require("./routes/productRoutes");

const cors = require("cors");

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/vendors", require("./routes/vendorRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/subscriptions", require("./routes/subscriptionRoutes"));

app.get("/", (req, res) => {
  res.json({
    message: "Grocery Delivery API is running",
  });
});


const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to database:", error.message);
  });

