const express = require("express");
const path = require("path");
const productRoutes = require("./routes/products");

const app = express();

app.use(express.json());
app.use("/api/products", productRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Inventory app running at http://localhost:${PORT}`);
});
