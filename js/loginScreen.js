// api base url
const API_BASE_URL = "http://localhost:8080";

// blocked/unlocked button

const button = document.querySelector(".login-button");
const userField = document.querySelector(".user-field");
const userPassword = document.querySelector(".password-field");

userField.addEventListener("input", verifyFields);
userPassword.addEventListener("input", verifyFields);

function verifyFields(){
    if (userField.value && userPassword.value){
        button.classList.add("active");
    } else {
        button.classList.remove("active");
    }

    loginError.classList.add("hidden");
}

// login error messages
const loginError = document.querySelector(".login-error");

loginError.textContent = "Usuário ou senha inválidos";
loginError.classList.remove("hidden");
loginError.classList.add("hidden");

// receive forms submit
const form = document.querySelector(".form-login");

form.addEventListener("submit", verifyLogin);

function verifyLogin(event) {
    event.preventDefault();

    const validUser = "admin";
    const validPassword = "1234";

    if (userField.value === validUser && userPassword.value === validPassword) {
        console.log("Login válido!");
        loginError.classList.add("hidden");
    } else {
        loginError.textContent = "Usuário ou senha inválidos";
        loginError.classList.remove("hidden");
    }
}

// login response messages
const loginSuccess = document.querySelector(".login-success");

async function verifyLogin(event) {
    event.preventDefault();

    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            identifier: userField.value,
            password: userPassword.value
        })
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Resposta:", data);

    if (response.status === 200) {
        loginError.classList.add("hidden");
        console.log("Login bem-sucedido!", data);
        // aqui, futuramente: salvar o token e redirecionar
    } else {
        loginError.textContent = "Usuário ou senha inválidos";
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