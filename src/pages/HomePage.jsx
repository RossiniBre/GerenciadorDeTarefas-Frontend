import { useState, useEffect, useCallback } from "react";
import Header from "../components/Header";
import TaskToolbar from "../components/TaskToolbar";
import TaskCard from "../components/Taskcard";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskDetailsModal from "../components/TaskDetailsModal";
import FilterModal from "../components/FilterModal";
import { useAuth } from "../context/useAuth";
import { loadTasks } from "../utils/api";
import "./HomePage.css";

const FILTER_LABELS = {
  priority: { HIGH: "Alta", MEDIUM: "Média", LOW: "Baixa" },
  category: { STUDY: "Estudo", WORK: "Trabalho", PERSONAL: "Pessoal", UNCATEGORIZED: "Sem categoria" },
  status: { PENDING: "Pendente", IN_PROGRESS: "Em andamento", COMPLETED: "Completa" },
};

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const { token, displayName } = useAuth();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsVisible(true);
  }, []);

  const [tasks, setTasks] = useState([]);
  const [toast, setToast] = useState("");

  const refreshTasks = useCallback(async () => {
    if (!token) return;
    const data = await loadTasks(token);
    setTasks(data);
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshTasks();
  }, [refreshTasks]);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  }

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ priority: [], category: [], status: [] });

  function removeFilter(type, value) {
    setActiveFilters((prev) => ({ ...prev, [type]: prev[type].filter((v) => v !== value) }));
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = activeFilters.priority.length === 0 || activeFilters.priority.includes(task.priority);
    const taskCategory = task.category || "UNCATEGORIZED";
    const matchesCategory = activeFilters.category.length === 0 || activeFilters.category.includes(taskCategory);
    const matchesStatus = activeFilters.status.length === 0 || activeFilters.status.includes(task.status);
    return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
  });

  const activeFilterChips = Object.entries(activeFilters).flatMap(([type, values]) =>
    values.map((value) => ({ type, value, label: FILTER_LABELS[type][value] }))
  );

  return (
    <div className={`home-container page-transition ${isVisible ? "visible" : ""}`}>
      <Header userName={displayName} onCreateTask={() => setCreateOpen(true)} />

      <TaskToolbar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onOpenFilters={() => setFilterOpen(true)}
      />

      {activeFilterChips.length > 0 && (
        <div id="active-filters">
          {activeFilterChips.map(({ type, value, label }) => (
            <span className="filter-chip" key={`${type}-${value}`}>
              {label}
              <button type="button" className="filter-chip-remove" onClick={() => removeFilter(type, value)}>×</button>
            </span>
          ))}
        </div>
      )}

      <div id="tasks-container">
        {filteredTasks.length === 0 && <p className="tasks-empty">Nenhuma tarefa encontrada.</p>}

        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
        ))}
      </div>

      <div id="toast" className={`toast ${toast ? "show" : ""}`}>{toast}</div>

      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          showToast("Tarefa criada com sucesso!");
          refreshTasks();
        }}
      />

      <TaskDetailsModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onChanged={refreshTasks}
        showToast={showToast}
      />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setFilterOpen(false)}
        activeFilters={activeFilters}
        onApply={setActiveFilters}
      />
    </div>
  );
}