const list = document.getElementById("products");
const totalSpan = document.getElementById("total");

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
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const quantity = document.getElementById("quantity").value;

  await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, quantity })
  });

  loadProducts();
};

const removeProduct = async (id) => {
  await fetch(`/api/products/${id}`, { method: "DELETE" });
  loadProducts();
};

loadProducts();
