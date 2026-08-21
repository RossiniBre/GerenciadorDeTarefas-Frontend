// api base url
const API_BASE_URL = "http://localhost:8080";

// elements
const button = document.querySelector(".login-button");
const userField = document.querySelector(".user-field");
const userPassword = document.querySelector(".password-field");
const loginError = document.querySelector(".login-error");
const form = document.querySelector(".form-login");

// blocked/unlocked button
userField.addEventListener("input", verifyFields);
userPassword.addEventListener("input", verifyFields);

function verifyFields() {
    const fieldsFilled =
        userField.value.trim() !== "" &&
        userPassword.value.trim() !== "";

    button.disabled = !fieldsFilled;
    button.classList.toggle("active", fieldsFilled);

    loginError.classList.add("hidden");
}

// receive form submit
form.addEventListener("submit", verifyLogin);

async function verifyLogin(event) {
    event.preventDefault();

    if (button.disabled) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                identifier: userField.value.trim(),
                password: userPassword.value
            })
        });

        const data = await response.json();

        console.log("Status:", response.status);
        console.log("Resposta:", data);

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);

            console.log("Login bem-sucedido!");

            document.body.classList.add("page-transition");

            setTimeout(() => {
                window.location.href = "/pages/HomePage.html";
            }, 300);
            
        } else {
            loginError.textContent = "Usuário ou senha inválidos";
            loginError.classList.remove("hidden");
        }

    } catch (error) {
        console.error("Erro ao conectar com a API:", error);

        loginError.textContent = "Não foi possível conectar ao servidor.";
        loginError.classList.remove("hidden");
    }
}

// hide/show password
const toggleButton = document.querySelector('.toggle-password');
const passwordField = document.querySelector('.password-field');
const eyeOpen = document.querySelector('.icon-eye-open');
const eyeClosed = document.querySelector('.icon-eye-closed');

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

// valid token guide to home page, invalid guide to login screen
async function checkSession() {
    const token = localStorage.getItem('token'); // chave corrigida

    if (!token) {
        showForm();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, { // URL corrigida
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            window.location.href = '/pages/HomePage.html'; // mesma rota do login
            return;
        }

        if (response.status === 401) {
            localStorage.removeItem('token');
            showForm();
            return;
        }

        showForm();

    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        showForm();
    }
}

document.addEventListener('DOMContentLoaded', checkSession);

// loading
function showForm() {
    document.querySelector('.loading-container').classList.add('form-hidden');
    document.querySelector('.form-login').classList.remove('form-hidden');
}

function resetToLoading() {
    document.querySelector('.loading-container').classList.remove('form-hidden');
    document.querySelector('.form-login').classList.add('form-hidden');
}

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        resetToLoading();
        checkSession();
    }
});

// transition to register page
const registerLink = document.querySelector('.link-register');

registerLink.addEventListener('click', (event) => {
    event.preventDefault();

    document.body.classList.add('page-transition');

    setTimeout(() => {
        window.location.href = '/pages/RegisterPage.html';
    }, 300);
});

// transition to register page
const register2Link = document.querySelector('.recover-password');

registerLink.addEventListener('click', (event) => {
    event.preventDefault();

    document.body.classList.add('page-transition');

    setTimeout(() => {
        window.location.href = '/pages/ForgotPassword.html';
    }, 300);
});