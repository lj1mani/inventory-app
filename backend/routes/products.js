const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const filePath = path.join(__dirname, "../data/products.json");

const readProducts = () =>
  JSON.parse(fs.readFileSync(filePath));

const writeProducts = (data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// GET all products
router.get("/", (req, res) => {
  const products = readProducts();
  const totalValue = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  res.json({ products, totalValue });
});

// ADD product
router.post("/", (req, res) => {
  const products = readProducts();

  const name = req.body.name?.trim();
  const price = Number(req.body.price);
  const quantity = Number(req.body.quantity);

  if (!name) {
    return res.status(400).json({ message: "Product name is required" });
  }

  // DUPLICATE CHECK (case-insensitive + trimmed)
  const existingProduct = products.find(
    p => p.name.trim().toLowerCase() === name.toLowerCase()
  );

  if (existingProduct) {
  existingProduct.quantity = Number(quantity);
  existingProduct.price = Number(price);
  writeProducts(products);
  return res.json(existingProduct);
}

  const product = {
    id: Date.now(),
    name,
    price,
    quantity
  };

  products.push(product);
  writeProducts(products);

  res.status(201).json(product);
});


// UPDATE quantity
router.put("/:id", (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id == req.params.id);

  if (!product)
    return res.status(404).json({ message: "Product not found" });

  product.quantity = Number(req.body.quantity);
  writeProducts(products);

  res.json(product);
});

// DELETE product
router.delete("/:id", (req, res) => {
  const products = readProducts().filter(p => p.id != req.params.id);
  writeProducts(products);

  res.json({ message: "Product deleted" });
});

module.exports = router;
