document.addEventListener('DOMContentLoaded', async () => {
    const products = await fetchProducts();
    displayProducts(products);
});

const fetchProducts = async () => {
    try {
        const response = await fetch('https://dummyjson.com/products?limit=30');
        const data = await response.json();
        console.log(data.products); // Log the product data for debugging
        return data.products;
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const displayProducts = (products) => {
    const container = document.getElementById('product-list');
    if (!container) {
        console.error('Container #product-list not found.');
        return;
    }

    container.innerHTML = '';

    products.forEach(product => {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item', 'grid-item-xl');
        gridItem.innerHTML = `
            <a href="${product.url}" target="_blank">
                <img src="${product.thumbnail}" alt="${product.title}">
                <div class="overlay">
                    ${product.title} - <span class="price-span">$${product.price.toFixed(2)}</span>
                </div>
            </a>
            <p>Rating: ${product.rating} (${product.stock} reviews)</p>
        `;
        container.appendChild(gridItem);
    });
};

