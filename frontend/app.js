const list = document.getElementById("products");
const totalSpan = document.getElementById("total");

const showMessage = (text, type = "error") => {
  const msg = document.getElementById("message");
  msg.innerText = text;

  // Reset classes
  msg.className = "message";

  // Add appropriate class
  if (type === "success") {
    msg.classList.add("success");
  } else {
    msg.classList.add("show"); // default error
  }

  // Hide after 6 seconds
  setTimeout(() => {
    msg.className = "message";
  }, 6000);
};



const loadProducts = async () => {
  const res = await fetch("/api/products");
  const data = await res.json();

  const tbody = document.getElementById("products-tbody");
  tbody.innerHTML = "";

  let total = 0;

  data.products.forEach(p => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.name}</td>
      <td>€${p.price}</td>
      <td>${p.quantity}</td>
      <td>
        <button onclick="removeProduct(${p.id})">❌</button>
      </td>
    `;

    tbody.appendChild(tr);
    total += p.price * p.quantity;
  });

  document.getElementById("total").innerText = total.toFixed(2);
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

    showMessage("✅ Product added successfully!", "success");


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

function showTab(tab) {
  const tabs = ['add', 'list'];
  tabs.forEach(t => {
    document.getElementById(`tab-${t}`).style.display = (t === tab) ? 'block' : 'none';
    document.querySelector(`.tab-button[onclick="showTab('${t}')"]`)
            .classList.toggle('active', t === tab);
  });
}


loadProducts();