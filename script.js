let products = JSON.parse(localStorage.getItem("products")) || [];


// Display products when page loads
displayProducts();


// Open modal
function openModal() {

    document.getElementById("productModal").style.display = "flex";

    document.getElementById("modalTitle").innerText = "Add Product";

    document.getElementById("productForm").reset();

    document.getElementById("editId").value = "";
}


// Close modal
function closeModal() {

    document.getElementById("productModal").style.display = "none";

}


// Add / Edit Product
document.getElementById("productForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("productName").value;
    const category = document.getElementById("category").value;
    const price = Number(document.getElementById("price").value);
    const quantity = Number(document.getElementById("quantity").value);
    const minimumStock = Number(document.getElementById("minimumStock").value);
    const editId = document.getElementById("editId").value;


    // Edit existing product
    if (editId) {

        const product = products.find(p => p.id == editId);

        product.name = name;
        product.category = category;
        product.price = price;
        product.quantity = quantity;
        product.minimumStock = minimumStock;

    }

    // Add new product
    else {

        const product = {

            id: Date.now(),

            name: name,

            category: category,

            price: price,

            quantity: quantity,

            minimumStock: minimumStock

        };

        products.push(product);

    }


    saveProducts();

    closeModal();

    displayProducts();

});


// Display products
function displayProducts() {

    const table = document.getElementById("productTable");

    const search = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const category = document
        .getElementById("categoryFilter")
        .value;


    table.innerHTML = "";


    const filteredProducts = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(search);

        const matchesCategory =
            category === "all" ||
            product.category === category;

        return matchesSearch && matchesCategory;

    });


    filteredProducts.forEach(product => {

        const isLowStock =
            product.quantity <= product.minimumStock;


        const row = document.createElement("tr");

        row.innerHTML = `

            <td>
                <strong>${product.name}</strong>
            </td>

            <td>${product.category}</td>

            <td>₹${product.price.toLocaleString()}</td>

            <td>${product.quantity}</td>

            <td>

                <span class="status ${
                    isLowStock ? "low-stock" : "in-stock"
                }">

                    ${isLowStock ? "Low Stock" : "In Stock"}

                </span>

            </td>

            <td class="actions">

                <button
                    class="edit"
                    onclick="editProduct(${product.id})">
                    Edit
                </button>

                <button
                    class="delete"
                    onclick="deleteProduct(${product.id})">
                    Delete
                </button>

            </td>

        `;

        table.appendChild(row);

    });


    document.getElementById("emptyMessage").style.display =
        filteredProducts.length === 0 ? "block" : "none";


    document.getElementById("productCount").innerText =
        `${filteredProducts.length} products`;


    updateDashboard();

}


// Edit product
function editProduct(id) {

    const product = products.find(p => p.id === id);

    document.getElementById("modalTitle").innerText = "Edit Product";

    document.getElementById("editId").value = product.id;

    document.getElementById("productName").value = product.name;

    document.getElementById("category").value = product.category;

    document.getElementById("price").value = product.price;

    document.getElementById("quantity").value = product.quantity;

    document.getElementById("minimumStock").value =
        product.minimumStock;

    document.getElementById("productModal").style.display = "flex";

}


// Delete product
function deleteProduct(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this product?");

    if (!confirmDelete) return;

    products = products.filter(product => product.id !== id);

    saveProducts();

    displayProducts();

}


// Dashboard calculations
function updateDashboard() {

    const totalProducts = products.length;


    const totalStock = products.reduce(
        (total, product) =>
            total + product.quantity,
        0
    );


    const inventoryValue = products.reduce(
        (total, product) =>
            total + product.price * product.quantity,
        0
    );


    const lowStock = products.filter(
        product =>
            product.quantity <= product.minimumStock
    ).length;


    document.getElementById("totalProducts").innerText =
        totalProducts;


    document.getElementById("totalStock").innerText =
        totalStock;


    document.getElementById("inventoryValue").innerText =
        "₹" + inventoryValue.toLocaleString();


    document.getElementById("lowStock").innerText =
        lowStock;

}


// Save products to browser
function saveProducts() {

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

}