let currentUser;
let token;
let cart = [];
let products = [];

document.addEventListener('DOMContentLoaded', () => {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    token = localStorage.getItem('token');
    fetchProducts();
    displayUserInfo();
    showAdminPanel();
    setupCart();
    

    const checkoutButton = document.querySelector('button[onclick="checkout()"]');
    if (checkoutButton) {
        checkoutButton.removeEventListener('click', checkout); // Remove incorrect event listener
        checkoutButton.addEventListener('click', checkout);
    }

    const emptyCartButton = document.getElementById('empty-cart-button');
    if (emptyCartButton) {
        emptyCartButton.addEventListener('click', emptyCart);
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }
    
    const addAllButton = document.createElement('button');
    addAllButton.textContent = 'Add All to Cart';
    document.body.appendChild(addAllButton);
    addAllButton.addEventListener('click', () => {
        products.forEach(product => {
            
            addToCart(product._id, product.price);
        });
    });

});

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:8080/api/products');
        products = await response.json(); // Update products
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(products) {
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = '';

    products.forEach(product => {
        console.log('Product ID:', product._id); // Debug line

        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item', 'grid-item-xl');
        gridItem.setAttribute('data-product-id', product._id);
        gridItem.innerHTML = `
            <img src="${product.images[0].url}" alt="${product.name}">
            <div class="overlay">${product.name}</div>
        `;
        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.dataset.productId = product._id;
        addToCartButton.style.backgroundColor = '#4CAF50';
        addToCartButton.style.border = 'none';
        addToCartButton.style.color = 'white';
        addToCartButton.style.padding = '10px 20px';
        addToCartButton.style.textAlign = 'center';
        addToCartButton.style.textDecoration = 'none';
        addToCartButton.style.display = 'inline-block';
        addToCartButton.style.fontSize = '16px';
        addToCartButton.style.margin = '10px';
        addToCartButton.style.cursor = 'pointer';
        addToCartButton.style.transitionDuration = '0.4s';
        
        addToCartButton.onmouseover = function() {
            this.style.backgroundColor = '#45a049';
        };
        addToCartButton.onmouseout = function() {
            this.style.backgroundColor = '#4CAF50';
        };

        gridItem.appendChild(addToCartButton);
        console.log('Grid Item:', gridItem); // Debug line
        gridContainer.appendChild(gridItem);
    });

    document.querySelectorAll('.grid-item button').forEach(button => {
        console.log('Button:', button); // Debug line
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
}

function addToCart(productId, productPrice) {
    const product = products.find(p => p._id === productId);
    if (!product) {
        console.error('Product not found');
        return;
    }

    cart.push({ ...product, price: productPrice });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function setupCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay();
}

function setupCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    cart.forEach(productId => {
        const listItem = document.createElement('li');
        listItem.textContent = `Product ID: ${productId}`;
        cartItems.appendChild(listItem);
    });
}

function checkout() {
    const total = cart.reduce((sum, product) => sum + product.price, 0);

    if (total > currentUser.credits) {
        alert('Insufficient credits!');
        return;
    }

    currentUser.credits -= total;
    cart = [];
    localStorage.removeItem('cart');
    updateCartDisplay();
    displayUserInfo();

    alert('Purchase successful!');
}
async function addCredits(event) {
    event.preventDefault();
    const userId = currentUser._id;
    const credits = parseInt(document.getElementById('credits').value);

    try {
        const response = await fetch('http://localhost:8080/api/users/add-credits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, credits }),
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('admin-status').textContent = 'Credits added successfully!';
            currentUser.credits += credits;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            displayUserInfo();
        } else {
            document.getElementById('admin-status').textContent = `Failed to add credits: ${data.message}`;
        }
    } catch (error) {
        console.error('Error adding credits:', error);
        document.getElementById('admin-status').textContent = 'Error adding credits';
    }
}

async function login(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            document.getElementById('login-status').textContent = 'Login successful!';
            window.location.reload(); // Refresh to update UI based on login status
        } else {
            document.getElementById('login-status').textContent = 'Login failed: ' + data.message;
        }
    } catch (error) {
        document.getElementById('login-status').textContent = 'Error: ' + error.message;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    currentUser = null;
    document.getElementById('login-status').textContent = '';
    showAdminPanel();
    displayUserInfo();
}

function displayUserInfo() {
    const userInfo = document.getElementById('user-info');
    if (currentUser) {
        userInfo.textContent = `Logged in as: ${currentUser.email} ${currentUser.firstname} ${currentUser.lastname} (ID: ${currentUser._id}, Coins: ${currentUser.credits})`;
    } else {
        userInfo.textContent = '';
    }
}

function emptyCart() {
    cart = [];
    localStorage.removeItem('cart');
    updateCartDisplay();
}

function showAdminPanel() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const isAdmin = user && user.isAdmin;

    if (isAdmin) {
        document.getElementById('admin').style.display = 'block';
    } else {
        document.getElementById('admin').style.display = 'none';
    }
}
