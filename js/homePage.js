//api
const API_URL = "http://localhost:8080";

// block past dates
const now = new Date();

const today =
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

document.getElementById('task-date').min = today;

// block past times on today's date
const taskTime = document.getElementById('task-time');

document.getElementById('task-date').addEventListener("change", function() {
    const taskDate = document.getElementById('task-date').value;

    if (taskDate === today) {
        const now = new Date();

        const todayHour =
            `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        taskTime.min = todayHour;
    } else {
        taskTime.removeAttribute("min");
    }
});

// logged from initial screen
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/InitialScreen.html";
}

//username gretting
async function loadUserGreeting() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "InitialScreen.html";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users/me`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "InitialScreen.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Não foi possível carregar o usuário.");
        }

        const user = await response.json();

        document.getElementById("user-name").textContent =
            user.displayName || "Usuário";

    } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        document.getElementById("user-name").textContent = "Usuário";
    }
}

document.addEventListener("DOMContentLoaded", loadUserGreeting);

// getting tasks of the user
if (!token) {
    window.location.href = "/InitialScreen.html";
}

function statusLabel(status) {
    const map = {
        PENDING: "Pendente",
        IN_PROGRESS: "Em andamento",
        COMPLETED: "Completa"
    };
    return map[status] || status;
}

function priorityLabel(priority) {
    const map = {
        LOW: "Baixa",
        MEDIUM: "Média",
        HIGH: "Alta"
    };
    return map[priority] || priority;
}

function categoryLabel(category) {
    const map = {
        STUDY: "Estudo",
        WORK: "Trabalho",
        PERSONAL: "Pessoal",
        UNCATEGORIZED: "Sem categoria"
    };
    return map[category] || category;
}

function formatDate(dueDate) {
    if (!dueDate) return "";
    const d = new Date(dueDate);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
}

function formatTime(dueDate) {
    if (!dueDate) return "";
    const d = new Date(dueDate);
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}

function renderTasks(tasks) {
    const container = document.getElementById("tasks-container");
    container.innerHTML = "";

    if (!tasks || tasks.length === 0) {
        container.innerHTML = `<p class="tasks-empty">Nenhuma tarefa encontrada.</p>`;
        return;
    }

    tasks.forEach((task) => {
        const card = document.createElement("div");
        card.className = "task-card";
        card.dataset.taskId = task.id;

        card.innerHTML = `
            <div class="task-card-header">
                <span class="task-card-title">${task.title}</span>
                <span class="task-card-date">${formatDate(task.dueDate)}</span>
            </div>
            <div class="task-card-badges">
                <span class="badge badge-status status-${task.status.toLowerCase()}">${statusLabel(task.status)}</span>
                <span class="badge badge-priority priority-${task.priority.toLowerCase()}">${priorityLabel(task.priority)}</span>
                ${task.category ? `<span class="badge badge-category">${categoryLabel(task.category)}</span>` : ""}
            </div>
            <div class="task-card-footer">
                <span class="task-card-time">${formatTime(task.dueDate)}</span>
            </div>
        `;

        container.appendChild(card);

        card.addEventListener("click", () => {
            openTaskDetailsModal(task);
        });
    });
}

// task details modal
const taskDetailsModal = document.getElementById("task-details-modal");
const detailsModalClose = document.querySelector("#task-details-modal .modal-close");
const taskDetailsForm = document.getElementById("task-details-form");

const detailsTitle = document.getElementById("details-title");
const detailsDescription = document.getElementById("details-description");
const detailsDate = document.getElementById("details-date");
const detailsTime = document.getElementById("details-time");
const detailsPriority = document.getElementById("details-priority");
const detailsCategory = document.getElementById("details-category");
const detailsBtnDelete = document.getElementById("details-btn-delete");
const detailsBtnStatus = document.getElementById("details-btn-status");

let currentTaskId = null;

function splitDueDate(dueDate) {
    if (!dueDate) return { date: "", time: "" };
    const d = new Date(dueDate);
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    return { date, time };
}

function applyDetailsTimeMin() {
    detailsDate.min = today;

    if (detailsDate.value === today) {
        const now = new Date();
        const todayHour = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        detailsTime.min = todayHour;
    } else {
        detailsTime.removeAttribute("min");
    }
}

detailsDate.addEventListener("change", applyDetailsTimeMin);

function openTaskDetailsModal(task) {
    currentTaskId = task.id;

    detailsTitle.value = task.title || "";
    detailsDescription.value = task.description || "";
    detailsPriority.value = task.priority;
    detailsCategory.value = task.category || "";

    const { date, time } = splitDueDate(task.dueDate);
    detailsDate.value = date;
    detailsTime.value = time;

    applyDetailsTimeMin();

    detailsBtnStatus.classList.add("hidden");
    detailsBtnStatus.onclick = null;

    if (task.status === "PENDING") {
        detailsBtnStatus.textContent = "Iniciar";
        detailsBtnStatus.classList.remove("hidden");
        detailsBtnStatus.onclick = () => changeTaskStatus(task.id, "start");
    } else if (task.status === "IN_PROGRESS") {
        detailsBtnStatus.textContent = "Concluir";
        detailsBtnStatus.classList.remove("hidden");
        detailsBtnStatus.onclick = () => changeTaskStatus(task.id, "complete");
    }

    taskDetailsModal.classList.remove("hidden");
}

function closeTaskDetailsModal() {
    taskDetailsModal.classList.add("hidden");
    taskDetailsForm.reset();
    currentTaskId = null;
}

detailsModalClose.addEventListener("click", closeTaskDetailsModal);

taskDetailsModal.addEventListener("click", (event) => {
    if (event.target === taskDetailsModal) {
        closeTaskDetailsModal();
    }
});

async function changeTaskStatus(taskId, action) {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}/${action}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.ok) {
            showToast(action === "start" ? "Tarefa iniciada!" : "Tarefa concluída!");
            closeTaskDetailsModal();
            loadTasks();
        } else {
            const errorData = await response.json();
            showToast(errorData.error || "Não foi possível atualizar a tarefa.");
        }
    } catch (erro) {
        console.error("Erro ao conectar com a API:", erro);
        showToast("Não foi possível conectar ao servidor.");
    }
}

const confirmDeleteModal = document.getElementById("confirm-delete-modal");
const confirmDeleteCancel = document.getElementById("confirm-delete-cancel");
const confirmDeleteOk = document.getElementById("confirm-delete-ok");

detailsBtnDelete.addEventListener("click", () => {
    if (!currentTaskId) return;
    confirmDeleteModal.classList.remove("hidden");
});

confirmDeleteCancel.addEventListener("click", () => {
    confirmDeleteModal.classList.add("hidden");
});

confirmDeleteModal.addEventListener("click", (event) => {
    if (event.target === confirmDeleteModal) {
        confirmDeleteModal.classList.add("hidden");
    }
});

confirmDeleteOk.addEventListener("click", async () => {
    if (!currentTaskId) return;

    try {
        const response = await fetch(`${API_URL}/tasks/${currentTaskId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.ok || response.status === 204) {
            confirmDeleteModal.classList.add("hidden");
            showToast("Tarefa excluída.");
            closeTaskDetailsModal();
            loadTasks();
        } else {
            showToast("Não foi possível excluir a tarefa.");
        }
    } catch (erro) {
        console.error("Erro ao conectar com a API:", erro);
        showToast("Não foi possível conectar ao servidor.");
    }
});

taskDetailsForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentTaskId) return;

    const updatedTask = {
        title: detailsTitle.value,
        description: detailsDescription.value,
        priority: detailsPriority.value,
        category: detailsCategory.value === "" ? null : detailsCategory.value,
        dueDate: `${detailsDate.value}T${detailsTime.value}:00`
    };

    try {
        const response = await fetch(`${API_URL}/tasks/${currentTaskId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedTask)
        });

        const infoData = await response.json();

        if (response.ok) {
            showToast("Tarefa atualizada!");
            closeTaskDetailsModal();
            loadTasks();
        } else {
            if (infoData.error === "dueDate não pode estar no passado") {
                showToast("A data e o horário da tarefa não podem estar no passado.");
            } else {
                showToast(infoData.error);
            }
        }
    } catch (erro) {
        console.error("Erro ao conectar com a API:", erro);
        showToast("Não foi possível conectar ao servidor.");
    }
});

//creating a task
document.getElementById("task-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const date = document.getElementById('task-date').value;
    const priority = document.getElementById('task-priority').value;
    const categoryValue = document.getElementById('task-category').value;
    const time = document.getElementById('task-time').value;
    const dueDate = `${date}T${time}:00`;
    
    const newTask = {
        title,
        description,
        dueDate,
        priority,
        category: categoryValue === "" ? null : categoryValue
    };

    async function sendInfos() {
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }, body: JSON.stringify(newTask)
            });

            const infoData = await response.json();

            if (response.ok) {
                closeModal();
                showToast("Tarefa criada com sucesso!");
                loadTasks();
            } else {
                if (infoData.error === "dueDate não pode estar no passado") {
                    showToast("A data e o horário da tarefa não podem estar no passado.");
                } else {
                    showToast(infoData.error);
                }
            }
        } catch (erro) {
            console.error("Erro ao conectar com a API:", erro);
            showToast("Não foi possível conectar ao servidor.");
        }
    }

        sendInfos();
    
    });

// open/close filter task modal

const filterTaskBtn = document.getElementById("task-button-filter");
const filterModal = document.getElementById("filter-modal");
const filterModalClose = document.querySelector(".filter-modal-close");
const filterBtnCancel = document.getElementById("filter-btn-cancel")
const filterForm = document.getElementById("filter-task-form");

function filterOpenModal() {
    filterModal.classList.remove("hidden");
}

function filterCloseModal() {
    filterModal.classList.add("hidden");
    filterForm.reset();
}

filterTaskBtn.addEventListener("click", filterOpenModal);
filterModalClose.addEventListener("click", filterCloseModal);
filterBtnCancel.addEventListener("click", filterCloseModal);

filterModal.addEventListener("click", (event) => {
    if (event.target === filterModal) {
        filterCloseModal();
    }
});

filterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const checkboxesMarcados = document.querySelectorAll('input[type="checkbox"]:checked');
    const activeFiltersContainer = document.getElementById("active-filters");
    activeFiltersContainer.innerHTML = "";

    for (const checkbox of checkboxesMarcados) {
        const textoFiltro = checkbox.closest('label').textContent.trim();

        const chip = document.createElement('span');
        chip.textContent = textoFiltro;
        chip.classList.add('filter-chip');

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.type = 'button';
        removeBtn.classList.add('filter-chip-remove');

        removeBtn.addEventListener('click', () => {
            checkbox.checked = false;
            chip.remove();
            applyFilters();
        });

        chip.appendChild(removeBtn);
        activeFiltersContainer.appendChild(chip);
    }

    filterModal.classList.add("hidden");
    applyFilters();
});

// open/close create task modal
const createTaskBtn = document.getElementById("create-task");
const taskModal = document.getElementById("task-modal");
const modalClose = document.querySelector(".modal-close");
const btnCancel = document.querySelector(".btn-cancel");
const taskForm = document.getElementById("task-form");

const taskTitle = document.getElementById("task-title");
const taskDate = document.getElementById("task-date");
const taskPriority = document.getElementById("task-priority");

function openModal() {
    taskModal.classList.remove("hidden");
}

function closeModal() {
    taskModal.classList.add("hidden");
    taskForm.reset();

    taskTitle.setCustomValidity("");
    taskDate.setCustomValidity("");
    taskPriority.setCustomValidity("");
}

createTaskBtn.addEventListener("click", openModal);
modalClose.addEventListener("click", closeModal);
btnCancel.addEventListener("click", closeModal);

taskModal.addEventListener("click", (event) => {
    if (event.target === taskModal) {
        closeModal();
    }
});

[taskTitle, taskDate, taskPriority, taskTime].forEach((field) => {
    field.addEventListener("invalid", () => {
        if (field === taskTitle) {
            field.setCustomValidity("Digite um título para a tarefa.");
        } else if (field === taskDate) {
            if (field.validity.valueMissing){
                field.setCustomValidity("Selecione uma data.");
            }
            if (field.validity.rangeUnderflow){
                field.setCustomValidity("A data ja passou");
            }

        } else if (field === taskPriority) {
            field.setCustomValidity("Selecione uma prioridade.");
        } else if (field === taskTime) {
            if (field.validity.valueMissing){
                field.setCustomValidity("Selecione um Horário.");
            }
            if (field.validity.rangeUnderflow){
                field.setCustomValidity("O horário ja passou");
            }
        }
    });

    field.addEventListener("input", () => {
        field.setCustomValidity("");
    });

    field.addEventListener("change", () => {
        field.setCustomValidity("");
    });
});

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

});

// dark/light button

const themeToggle = document.getElementById("theme-toggle");
const page = document.documentElement;

const moonIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>
    </svg>
`;

const sunIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2"/>
        <path d="M12 20v2"/>
        <path d="m4.93 4.93 1.41 1.41"/>
        <path d="m17.66 17.66 1.41 1.41"/>
        <path d="M2 12h2"/>
        <path d="M20 12h2"/>
        <path d="m6.34 17.66-1.41 1.41"/>
        <path d="m19.07 4.93-1.41 1.41"/>
    </svg>
`;

if (page.dataset.theme === "light") {
    themeToggle.innerHTML = sunIcon;
    themeToggle.setAttribute("aria-label", "Ativar tema escuro");
} else {
    themeToggle.innerHTML = moonIcon;
    themeToggle.setAttribute("aria-label", "Ativar tema claro");
}

themeToggle.addEventListener("click", () => {
    const lightModeIsActive = page.dataset.theme === "light";

    if (lightModeIsActive) {
        page.removeAttribute("data-theme");
        themeToggle.innerHTML = moonIcon;
        themeToggle.setAttribute("aria-label", "Ativar tema claro");
        localStorage.setItem("theme", "dark");
    } else {
        page.dataset.theme = "light";
        themeToggle.innerHTML = sunIcon;
        themeToggle.setAttribute("aria-label", "Ativar tema escuro");
        localStorage.setItem("theme", "light");
    }
});

//clear search button
const searchInput = document.getElementById('task-search');
const clearButton = document.querySelector('.clear-search');

clearButton.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    searchInput.dispatchEvent(new Event('input'));
});

//live task search
searchInput.addEventListener('input', () => {
    applyFilters();
});

// server error popup
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1500);
}

// filter tasks
let allTasks = [];

async function loadTasks() {
    const response = await fetch(`${API_URL}/tasks`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();
    allTasks = data;
    applyFilters();
}

loadTasks(); 

function applyFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const checkedStatus = [...document.querySelectorAll('input[name="status"]:checked')].map(el => el.value);
    const checkedPriority = [...document.querySelectorAll('input[name="priority"]:checked')].map(el => el.value);
    const checkedCategory = [...document.querySelectorAll('input[name="category"]:checked')].map(el => el.value);

    const filtered = allTasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm);
        const matchesStatus = checkedStatus.length === 0 || checkedStatus.includes(task.status);
        const matchesPriority = checkedPriority.length === 0 || checkedPriority.includes(task.priority);
        const matchesCategory = checkedCategory.length === 0 || checkedCategory.includes(task.category || "UNCATEGORIZED");

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });

    renderTasks(filtered);
}