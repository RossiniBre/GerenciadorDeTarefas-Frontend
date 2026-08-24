// api base url
const API_BASE_URL = "http://localhost:8080";

// elements
const button = document.querySelector(".login-button");
const userField = document.querySelector(".user-field");
const emailField = document.querySelector(".email-field");
const passwordField = document.querySelector(".password-field");
const confirmPasswordField = document.querySelector(".confirm-password-field");
const loginError = document.querySelector(".login-error");
const form = document.querySelector("#registerForm");
const displayNameField = document.querySelector(".display-name-field");

// custom validation message for email
emailField.addEventListener('invalid', () => {
    emailField.setCustomValidity('Por favor, digite um email válido (ex: nome@email.com).');
});

emailField.addEventListener('input', () => {
    emailField.setCustomValidity('');
});

// blocked/unlocked button + live validation
userField.addEventListener("input", verifyFields);
emailField.addEventListener("input", verifyFields);
passwordField.addEventListener("input", verifyFields);
confirmPasswordField.addEventListener("input", verifyFields);
displayNameField.addEventListener("input", verifyFields);  // faltando

function verifyFields() {
    const fieldsFilled =
        userField.value.trim() !== "" &&
        emailField.value.trim() !== "" &&
        passwordField.value.trim() !== "" &&
        displayNameField.value.trim() !== "" &&
        confirmPasswordField.value.trim() !== "";

    const passwordsMatch = passwordField.value === confirmPasswordField.value;

    button.disabled = !(fieldsFilled && passwordsMatch);
    button.classList.toggle("active", fieldsFilled && passwordsMatch);

    if (fieldsFilled && !passwordsMatch) {
        loginError.textContent = "As senhas não coincidem.";
        loginError.classList.remove("hidden");
    } else {
        loginError.classList.add("hidden");
    }
}

// receive form submit
form.addEventListener("submit", verifyRegister);

async function verifyRegister(event) {
    event.preventDefault();

    if (button.disabled) {
        return;
    }

    if (passwordField.value !== confirmPasswordField.value) {
        loginError.textContent = "As senhas não coincidem.";
        loginError.classList.remove("hidden");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: userField.value.trim(),
                email: emailField.value.trim(),
                displayName: displayNameField.value.trim(),
                password: passwordField.value
            })
        });

        console.log("Status:", response.status);

        if (response.status === 201) {
            const data = await response.json();
            console.log("Cadastro bem-sucedido!", data);

            showSuccessToast();

        } else if (response.status === 409) {
            const data = await response.json();
            loginError.textContent = data.error || "Esse usuário já existe.";
            loginError.classList.remove("hidden");
        } else {
            loginError.textContent = "Não foi possível criar a conta. Tente novamente.";
            loginError.classList.remove("hidden");
        }

    } catch (error) {
        console.error("Erro ao conectar com a API:", error);
        
        loginError.textContent = "Não foi possível conectar ao servidor.";
        loginError.classList.remove("hidden");
    }
}

//succeed register
function showSuccessToast() {
    const toast = document.getElementById('successToast');
    toast.classList.remove('hidden');

    const redirect = () => {
        document.body.classList.add('page-transition');
        setTimeout(() => {
            window.location.href = '/InitialScreen.html';
        }, 300);
    };

    // fecha manualmente
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', redirect);

    // ou fecha sozinho depois de alguns segundos
    setTimeout(redirect, 3000);
}

// hide/show password 
const toggleButtons = document.querySelectorAll('.toggle-password');

toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetClass = button.getAttribute('data-target');
        const targetField = document.querySelector(`.${targetClass}`);
        const eyeOpen = button.querySelector('.icon-eye-open');
        const eyeClosed = button.querySelector('.icon-eye-closed');

        const isPassword = targetField.type === 'password';

        targetField.type = isPassword ? 'text' : 'password';

        eyeOpen.classList.toggle('hidden', isPassword);
        eyeClosed.classList.toggle('hidden', !isPassword);

        button.setAttribute(
            'aria-label',
            isPassword ? 'Ocultar senha' : 'Mostrar senha'
        );
    });
});

// transition to initial screen
const loginLink = document.querySelector('.link-login');

loginLink.addEventListener('click', (event) => {
    event.preventDefault();

    document.body.classList.add('page-transition');

    setTimeout(() => {
        window.location.href = '/InitialScreen.html';
    }, 300);
});