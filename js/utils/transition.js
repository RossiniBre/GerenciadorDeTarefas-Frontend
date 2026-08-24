// utils/transition.js
function navigateWithTransition(url, delay = 300) {
    const container = document.querySelector('.container');
    if (container) {
        container.classList.remove('visible');
    }
    setTimeout(() => {
        window.location.href = url;
    }, container ? delay : 0);
}

// fade-in automatic
window.addEventListener("DOMContentLoaded", function () {
    requestAnimationFrame(function () {
        const container = document.querySelector(".container");
        if (container) container.classList.add("visible");
    });
});

// fade in in cache
window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
        const container = document.querySelector(".container");
        if (container) container.classList.add("visible");
    }
});

// interrupt every links and buttons with data-nav
document.addEventListener("click", function (e) {
    const el = e.target.closest("[data-nav]");
    if (!el) return;

    e.preventDefault();
    const url = el.getAttribute("data-nav") || el.getAttribute("href");
    if (url) navigateWithTransition(url);
});