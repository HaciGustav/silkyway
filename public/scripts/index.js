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