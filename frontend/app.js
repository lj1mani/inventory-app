// --- Global Selectors & State ---
const list = document.getElementById("products");
const totalSpan = document.getElementById("total");

let allProducts = [];

// Displays feedback messages (errors or success) to the user
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

// Updates the HTML table with the provided product array
const renderProducts = (products) => {
    const tbody = document.getElementById("products-tbody");
    tbody.innerHTML = "";

    let total = 0;

    products.forEach(p => {
        const tr = document.createElement("tr");

        if (p.quantity < 5) {
            tr.classList.add("low-stock");
        }

        tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${p.price} €</td>
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

// Filters the cached 'allProducts' based on search text and category dropdown
const filterProducts = () => {
    const search = document.getElementById("search").value.toLowerCase();
    const category = document.getElementById("filter-category").value;

    const filtered = allProducts.filter(p => {
        const matchesName = p.name.toLowerCase().startsWith(search);
        const matchesCategory = !category || p.category === category;
        return matchesName && matchesCategory;
    });

    renderProducts(filtered);
};


// Fetches the product list from the server and refreshes the UI
const loadProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();

    allProducts = data.products;
    renderProducts(allProducts);

    const tbody = document.getElementById("products-tbody");
    tbody.innerHTML = "";

    allProducts = data.products;
    renderProducts(allProducts);

};

// Validates form input and sends a POST request to create a new product
const addProduct = async () => {
    const name = document.getElementById("name").value.trim();
    const category = document.getElementById("filter-category").value;
    const price = document.getElementById("price").value.trim();
    const quantity = document.getElementById("quantity").value.trim();



    // All errors
    let errors = [];

    if (!name) {
        errors.push("Product name is required");
    }

    if (!category) {
        errors.push("Category is required");
    }

    if (!price || isNaN(price) || Number(price) <= 0) {
        errors.push("Price must be a number greater than 0");
    }

    if (!quantity || isNaN(quantity) || Number(quantity) < 1) {
        errors.push("Quantity must be a number 1 or more");
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
            body: JSON.stringify({ name, category, price, quantity })
        });

        if (!res.ok) {
            const error = await res.json();
            showMessage("⚠️ " + error.message); // backend validation
            return;
        }


        // Clear inputs after successful addition
        document.getElementById("name").value = "";
        document.getElementById("filter-category").value = "";
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


// Deletes a product by ID and refreshes the list
const removeProduct = async (id) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadProducts();
};

// Tab Switcher logic
function showTab(tab) {
    const tabs = ['add', 'list'];
    tabs.forEach(t => {
        document.getElementById(`tab-${t}`).style.display = (t === tab) ? 'block' : 'none';
        document.querySelector(`.tab-button[onclick="showTab('${t}')"]`)
            .classList.toggle('active', t === tab);
    });
}


loadProducts();