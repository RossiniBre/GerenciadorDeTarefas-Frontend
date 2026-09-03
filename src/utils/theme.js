export function getStoredTheme() {
    return localStorage.getItem("theme") || "dark";
}

export function applyTheme(theme) {
    if (theme === "light") {
        document.documentElement.dataset.theme = "light";
    } else {
        delete document.documentElement.dataset.theme;
    }

    localStorage.setItem("theme", theme);
}

export function applyDarkThemeOnly() {
    delete document.documentElement.dataset.theme;
}