import { useState, useEffect } from "react";
import Modal from "./Modal";

const PRIORITY_OPTIONS = [
  { value: "HIGH", label: "Alta" },
  { value: "MEDIUM", label: "Média" },
  { value: "LOW", label: "Baixa" },
];

const CATEGORY_OPTIONS = [
  { value: "STUDY", label: "Estudo" },
  { value: "WORK", label: "Trabalho" },
  { value: "PERSONAL", label: "Pessoal" },
  { value: "UNCATEGORIZED", label: "Sem categoria" },
];

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pendente" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "COMPLETED", label: "Completa" },
];

export default function FilterModal({ isOpen, onClose, activeFilters, onApply }) {
  const [priority, setPriority] = useState(activeFilters.priority);
  const [category, setCategory] = useState(activeFilters.category);
  const [status, setStatus] = useState(activeFilters.status);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPriority(activeFilters.priority);
    setCategory(activeFilters.category);
    setStatus(activeFilters.status);
  }, [activeFilters, isOpen]);

  function toggle(list, setList, value) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onApply({ priority, category, status });
    onClose();
  }

  function renderGroup(legend, options, list, setList) {
    return (
      <fieldset>
        <legend>{legend}</legend>
        {options.map(({ value, label }) => (
          <label key={value}>
            <input type="checkbox" checked={list.includes(value)} onChange={() => toggle(list, setList, value)} /> {label}
          </label>
        ))}
      </fieldset>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="filter-modal-content">
        <div className="filter-modal-header">
          <h3>Filtrar tarefa</h3>
          <button type="button" className="filter-modal-close" aria-label="Fechar" onClick={onClose}>&times;</button>
        </div>

        <form id="filter-task-form" onSubmit={handleSubmit}>
          {renderGroup("Prioridade", PRIORITY_OPTIONS, priority, setPriority)}
          {renderGroup("Categoria", CATEGORY_OPTIONS, category, setCategory)}
          {renderGroup("Status", STATUS_OPTIONS, status, setStatus)}

          <div className="filter-modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-submit">Aplicar</button>
          </div>
        </form>
      </div>
    </Modal>
  );
}