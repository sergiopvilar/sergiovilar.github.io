var burger = document.querySelector('.navbar-burger');
var menu = document.querySelector('#navMenuExample');
burger.addEventListener('click', function() {
    burger.classList.toggle('is-active');
    menu.classList.toggle('is-active');
});
