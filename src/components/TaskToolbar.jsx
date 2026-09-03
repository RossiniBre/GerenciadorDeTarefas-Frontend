import { Search, CircleX } from "lucide-react";
import "./TaskToolbar.css";

export default function TaskToolbar({ searchTerm, onSearchTermChange, onOpenFilters }) {
  return (
    <div id="task-filters">
      <div id="task-toolbar">
        <form className="task-search" onSubmit={(e) => e.preventDefault()}>
          <div className="task-search-wrapper">
            <Search size={24} />

            <input
              type="search"
              id="task-search"
              placeholder="Pesquisar tarefas..."
              autoComplete="off"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
            />

            <button
              className="clear-search"
              aria-label="Limpar pesquisa"
              type="button"
              onClick={() => onSearchTermChange("")}
            >
              <CircleX size={24} />
            </button>
          </div>
        </form>

        <button id="task-button-filter" type="button" onClick={onOpenFilters}>
          Filtrar Tarefas
        </button>
      </div>

      <div id="active-filters"></div>
    </div>
  );
}