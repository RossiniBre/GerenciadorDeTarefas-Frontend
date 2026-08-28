// getting dates
let displayedMonth = new Date();

function renderHeader(){
    //1
    const formatter =  new Intl.DateTimeFormat("pt-br", {month: "long"})

    //2
    const formatted = formatter.format(displayedMonth);
    const monthName = formatted;

    //3
    let firstLetter = monthName[0].toUpperCase();
    let leftover = monthName.slice(1);
    const monthNameCapitalized = firstLetter + leftover;

    //4
    const year = displayedMonth.getFullYear()

    //5
    document.getElementById("month").textContent = monthNameCapitalized || "Mês ";
    document.getElementById("year").textContent = year || " Ano";
}

renderHeader();

// change months buttons
document.getElementById("next-month").addEventListener("click", () => changeMonth(1))
document.getElementById("prev-month").addEventListener("click", () => changeMonth(-1))

//show tasks by day
function groupTaskByDay(tasks){

    const tasksByDay = {}

    for (const task of tasks){
        const key = task.dueDate.substring(0, 10);

        if (!(key in tasksByDay)){
            tasksByDay[key] = [];
        }

       tasksByDay[key].push(task)
    }

    return tasksByDay;
}

// calculate the day
function renderGrid(tasksByDay){
    const actualMonth = displayedMonth.getMonth();
    const year = displayedMonth.getFullYear();
    const nextMonth = displayedMonth.getMonth() + 1

    const daysOfTheMonth = new Date(year, nextMonth, 0).getDate()
    const FirstOfTheMonth = new Date(year, actualMonth, 1).getDay()

    const grid = document.getElementById("calendar-grid");
    grid.innerHTML = "";

    // dados do dia real, calculados uma vez
    const today = new Date();
    const isCurrentMonth =
        today.getMonth() === actualMonth &&
        today.getFullYear() === year;

    for (let i = 0; i < FirstOfTheMonth; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("empty-cell");
        grid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysOfTheMonth; day++) {

        const monthStr = String(actualMonth + 1).padStart(2, "0");
        const dayStr = String(day).padStart(2, "0");
        const key = `${year}-${monthStr}-${dayStr}`;

        const tasksOfDay = tasksByDay[key]; 
        const hasTasks = tasksOfDay && tasksOfDay.length > 0;

        const dayCell = document.createElement(hasTasks ? "button" : "div");
        dayCell.classList.add("day-cell");

        // marca o dia atual
        if (isCurrentMonth && day === today.getDate()) {
            dayCell.classList.add("today");
        }

        const dayNumber = document.createElement("span");
        dayNumber.classList.add("day-number");
        dayNumber.textContent = day;
        dayCell.appendChild(dayNumber);

        if (hasTasks) {
            dayCell.classList.add("has-tasks");

            const list = document.createElement("div");
            list.classList.add("day-tasks");

            const maxVisible = 2;
            tasksOfDay.slice(0, maxVisible).forEach(task => {
                const item = document.createElement("span");
                item.classList.add("task-chip");
                item.textContent = task.title;
                list.appendChild(item);
            });

            if (tasksOfDay.length > maxVisible) {
                const more = document.createElement("span");
                more.classList.add("task-more");
                more.textContent = `+${tasksOfDay.length - maxVisible}`;
                list.appendChild(more);
            }

            dayCell.appendChild(list);

            dayCell.addEventListener("click", () => {
                openTaskModal(tasksOfDay);
            });
        }

        grid.appendChild(dayCell);
    }

    const totalCells = FirstOfTheMonth + daysOfTheMonth;
    const remaining = (7 - (totalCells % 7)) % 7;

    for (let i = 0; i < remaining; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("empty-cell");
        grid.appendChild(emptyCell);
    }
}

async function loadAndRenderCalendar() {
    const tasks = await loadTasks();
    const tasksByDay = groupTaskByDay(tasks);
    renderGrid(tasksByDay);
}

function changeMonth(direction) {
    displayedMonth.setMonth(displayedMonth.getMonth() + direction);
    renderHeader();
    loadAndRenderCalendar();
}

renderHeader();
loadAndRenderCalendar();

// modal of tasks
const modal = document.getElementById("task-modal");
const modalClose = document.getElementById("modal-close");

const STATUS_LABELS = {
    pending: "Pendente",
    in_progress: "Em andamento",
    completed: "Concluída"
};

const CATEGORY_LABELS = {
    uncategorized: "Sem categoria",
    work: "Trabalho",
    study: "Estudo",
    personal: "Pessoal"
};

const PRIORITY_LABELS = {
    high: "Alta",
    alta: "Alta",
    medium: "Média",
    media: "Média",
    low: "Baixa",
    baixa: "Baixa"
};

function translateLabel(dict, value) {
    if (!value) return "";
    return dict[value.toLowerCase()] || value;
}

function openTaskModal(tasks) {
    const list = document.getElementById("modal-tasks-list");
    list.innerHTML = "";

    const dateLabel = new Date(tasks[0].dueDate).toLocaleDateString("pt-br");
    document.getElementById("modal-date").textContent = dateLabel;

    tasks.forEach(task => {
        const item = document.createElement("div");
        item.classList.add("modal-task-item");

        const title = document.createElement("h3");
        title.classList.add("modal-task-title");
        title.textContent = task.title;

        const tags = document.createElement("div");
        tags.classList.add("modal-tags");

        const status = document.createElement("span");
        status.classList.add("modal-tag");
        status.textContent = translateLabel(STATUS_LABELS, task.status);

        const category = document.createElement("span");
        category.classList.add("modal-tag");
        category.textContent = translateLabel(CATEGORY_LABELS, task.category);

        const priority = document.createElement("span");
        priority.classList.add("modal-tag");
        priority.textContent = translateLabel(PRIORITY_LABELS, task.priority);

        tags.append(status, category, priority);
        item.append(title, tags);
        list.appendChild(item);
    });

    modal.classList.remove("hidden");
}

function closeTaskModal() {
    modal.classList.add("hidden");
}

modalClose.addEventListener("click", closeTaskModal);
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeTaskModal();
});