//open/close sidebar

const closeBtn = document.querySelector('.close-sidebar');
const sidebar = document.querySelector('aside');

closeBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});