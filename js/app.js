
const menuBtn = document.getElementById('menu-btn');

menuBtn.addEventListener('click', () => {
    document.querySelector('body').classList.toggle('show_menu');
})