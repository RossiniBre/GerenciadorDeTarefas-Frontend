import { useState, useEffect } from "react";
import Modal from "./Modal";
import { updateTask, deleteTask, changeTaskStatus } from "../utils/api";
import { useAuth } from "../context/useAuth";

function splitDueDate(dueDate) {
  if (!dueDate) return { date: "", time: "" };
  const d = new Date(dueDate);
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return { date, time };
}

export default function TaskDetailsModal({ task, isOpen, onClose, onChanged, showToast }) {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [category, setCategory] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const minTime =
    date === today
      ? `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
      : undefined;

  useEffect(() => {
  if (!task) return;
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setTitle(task.title || "");
  setDescription(task.description || "");
  setPriority(task.priority || "LOW");
  setCategory(task.category || "");
  const { date, time } = splitDueDate(task.dueDate);
  setDate(date);
  setTime(time);
}, [task]);

  if (!task) return null;

  function handleClose() {
    setConfirmingDelete(false);
    onClose();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const updatedTask = {
      title,
      description,
      priority,
      category: category === "" ? null : category,
      dueDate: `${date}T${time}:00`,
    };

    const { response, data } = await updateTask(token, task.id, updatedTask);

    if (response.ok) {
      showToast("Tarefa atualizada!");
      handleClose();
      onChanged();
    } else {
      showToast(
        data?.error === "dueDate não pode estar no passado"
          ? "A data e o horário da tarefa não podem estar no passado."
          : data?.error || "Não foi possível atualizar a tarefa."
      );
    }
  }

  async function handleStatusChange(action) {
    const response = await changeTaskStatus(token, task.id, action);

    if (response.ok) {
      showToast(action === "start" ? "Tarefa iniciada!" : "Tarefa concluída!");
      handleClose();
      onChanged();
    } else {
      const errorData = await response.json().catch(() => null);
      showToast(errorData?.error || "Não foi possível atualizar a tarefa.");
    }
  }

  async function handleDelete() {
    const response = await deleteTask(token, task.id);

    if (response.ok || response.status === 204) {
      showToast("Tarefa excluída.");
      handleClose();
      onChanged();
    } else {
      showToast("Não foi possível excluir a tarefa.");
    }
  }

  const statusButton =
    task.status === "PENDING"
      ? { label: "Iniciar", action: () => handleStatusChange("start") }
      : task.status === "IN_PROGRESS"
      ? { label: "Concluir", action: () => handleStatusChange("complete") }
      : null;

  return (
    <>
      <Modal isOpen={isOpen && !confirmingDelete} onClose={handleClose}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>Detalhes da tarefa</h3>
            <button type="button" className="modal-close" aria-label="Fechar" onClick={handleClose}>&times;</button>
          </div>

          <form id="task-form" onSubmit={handleSubmit}>
            <label>
              Título
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>

            <label>
              Descrição
              <textarea rows="4" placeholder="Adicione mais detalhes" value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>

            <div className="form-row">
              <label>
                Data
                <input type="date" required min={today} value={date} onChange={(e) => setDate(e.target.value)} />
                </label>

                <label>
                Horário
                <input type="time" required min={minTime} value={time} onChange={(e) => setTime(e.target.value)} />
               </label>

              <label>
                Prioridade
                <select required value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                </select>
              </label>
            </div>

            <label>
              Categoria
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Sem categoria</option>
                <option value="STUDY">Estudo</option>
                <option value="WORK">Trabalho</option>
                <option value="PERSONAL">Pessoal</option>
              </select>
            </label>

            <div className="modal-actions details-actions">
              <button type="button" className="btn-delete" onClick={() => setConfirmingDelete(true)}>Excluir</button>
              {statusButton && (
                <button type="button" className="btn-status" onClick={statusButton.action}>
                  {statusButton.label}
                </button>
              )}
              <button type="submit" className="btn-submit">Salvar</button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={confirmingDelete} onClose={() => setConfirmingDelete(false)}>
        <div className="modal-content confirm-modal-content">
          <h3>Excluir tarefa</h3>
          <p>Tem certeza que deseja excluir essa tarefa? Essa ação não pode ser desfeita.</p>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setConfirmingDelete(false)}>Cancelar</button>
            <button type="button" className="btn-delete" onClick={handleDelete}>Excluir</button>
          </div>
        </div>
      </Modal>
    </>
  );
}