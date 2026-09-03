import { statusLabel, priorityLabel, categoryLabel, formatDate, formatTime } from "../utils/taskFormatters";
import "./TaskCard.css";

export default function TaskCard({ task, onClick }) {
  return (
    <div className="task-card" onClick={() => onClick(task)}>
      <div className="task-card-header">
        <span className="task-card-title">{task.title}</span>
        <span className="task-card-date">{formatDate(task.dueDate)}</span>
      </div>

      <div className="task-card-badges">
        <span className={`badge badge-status status-${task.status.toLowerCase()}`}>
          {statusLabel(task.status)}
        </span>
        <span className={`badge badge-priority priority-${task.priority.toLowerCase()}`}>
          {priorityLabel(task.priority)}
        </span>
      </div>

      {task.category && (
        <div className="task-card-badges">
          <span className="badge badge-category">{categoryLabel(task.category)}</span>
        </div>
      )}

      <div className="task-card-footer">
        <span className="task-card-time">{formatTime(task.dueDate)}</span>
      </div>
    </div>
  );
}