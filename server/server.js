const express = require("express");
const sequelize = require("./config/database");

const app = express();

app.use(express.json());

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