// api base url
const API_BASE_URL = "http://localhost:8080";

//load infos of the user
async function loadAccountInfo() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "InitialScreen.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("Não foi possível carregar o usuário.");
        }

        const user = await response.json();

        document.getElementById("display-name").textContent = user.displayName || "Usuário";
        document.getElementById("user-meta").textContent = `${user.email} | ${user.username}`;

    } catch (error) {
        console.error("Erro ao carregar conta:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadAccountInfo);

//submit
async function saveAccountInfo() {
    const username = document.getElementById("new-username").value.trim();
    const displayName = document.getElementById("new-display-name").value.trim();
    const email = document.getElementById("new-email").value.trim();

    const body = {};
    if (username) body.username = username;
    if (displayName) body.displayName = displayName;
    if (email) body.email = email;

    if (Object.keys(body).length === 0) {
        alert("Preencha ao menos um campo pra salvar.");
        return;
    }

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Erro ${response.status}`);
        }

        const updatedUser = await response.json();

        document.getElementById("display-name").textContent = updatedUser.displayName;
        document.getElementById("user-meta").textContent = `${updatedUser.email} | ${updatedUser.username}`;

        showToast("Dados atualizados com sucesso!");

        setTimeout(() => {
            location.reload();
        }, 1500);
    } catch (error) {
        console.error("Erro ao salvar dados da conta:", error);
        showToast("Não foi possível salvar. Tente novamente.");
    }
}

document.getElementById("save-infos").addEventListener("click", saveAccountInfo);

//succesfull message 
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1500);
}

// delete account
const confirmDeleteAccountModal = document.getElementById("confirm-delete-account-modal");
const confirmDeleteAccountCancel = document.getElementById("confirm-delete-account-cancel");
const confirmDeleteAccountOk = document.getElementById("confirm-delete-account-ok");

document.getElementById("delete-account").addEventListener("click", () => {
    confirmDeleteAccountModal.classList.remove("hidden");
});

confirmDeleteAccountCancel.addEventListener("click", () => {
    confirmDeleteAccountModal.classList.add("hidden");
});

confirmDeleteAccountModal.addEventListener("click", (event) => {
    if (event.target === confirmDeleteAccountModal) {
        confirmDeleteAccountModal.classList.add("hidden");
    }
});

confirmDeleteAccountOk.addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok && response.status !== 204) {
            throw new Error(`Erro ${response.status}`);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("username");

        window.location.href = "/InitialScreen.html";

    } catch (error) {
        console.error("Erro ao deletar conta:", error);
        confirmDeleteAccountModal.classList.add("hidden");
        showToast("Não foi possível deletar a conta. Tente novamente.");
    }
});