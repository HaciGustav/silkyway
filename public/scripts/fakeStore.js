document.addEventListener('DOMContentLoaded', async () => {
    const products = await fetchProducts();
    displayProducts(products);
});

const fetchProducts = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/products?limit=10');
        const data = await response.json();
        console.log(data); // Logging the data to the console for debugging
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const displayProducts = (products) => {
    const container = document.getElementById('amazon-products');
    container.innerHTML = '';

    products.forEach(product => {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item', 'grid-item-xl');
        gridItem.innerHTML = `
            <a href="${product.link}" target="_blank">
                <img src="${product.image}" alt="${product.title}">
                <div class="overlay">
                    ${product.title} - <span class="price-span">$${product.price}</span>
                </div>
            </a>
            <p>Rating: ${product.rating.rate} (${product.rating.count} reviews)</p>
        `;
        container.appendChild(gridItem);
    });
};
