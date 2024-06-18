let currentUser;
let token;
let cart = [];
let products = [];
let productStocks = {};

// login modal functions
const openLogin = (e) => {
  const loginContainer = document.querySelector("#login");
  loginContainer.style.display = "grid";
};
const closeLogin = (e) => {
  const loginContainer = document.querySelector("#login");
  loginContainer.style.display = "none";
};

document.addEventListener("DOMContentLoaded", () => {
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  token = localStorage.getItem("token");
  fetchProducts();
  displayUserInfo();
  showAdminPanel();
  setupCart();

  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-button");

  if (currentUser) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
  } else {
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
  }

  const checkoutButton = document.querySelector('button[onclick="checkout()"]');
  if (checkoutButton) {
    checkoutButton.removeEventListener("click", checkout); // Remove incorrect event listener
    checkoutButton.addEventListener("click", checkout);
  }

  const emptyCartButton = document.getElementById("empty-cart-button");
  if (emptyCartButton) {
    emptyCartButton.addEventListener("click", emptyCart);
  }

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", login);
  }

  const cart = document.querySelector(".cart-container");

  const addAllButton = document.createElement("button");
  addAllButton.textContent = "Add All to Cart";
  cart.appendChild(addAllButton);
  addAllButton.addEventListener("click", () => {
    products.forEach((product) => {
      addToCart(product._id, product.price);
    });
  });

  //!! Login Container

  loginBtn.addEventListener("click", openLogin);

  const loginCloseBtn = document.querySelector(".close-login");
  loginCloseBtn.addEventListener("click", closeLogin);
});

async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:8080/api/products");
    products = await response.json(); // Update products
    products.forEach((product) => {
      productStocks[product._id] = product.stock; // Initialize the stock for each product
    });
    displayProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function displayProducts(products) {
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.innerHTML = "";

  products.forEach((product) => {
    productStocks[product._id] = product.stock; // Initialize the stock for this product

    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item", "grid-item-xl");
    gridItem.setAttribute("data-product-id", product._id);
    gridItem.innerHTML = `
            <img src="${product.images[0].url}" alt="${product.name}">
            <div class="overlay">${
              product.name
            } - <span class="price-span">SilkyDinars:${product.price} - Q:${
      productStocks[product._id]
    }<span></div>
        `;
    const addToCartButton = document.createElement("button");
    addToCartButton.textContent = "+";
    gridItem.appendChild(addToCartButton);
    gridContainer.appendChild(gridItem);
  });

  document.querySelectorAll(".grid-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.parentElement.getAttribute("data-product-id");
      addToCart(productId);
      productStocks[productId]--; // Reduce the stock for this product
      button.parentElement.querySelector(".overlay").textContent = `${
        products.find((p) => p._id === productId).name
      } - SilkyDinars:${products.find((p) => p._id === productId).price} - Q:${
        productStocks[productId]
      }`; // Update the displayed stock
    });
  });
}

function addToCart(productId) {
  const product = products.find((p) => p._id === productId);
  if (!product) {
    console.error("Product not found");
    return;
  }
  if (product.stock < 1) {
    alert("Product is out of stock");
  } else {
    const existingItem = cart.find((item) => item._id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    product.stock -= 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
    displayProducts(products);
  }
}

function setupCart() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  cart.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Name: ${item.name}, Price: $${item.price}, Quantity: ${item.quantity}`;
    cartItems.appendChild(listItem);
  });
  const cartContainer = document.querySelector(".cart-container");
  if (cart.length > 0) {
    cartContainer.style.zIndex = 3;
    cartContainer.style.opacity = 1;
  } else {
    cartContainer.style.zIndex = -8;
    cartContainer.style.opacity = 0;
  }
}
async function checkout() {
  const total = cart.reduce((sum, product) => sum + product.price, 0);

  if (total > currentUser.credits) {
    alert("Insufficient credits!");
    return;
  }

  // Get product IDs from the cart
  const productIds = cart.map((product) => product._id);

  try {
    // Send a request to the server-side function
    const response = await fetch(
      "http://localhost:8080/api/users/purchase-product",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: currentUser._id,
          productIds: productIds,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Update the current user's credits
    currentUser.credits = data.user.credits;

    // Clear the cart
    cart = [];
    localStorage.removeItem("cart");
    updateCartDisplay();
    displayUserInfo();
    alert("Purchase successful!");
    displayProducts(products);
  } catch (error) {
    console.error("Error during purchase:", error);
    alert("Purchase failed!");
    displayProducts(products);
  }
}
async function addCredits(event) {
  event.preventDefault();
  const userId = currentUser._id;
  const credits = parseInt(document.getElementById("credits").value);

  try {
    const response = await fetch(
      "http://localhost:8080/api/users/add-credits",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, credits }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      document.getElementById("admin-status").textContent =
        "Credits added successfully!";
      currentUser.credits += credits;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      displayUserInfo();
    } else {
      document.getElementById(
        "admin-status"
      ).textContent = `Failed to add credits: ${data.message}`;
    }
  } catch (error) {
    console.error("Error adding credits:", error);
    document.getElementById("admin-status").textContent =
      "Error adding credits";
  }
}

async function login(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-button");
  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      document.getElementById("login-status").textContent = "Login successful!";
      window.location.reload(); // Refresh to update UI based on login status
      loginBtn.style.display = "none";
      logoutBtn.style.display = "block";
    } else {
      document.getElementById("login-status").textContent =
        "Login failed: " + data.message;
    }
  } catch (error) {
    document.getElementById("login-status").textContent =
      "Error: " + error.message;
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");
  currentUser = null;
  document.getElementById("login-status").textContent = "";
  showAdminPanel();
  displayUserInfo();
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-button");
  loginBtn.style.display = "block";
  logoutBtn.style.display = "none";
}

async function fetchCurrentUser() {
  const token = localStorage.getItem("token"); // Replace this with the actual way you're storing the token
  const response = await fetch("http://localhost:8080/api/currentUser", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const currentUser = await response.json();
    return currentUser;
  } else {
    console.error("Failed to fetch current user:", response.statusText);
    return null;
  }
}

async function displayUserInfo() {
  const userInfo = document.getElementById("user-info");
  const currentUser = await fetchCurrentUser();
  if (currentUser) {
    userInfo.textContent = `User ID: ${currentUser.id}, Name: ${currentUser.firstname} ${currentUser.lastname}, Silky Dinars: ${currentUser.credits}`;
  } else {
    userInfo.textContent = "No user is currently logged in.";
  }
}

function emptyCart() {
  cart = [];
  localStorage.removeItem("cart");
  updateCartDisplay();
  //   alert("Cart emptied!");
  products = fetchProducts();
  displayProducts(products);
}

function showAdminPanel() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const isAdmin = user && user.isAdmin;

  if (isAdmin) {
    document.getElementById("admin").style.display = "block";
  } else {
    document.getElementById("admin").style.display = "none";
  }
}
