export function statusLabel(status) {
  const map = {
    PENDING: "Pendente",
    IN_PROGRESS: "Em andamento",
    COMPLETED: "Completa",
  };
  return map[status] || status;
}

export function priorityLabel(priority) {
  const map = {
    LOW: "Baixa",
    MEDIUM: "Média",
    HIGH: "Alta",
  };
  return map[priority] || priority;
}

export function categoryLabel(category) {
  const map = {
    STUDY: "Estudo",
    WORK: "Trabalho",
    PERSONAL: "Pessoal",
    UNCATEGORIZED: "Sem categoria",
  };
  return map[category] || category;
}

export function formatDate(dueDate) {
  if (!dueDate) return "";
  const d = new Date(dueDate);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

export function formatTime(dueDate) {
  if (!dueDate) return "";
  const d = new Date(dueDate);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}