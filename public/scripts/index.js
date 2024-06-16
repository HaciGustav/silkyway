const scrollers = document.querySelectorAll('.h-scroll-container');

if (!window.matchMedia('(prefers-reduces-motion: reduced)').matches) {
    initAnimations();
}

function initAnimations() {
    scrollers.forEach(scroller => {
        scroller.setAttribute('data-animated', true);
        const scroller_inner = scroller.querySelector('.h-scroll-wrapper');
        const scroller_content = Array.from(scroller_inner.children);
        scroller_content.forEach(elmnt => {
            const duplicate = elmnt.cloneNode(true);
            duplicate.setAttribute('aria-hidden', true);
            scroller_inner.appendChild(duplicate);
        });
    });
}

function filter(elmnt, category) {
    Array.from(elmnt.parentElement.querySelectorAll('li')).forEach(filter => {
        filter.classList.remove('active');
    });
    elmnt.classList.add('active');
    Array.from(elmnt.parentElement.parentElement.querySelector('.filter-container-items').children).forEach(item => {
        if (category !== 'all' && !Array.from(item.classList).includes(category)) {
            item.classList.add('hidden');
        } else {
            item.classList.remove('hidden');
        }
    });
}

async function addCredits(userId, credits) {
    try {
        const token = localStorage.getItem('token'); // Retrieve token from local storage or wherever it's stored
        const response = await fetch('http://localhost:8080/api/users/add-credits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include token in request
            },
            body: JSON.stringify({ userId, credits }),
        });
        const data = await response.json();
        console.log(data); // Handle response as needed
        // Optionally update UI or show a message indicating success/failure
    } catch (error) {
        console.error('Error adding credits:', error);
        // Handle error scenario, show error message to user, etc.
    }
}

async function purchaseProduct(userId, productId) {
    try {
        const response = await fetch('http://localhost:8080/api/users/purchase-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, productId }),
        });
        const data = await response.json();
        console.log(data); // Handle response as needed
        // Optionally update UI or show a message indicating success/failure
    } catch (error) {
        console.error('Error purchasing product:', error);
        // Handle error scenario, show error message to user, etc.
    }
}

async function register(event) {
    event.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const firstname = document.getElementById('reg-firstname').value;
    const lastname = document.getElementById('reg-lastname').value;
    const address = document.getElementById('reg-address').value;

    try {
        const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, firstname, lastname, address }),
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('register-status').textContent = 'Registration successful!';
        } else {
            document.getElementById('register-status').textContent = `Registration failed: ${data.message}`;
        }
    } catch (error) {
        console.error('Error registering:', error);
        document.getElementById('register-status').textContent = 'Error registering';
    }
}

let currentUser = JSON.parse(localStorage.getItem('currentUser'));
const token = localStorage.getItem('token');

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
            localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Store user info in localStorage
            localStorage.setItem('token', data.token); // Store token in localStorage
            document.getElementById('login-status').textContent = 'Login successful!';
            document.getElementById('user-id-display').textContent = `UserID: ${currentUser.id}`; // Display UserID
            showAdminPanel();
            // Show the admin panel if the user is an admin
        } else {
            document.getElementById('login-status').textContent = `Login failed: ${data.message}`;
        }
    } catch (error) {
        console.error('Error logging in:', error);
        document.getElementById('login-status').textContent = 'Error logging in';
    }
}
function showAdminPanel() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const isAdmin = user && user.isAdmin; // Check if user exists and is an admin

    if (isAdmin) {
        document.getElementById('admin').style.display = 'block';
    } else {
        document.getElementById('admin').style.display = 'none';
    }
}
// Call showAdminPanel on page load to check if the user is an admin
document.addEventListener('DOMContentLoaded', showAdminPanel);

let cart = [];

function addToCart(productId) {
    cart.push(productId);
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
    if (!currentUser) {
        alert('Please login to checkout');
        return;
    }

    try {
        console.log('Checkout:', currentUser, cart); // Debug log
        const response = await fetch('http://localhost:8080/api/users/purchase-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token in request
            },
            body: JSON.stringify({ userId: currentUser._id, productIds: cart }),
        });
        const data = await response.json();
        console.log('Checkout response:', data); // Debug log
        if (response.ok) {
            alert('Purchase successful!');
            cart = [];
            updateCartDisplay();
        } else {
            alert(`Purchase failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('Error during checkout');
    }
}

// Example: Add event listeners to your product buttons
document.querySelectorAll('.grid-item button').forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.getAttribute('data-product-id');
        addToCart(productId);
    });
});

// Ensure user is loaded on page load
document.addEventListener('DOMContentLoaded', () => {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    showAdminPanel();
});

async function addCredits(event) {
    event.preventDefault();
    const userId = document.getElementById('user-id').value;
    const credits = document.getElementById('credits').value;

    try {
        const response = await fetch('http://localhost:8080/api/users/add-credits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming the token is stored in local storage
            },
            body: JSON.stringify({ userId, credits })
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('admin-status').textContent = 'Credits added successfully!';
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
}

document.getElementById('logout-button').addEventListener('click', logout);
