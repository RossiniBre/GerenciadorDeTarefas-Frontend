// logout + open/close sidebar
document.addEventListener("sidebarLoaded", () => {
    const logoutButton = document.getElementById("logout-button");

    if (!logoutButton) {
        console.error("logout-button não encontrado na sidebar.");
    } else {
        logoutButton.addEventListener("click", (event) => {
            event.preventDefault();

            document.body.classList.add("page-transition");

            setTimeout(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("username");

                window.location.href = "/InitialScreen.html";
            }, 300);
        });
    }

    // open/close sidebar
    const closeBtn = document.querySelector(".close-sidebar");
    const sidebar = document.querySelector("aside");

    if (!closeBtn || !sidebar) {
        console.error("close-sidebar ou aside não encontrado na sidebar.");
    } else {
        closeBtn.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
        });
    }
});