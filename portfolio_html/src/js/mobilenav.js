const btn = document.querySelector('.js-mobilemenu-btn');
const mobilemenu = document.querySelector('.js-mobilemenu');
const mobilemenu_overlay = document.querySelector('.js-mobilemenu-overlay');

btn.addEventListener('click', function() {
    btn.classList.toggle('is-active');
    mobilemenu.classList.toggle('is-active');
    mobilemenu_overlay.classList.toggle('is-active');
}, false);
        
mobilemenu_overlay.addEventListener('click', function() {
    btn.classList.remove('is-active');
    mobilemenu.classList.remove('is-active');
    mobilemenu_overlay.classList.remove('is-active');
}, false);