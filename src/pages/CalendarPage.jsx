import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/useAuth";
import { loadTasks } from "../utils/api";
import "./CalendarPage.css";

import Modal from "../components/Modal";

const STATUS_LABELS = {
  pending: "Pendente",
  in_progress: "Em andamento",
  completed: "Concluída",
};
const CATEGORY_LABELS = {
  uncategorized: "Sem categoria",
  work: "Trabalho",
  study: "Estudo",
  personal: "Pessoal",
};
const PRIORITY_LABELS = { high: "Alta", medium: "Média", low: "Baixa" };

const WEEKDAY_LABELS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

function formatTaskTime(dueDate) {
  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString("pt-br", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CalendarPage() {
  const { token } = useAuth();
  const [displayedMonth, setDisplayedMonth] = useState(new Date());
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!token) return;
    loadTasks(token).then(setTasks);
  }, [token]);

  const tasksByDay = useMemo(() => {
    const grouped = {};
    for (const task of tasks) {
      if (!task.dueDate) continue;
      const key = task.dueDate.substring(0, 10);
      if (!(key in grouped)) grouped[key] = [];
      grouped[key].push(task);
    }
    return grouped;
  }, [tasks]);

  const formatter = new Intl.DateTimeFormat("pt-br", { month: "long" });
  const formatted = formatter.format(displayedMonth);
  const monthName = formatted[0].toUpperCase() + formatted.slice(1);
  const year = displayedMonth.getFullYear();
  const [selectedDayTasks, setSelectedDayTasks] = useState(null);

  function changeMonth(direction) {
    const next = new Date(displayedMonth);
    next.setMonth(next.getMonth() + direction);
    setDisplayedMonth(next);
  }

  const actualMonth = displayedMonth.getMonth();
  const daysOfTheMonth = new Date(year, actualMonth + 1, 0).getDate();
  const firstOfTheMonth = new Date(year, actualMonth, 1).getDay();
  const totalRows = Math.ceil((firstOfTheMonth + daysOfTheMonth) / 7);

  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === actualMonth && today.getFullYear() === year;

  const dayNumbers = Array.from({ length: daysOfTheMonth }, (_, i) => i + 1);
  const totalCells = firstOfTheMonth + daysOfTheMonth;
  const remaining = (7 - (totalCells % 7)) % 7;

  return (
    <div id="calendar-page" className="page-transition visible">
      <header id="calendar-header">
        <h1 id="calendar-title">
          <span id="calendar-month">{monthName}</span>
          <span id="calendar-separator">|</span>
          <span id="calendar-year">{year}</span>
        </h1>
        <div id="calendar-nav">
          <button
            id="calendar-prev-btn"
            className="calendar-nav-btn"
            type="button"
            onClick={() => changeMonth(-1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            id="calendar-next-btn"
            className="calendar-nav-btn"
            type="button"
            onClick={() => changeMonth(1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </header>

      {}
      <div id="calendar-body">
        <div
          id="calendar-grid"
          style={{ gridTemplateRows: `auto repeat(${totalRows}, 1fr)` }}
        >
          {WEEKDAY_LABELS.map((d) => (
            <div className="calendar-weekday-label" key={d}>
              {d}
            </div>
          ))}

          {Array.from({ length: firstOfTheMonth }).map((_, i) => (
            <div key={`empty-before-${i}`} className="calendar-empty-cell" />
          ))}

          {dayNumbers.map((day) => {
            const monthStr = String(actualMonth + 1).padStart(2, "0");
            const dayStr = String(day).padStart(2, "0");
            const key = `${year}-${monthStr}-${dayStr}`;
            const tasksOfDay = tasksByDay[key];
            const hasTasks = tasksOfDay && tasksOfDay.length > 0;
            const isToday = isCurrentMonth && day === today.getDate();
            const className =
              `calendar-day-cell ${hasTasks ? "has-tasks" : ""} ${isToday ? "today" : ""}`.trim();

            if (hasTasks) {
              return (
                <button
                  key={day}
                  type="button"
                  className={className}
                  onClick={() => setSelectedDayTasks(tasksOfDay)}
                >
                  <span className="calendar-day-number">{day}</span>
                  <div className="calendar-day-tasks">
                    {tasksOfDay.slice(0, 2).map((task) => (
                      <span key={task.id} className="calendar-task-chip">
                        {task.title}
                      </span>
                    ))}
                    {tasksOfDay.length > 2 && (
                      <span className="calendar-task-more">
                        +{tasksOfDay.length - 2}
                      </span>
                    )}
                  </div>
                </button>
              );
            }

            return (
              <div key={day} className={className}>
                <span className="calendar-day-number">{day}</span>
              </div>
            );
          })}

          {Array.from({ length: remaining }).map((_, i) => (
            <div key={`empty-after-${i}`} className="calendar-empty-cell" />
          ))}
        </div>
      </div>

      <Modal
        isOpen={!!selectedDayTasks}
        onClose={() => setSelectedDayTasks(null)}
      >
        {selectedDayTasks && (
          <div className="modal-content" id="calendar-modal-content">
            <div className="modal-header">
              <h3>
                {new Date(selectedDayTasks[0].dueDate).toLocaleDateString(
                  "pt-br",
                )}
              </h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setSelectedDayTasks(null)}
              >
                ×
              </button>
            </div>
            {selectedDayTasks.map((task) => {
              const taskTime = formatTaskTime(task.dueDate);
              return (
                <div key={task.id} className="modal-task-item">
                  <div className="modal-task-heading">
                    <h3 className="modal-task-title">{task.title}</h3>
                    {taskTime && (
                      <span className="modal-task-time">{taskTime}</span>
                    )}
                  </div>
                  <div className="modal-tags">
                    <span className="modal-tag">
                      {STATUS_LABELS[task.status?.toLowerCase()] || task.status}
                    </span>
                    <span className="modal-tag">
                      {CATEGORY_LABELS[task.category?.toLowerCase()] ||
                        task.category}
                    </span>
                    <span className="modal-tag">
                      {PRIORITY_LABELS[task.priority?.toLowerCase()] ||
                        task.priority}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}