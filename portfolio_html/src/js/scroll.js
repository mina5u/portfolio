const toggleActive = (state) => {
    const stateClass = 'is-active';
    const headerbar = document.querySelector('.js-headerbar');
    if (state) {
        headerbar.classList.add(stateClass);
    } else {
        headerbar.classList.remove(stateClass);
    }
};

window.addEventListener('scroll', () => {
    const breakpoint = 1;
    const pos = window.pageYOffset;

    if (pos > breakpoint) {
        toggleActive(true);
    } else {
        toggleActive(false);
    }
});