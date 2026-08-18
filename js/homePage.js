//open/close sidebar

const closeBtn = document.querySelector('.close-sidebar');
const sidebar = document.querySelector('aside');

closeBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

// open/close create task modal

const API_URL = "http://localhost:8080";

const createTaskBtn = document.getElementById("create-task");
const taskModal = document.getElementById("task-modal");
const modalClose = document.querySelector(".modal-close");
const btnCancel = document.querySelector(".btn-cancel");
const taskForm = document.getElementById("task-form");

function openModal() {
    taskModal.classList.remove("hidden");
}

function closeModal() {
    taskModal.classList.add("hidden");
    taskForm.reset();
}

createTaskBtn.addEventListener("click", openModal);
modalClose.addEventListener("click", closeModal);
btnCancel.addEventListener("click", closeModal);

taskModal.addEventListener("click", (event) => {
    if (event.target === taskModal) {
        closeModal();
    }
});

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
});

// dark/light button

const themeToggle = document.getElementById("theme-toggle");
const page = document.documentElement;

const moonIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>
    </svg>
`;

const sunIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2"/>
        <path d="M12 20v2"/>
        <path d="m4.93 4.93 1.41 1.41"/>
        <path d="m17.66 17.66 1.41 1.41"/>
        <path d="M2 12h2"/>
        <path d="M20 12h2"/>
        <path d="m6.34 17.66-1.41 1.41"/>
        <path d="m19.07 4.93-1.41 1.41"/>
    </svg>
`;

themeToggle.addEventListener("click", () => {
    const lightModeIsActive = page.dataset.theme === "light";

    if (lightModeIsActive) {
        page.removeAttribute("data-theme");
        themeToggle.innerHTML = moonIcon;
        themeToggle.setAttribute("aria-label", "Ativar tema claro");
    } else {
        page.dataset.theme = "light";
        themeToggle.innerHTML = sunIcon;
        themeToggle.setAttribute("aria-label", "Ativar tema escuro");
    }
});

//clear search button
const searchInput = document.getElementById('task-search');
const clearButton = document.querySelector('.clear-search');

clearButton.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    searchInput.dispatchEvent(new Event('input'));
});