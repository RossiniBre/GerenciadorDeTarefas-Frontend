import { useState } from "react";
import Modal from "./Modal";
import { createTask } from "../utils/api";
import { useAuth } from "../context/useAuth";

export default function CreateTaskModal({ isOpen, onClose, onCreated }) {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const minTime =
    date === today
      ? `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
      : undefined;

  function resetForm() {
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setPriority("LOW");
    setCategory("");
    setError("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newTask = {
      title,
      description,
      dueDate: `${date}T${time}:00`,
      priority,
      category: category === "" ? null : category,
    };

    const { response, data } = await createTask(token, newTask);

    if (response.ok) {
      handleClose();
      onCreated();
    } else {
      setError(
        data?.error === "dueDate não pode estar no passado"
          ? "A data e o horário da tarefa não podem estar no passado."
          : data?.error || "Não foi possível criar a tarefa."
      );
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Criar tarefa</h3>
          <button type="button" className="modal-close" aria-label="Fechar" onClick={handleClose}>&times;</button>
        </div>

        <form id="task-form" onSubmit={handleSubmit}>
          <label>
            Título
            <input type="text" required placeholder="Ex.: Limpar a casa" value={title} onChange={(e) => setTitle(e.target.value)} />
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

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>Cancelar</button>
            <button type="submit" className="btn-submit">Criar</button>
          </div>

          {error && <div className="task-form-error">{error}</div>}
        </form>
      </div>
    </Modal>
  );
}