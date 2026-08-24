async function loadSidebar() {
    try {
        const response = await fetch("/pages/components/sidebar.frag");

        if (!response.ok) {
            throw new Error(`Erro ao carregar sidebar: ${response.status}`);
        }

        let html = await response.text();

        html = html.replace(
            /<!--\s*Code injected by live-server\s*-->[\s\S]*?<\/script>/g,
            ""
        );

        document.getElementById("sidebar-container").innerHTML = html;

        document.dispatchEvent(new CustomEvent("sidebarLoaded"));

    } catch (error) {
        console.error("Erro ao carregar sidebar:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadSidebar);