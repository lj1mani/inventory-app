const list = document.getElementById("products");
const totalSpan = document.getElementById("total");

const showMessage = (text) => {
  const msg = document.getElementById("message");
  msg.innerText = text;
  msg.classList.add("show");

  // Hide after 10 seconds
  setTimeout(() => {
    msg.classList.remove("show");
  }, 10000);
};


const loadProducts = async () => {
  const res = await fetch("/api/products");
  const data = await res.json();

  list.innerHTML = "";
  totalSpan.innerText = data.totalValue.toFixed(2);

data.products.forEach(p => {
  const li = document.createElement("li");

  // Base class for every product
  li.classList.add("product-item");

  // Add class if stock is low
  if (p.quantity < 5) {
    li.classList.add("low-stock");
  }

  li.innerHTML = `
    <strong>${p.name}</strong><br>
    €${p.price} x ${p.quantity}
    <button onclick="removeProduct(${p.id})">❌</button>
  `;

  list.appendChild(li);
});

};

const addProduct = async () => {
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const quantity = document.getElementById("quantity").value.trim();

 
  // All errors
  let errors = [];

  if (!name) {
    errors.push("Product name is required");
  }

  if (!price || isNaN(price) || Number(price) <= 0) {
    errors.push("Price must be a number greater than 0");
  }

  if (!quantity || isNaN(quantity) || Number(quantity) < 0) {
    errors.push("Quantity must be a number 0 or more");
  }

  // If there are any errors, show them all together
  if (errors.length > 0) {
    showMessage("⚠️\n" + errors.join("\n"));
    return;
  }
  try {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, quantity })
    });

    if (!res.ok) {
      const error = await res.json();
      showMessage("⚠️ " + error.message); // backend validation
      return;
    }

    // Clear inputs after successful addition
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("quantity").value = "";

    // Reload product list
    loadProducts();

  } catch (err) {
    console.error(err);
    showMessage("⚠️ Something went wrong!");
  }
};



const removeProduct = async (id) => {
  await fetch(`/api/products/${id}`, { method: "DELETE" });
  loadProducts();
};

loadProducts();






