// api base url
const API_BASE_URL = "http://localhost:8080";

// submit request for password recover
const form = document.querySelector(".form-login");
const emailInput = document.querySelector(".user-field");
const submitButton = document.querySelector(".login-button");
const statusMessage = document.getElementById("status-message");
const originalButtonText = submitButton.textContent;

function showStatus(mensagem, tipo) {
    statusMessage.textContent = mensagem;
    statusMessage.className = tipo === "error" ? "status-error" : "status-success";
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (email === "") {
        showStatus("Digite um email.", "error");
        return;
    }

    submitButton.textContent = "Enviando...";
    submitButton.classList.remove("active");
    submitButton.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email })
        });

        if (response.ok) {
            showStatus("Se o email existir, enviamos um link.", "success");
        } else {
            showStatus("Não foi possível processar sua solicitação. Tente novamente.", "error");
        }

    } catch (error) {
        showStatus("Erro de conexão com o servidor. Verifique sua internet e tente novamente.", "error");

    } finally {
        submitButton.textContent = originalButtonText;
        submitButton.classList.add("active");
        submitButton.disabled = false;
    }
});

// transition to initial screen
loginLink.addEventListener('click', (event) => {
    event.preventDefault();
    navigateWithTransition('/InitialScreen.html');
});

// fade-in da página
window.addEventListener("DOMContentLoaded", function () {
    requestAnimationFrame(function () {
        document.querySelector(".container").classList.add("visible");
    });
});