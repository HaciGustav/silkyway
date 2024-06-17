let currentUser;
let token;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    token = localStorage.getItem('token');
    displayUserInfo();
    showAdminPanel();
    setupCart();

    document.querySelectorAll('.grid-item button').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-product-id');
            addToCart(productId);
        });
    });

    if (document.getElementById('logout-button')) {
        document.getElementById('logout-button').addEventListener('click', logout);
    }

    if (currentUser && currentUser.isAdmin) {
        // Display admin panel if the user is an admin
        document.getElementById('admin').style.display = 'block';
    } else {
        document.getElementById('admin').style.display = 'none';
    }
});

function setupCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay();
}

function addToCart(productId) {
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
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

async function checkout() {
    const userId = currentUser._id;
    if (cart.length === 0) {
        console.error('Cart is empty');
        return;
    }

    console.log('Starting checkout process...');
    console.log('User ID:', userId);
    console.log('Cart:', cart);

    try {
        const response = await fetch('http://localhost:8080/api/users/purchase-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, productIds: cart }),
        });

        const data = await response.json();
        console.log('Response:', response);
        console.log('Response Data:', data);

        if (response.ok) {
            console.log('Purchase successful', data);
            cart = [];
            localStorage.removeItem('cart');
            updateCartDisplay();
        } else {
            console.error('Purchase failed:', data.message);
        }
    } catch (error) {
        console.error('Error purchasing products:', error);
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
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('token', data.token);
            document.getElementById('login-status').textContent = 'Login successful!';
            displayUserInfo();
            showAdminPanel();
        } else {
            document.getElementById('login-status').textContent = `Login failed: ${data.message}`;
        }
    } catch (error) {
        console.error('Error logging in:', error);
        document.getElementById('login-status').textContent = 'Error logging in';
    }
}

async function addCredits(event) {
    event.preventDefault();
    const userId = currentUser._id; // Assuming you want to add credits to the currently logged-in user
    const credits = parseInt(document.getElementById('credits').value); // Parse to integer

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
            // Update local user's credits
            currentUser.credits += credits;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            displayUserInfo(); // Update UI with new credits
        } else {
            document.getElementById('admin-status').textContent = `Failed to add credits: ${data.message}`;
        }
    } catch (error) {
        console.error('Error adding credits:', error);
        document.getElementById('admin-status').textContent = 'Error adding credits';
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

function showAdminPanel() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const isAdmin = user && user.isAdmin;

    if (isAdmin) {
        document.getElementById('admin').style.display = 'block';
    } else {
        document.getElementById('admin').style.display = 'none';
    }
}
