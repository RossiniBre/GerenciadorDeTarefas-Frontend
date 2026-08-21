// api base url
const API_BASE_URL = "http://localhost:8080";

const form = document.querySelector(".form-login");
const tokenInput = document.getElementById("token-input");
const newPasswordInput = document.getElementById("new-password-input");
const confirmPasswordInput = document.getElementById("confirm-password-input");
const submitButton = document.querySelector(".login-button");
const statusMessage = document.getElementById("status-message");
const originalButtonText = submitButton.textContent;

const urlParams = new URLSearchParams(window.location.search);
const tokenFromUrl = urlParams.get("token");
if (tokenFromUrl) {
    tokenInput.value = tokenFromUrl;
}

function showStatus(mensagem, tipo) {
    statusMessage.textContent = mensagem;
    statusMessage.className = tipo === "error" ? "status-error" : "status-success";
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const token = tokenInput.value.trim();
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (token === "") {
        showStatus("Cole o código de recuperação recebido por email.", "error");
        return;
    }

    if (newPassword === "" || confirmPassword === "") {
        showStatus("Preencha a nova senha e a confirmação.", "error");
        return;
    }

    if (newPassword !== confirmPassword) {
        showStatus("As senhas não coincidem.", "error");
        return;
    }

    submitButton.textContent = "Redefinindo...";
    submitButton.classList.remove("active");
    submitButton.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: token, newPassword: newPassword })
        });

        if (response.ok) {
            showStatus("Senha redefinida! Redirecionando...", "success");
            setTimeout(function () {
                window.location.href = "../InitialScreen.html";
            }, 2000);
        } else if (response.status === 400) {
            showStatus(
                "Código inválido, expirado ou já utilizado. Solicite um novo link de recuperação.",
                "error"
            );
        } else {
            showStatus("Não foi possível redefinir sua senha. Tente novamente.", "error");
        }

    } catch (error) {
        showStatus("Erro de conexão com o servidor. Verifique sua internet e tente novamente.", "error");

    } finally {
        submitButton.textContent = originalButtonText;
        submitButton.classList.add("active");
        submitButton.disabled = false;
    }
});

// hide/show password (funciona para múltiplos campos)
const toggleButtons = document.querySelectorAll('.toggle-password');

toggleButtons.forEach(function (toggleButton) {
    const wrapper = toggleButton.closest('.password-wrapper');
    const passwordField = wrapper.querySelector('.password-field');
    const eyeOpen = toggleButton.querySelector('.icon-eye-open');
    const eyeClosed = toggleButton.querySelector('.icon-eye-closed');

    toggleButton.addEventListener('click', () => {
        const isPassword = passwordField.type === 'password';

        passwordField.type = isPassword ? 'text' : 'password';

        eyeOpen.classList.toggle('hidden', isPassword);
        eyeClosed.classList.toggle('hidden', !isPassword);

        toggleButton.setAttribute(
            'aria-label',
            isPassword ? 'Ocultar senha' : 'Mostrar senha'
        );
    });
});