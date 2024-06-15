const scrollers = document.querySelectorAll('.h-scroll-container');

if(!window.matchMedia('(prefers-reduces-motion: reduced)').matches){
    initAnimations();
}

function initAnimations(){
    scrollers.forEach(scroller => {
        scroller.setAttribute('data-animated', true);
        const scroller_inner = scroller.querySelector('.h-scroll-wrapper');
        const scroller_content = Array.from(scroller_inner.children);
        scroller_content.forEach(elmnt => {
            const duplicate = elmnt.cloneNode(true);
            duplicate.setAttribute('aria-hidden', true);
            scroller_inner.appendChild(duplicate);
        });
    })
}

function filter(elmnt, category){
    Array.from(elmnt.parentElement.querySelectorAll('li')).forEach(filter => {
        filter.classList.remove('active');
    });
    elmnt.classList.add('active');
    Array.from(elmnt.parentElement.parentElement.querySelector('.filter-container-items').children).forEach(item => {
        if(category !== 'all' && !Array.from(item.classList).includes(category)){ item.classList.add('hidden'); }
        else{ item.classList.remove('hidden'); }
    });
}
    async function addCredits(userId, credits) {
        try {
            const response = await fetch('http://localhost:8080/api/users/add-credits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
    
    // Function to purchase product with credits
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