import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/useAuth";
import { useNexusChat } from "../context/useNexusChat";

import "./NexusIAPage.css";

import Modal from "../components/Modal";

const QUICK_SUGGESTIONS = [
  "O que tenho para hoje?",
  "O que devo priorizar?",
  "Tenho tarefas atrasadas?",
  "Organize meu dia",
  "Como está minha semana?",
];

const ACTION_LABELS = {
  CREATE: "Criar tarefa",
  UPDATE: "Atualizar tarefa",
  DELETE: "Excluir tarefa",
  START: "Iniciar tarefa",
  COMPLETE: "Concluir tarefa",
};

const ACTION_LABELS_VERB = {
  CREATE: "Criar a tarefa",
  UPDATE: "Atualizar a tarefa",
  DELETE: "Excluir a tarefa",
  START: "Iniciar a tarefa",
  COMPLETE: "Concluir a tarefa",
};

const PRIORITY_LABELS = {
  high: "Alta",
  alta: "Alta",
  medium: "Média",
  media: "Média",
  low: "Baixa",
  baixa: "Baixa",
};

const CATEGORY_LABELS = {
  uncategorized: "Sem categoria",
  work: "Trabalho",
  study: "Estudo",
  personal: "Pessoal",
};

function formatActionLabel(action) {
  if (!action) return null;
  return ACTION_LABELS[action.toUpperCase()] || action;
}

function formatPriorityLabel(priority) {
  if (!priority) return null;
  return PRIORITY_LABELS[priority.toLowerCase()] || priority;
}

function formatCategoryLabel(category) {
  if (!category) return null;
  return CATEGORY_LABELS[category.toLowerCase()] || category;
}

function formatDateLabel(dateValue) {
  if (!dateValue) return null;
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return dateValue;
  return parsed.toLocaleString("pt-BR");
}

function describeSuggestion(suggestion) {
  const actionKey = (suggestion.action || "").toUpperCase();
  const actionLabel = ACTION_LABELS_VERB[actionKey] || "Executar ação na tarefa";
  const title = suggestion.title ? `"${suggestion.title}"` : "";
  return `${actionLabel} ${title}`.trim();
}

function buildSuggestionFields(suggestion) {
  if (!suggestion) return [];
  return [
    ["Ação", formatActionLabel(suggestion.action)],
    ["Título", suggestion.title],
    ["Descrição", suggestion.description],
    ["Categoria", formatCategoryLabel(suggestion.category)],
    ["Prioridade", formatPriorityLabel(suggestion.priority)],
    ["Vencimento", formatDateLabel(suggestion.dueDate)],
    ["Lembrete", formatDateLabel(suggestion.reminderDate)],
  ].filter(([, value]) => !!value);
}

export default function NexusIAPage() {
  const { displayName } = useAuth();
  const userName = displayName || "Usuário";

  const { messages, isSending, loadingVisible, sendMessage, confirmSuggestion, rejectSuggestion, clearChat } = useNexusChat();

  const [inputValue, setInputValue] = useState("");
  const [detailSuggestion, setDetailSuggestion] = useState(null);
  const [confirmState, setConfirmState] = useState({ open: false, message: "" });
  const resolveConfirmRef = useRef(null);
  const chatMessagesRef = useRef(null);

  const chatActive = messages.length > 0;

  useEffect(() => {
    const el = chatMessagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loadingVisible]);

  function handleSend() {
    if (isSending) return;
    sendMessage(inputValue);
    setInputValue("");
  }

  function handleInputKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function askConfirmation(message) {
    return new Promise((resolve) => {
      resolveConfirmRef.current = resolve;
      setConfirmState({ open: true, message });
    });
  }

  function handleConfirmResult(result) {
    setConfirmState((state) => ({ ...state, open: false }));
    if (resolveConfirmRef.current) {
      resolveConfirmRef.current(result);
      resolveConfirmRef.current = null;
    }
  }

  async function handleClearChat() {
    const confirmed = await askConfirmation("Tem certeza que quer limpar toda a conversa?");
    if (!confirmed) return;
    clearChat();
  }

  return (
    <main id="nexus-page" className="container page-transition visible">
      <p id="nexus-label">
        Nexus IA <span className="dot-separator">•</span>
        <img src="src//assets/Favicon.ico" alt="" id="nexus-mini-icon" />
      </p>

      {chatActive && (
        <button type="button" id="clear-chat-btn" title="Limpar conversa" onClick={handleClearChat}>
            Limpar conversa
        </button>
        )}

      <div id="nexus-ia-wrapper" className={chatActive ? "chat-active" : ""}>
        <header id="greeting">
          <h2>
            Olá <span id="user-name">{userName}</span>, Como posso te ajudar?
          </h2>
        </header>

        <div id="chat-messages" ref={chatMessagesRef}>
          {messages.map((entry) => {
            if (entry.kind === "message") {
              const classes = ["chat-message", `chat-message-${entry.sender}`];
              if (entry.responseType) classes.push(`chat-message-${entry.responseType.toLowerCase()}`);
              return (
                <div key={entry.id} className={classes.join(" ")}>
                  {entry.text}
                </div>
              );
            }

            const { suggestion, resolving } = entry;
            return (
              <div key={entry.id} className="chat-message chat-message-ia suggestion-card">
                <p className="suggestion-description">{describeSuggestion(suggestion)}</p>
                <div className="suggestion-actions">
                  <button
                    type="button"
                    className="suggestion-show"
                    disabled={resolving}
                    onClick={() => setDetailSuggestion(suggestion)}
                  >
                    Mostrar
                  </button>
                  <button
                    type="button"
                    className="suggestion-confirm"
                    disabled={resolving}
                    onClick={() => confirmSuggestion(entry.id, suggestion)}
                  >
                    Confirmar
                  </button>
                  <button
                    type="button"
                    className="suggestion-reject"
                    disabled={resolving}
                    onClick={() => rejectSuggestion(entry.id, suggestion)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            );
          })}

          {loadingVisible && (
            <div className="chat-message chat-message-ia chat-loading-indicator">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          )}
        </div>

        <div id="message-tool">
          <input
            type="text"
            id="message-to-IA"
            placeholder="Digite algo..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleInputKeyDown}
          />
          <button type="button" id="submit-to-IA" onClick={handleSend} disabled={isSending}>
            Enviar
          </button>
        </div>

        <div id="suggestions-buttons">
          {QUICK_SUGGESTIONS.map((text) => (
            <div className="suggestion-item" key={text}>
              <button type="button" onClick={() => sendMessage(text)}>
                {text}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: detalhes da ação sugerida (botão "Mostrar") */}
      <Modal isOpen={!!detailSuggestion} onClose={() => setDetailSuggestion(null)}>
        {detailSuggestion && (
          <div className="modal-content" id="nexus-suggestion-modal">
            <div className="modal-header">
              <h3>Detalhes da ação sugerida</h3>
              <button type="button" className="modal-close" onClick={() => setDetailSuggestion(null)}>
                ×
              </button>
            </div>

            {buildSuggestionFields(detailSuggestion).length > 0 ? (
              <dl id="nexus-suggestion-details">
                {buildSuggestionFields(detailSuggestion).map(([label, value]) => (
                  <div className="nexus-suggestion-field" key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p>{formatActionLabel(detailSuggestion.action) || "Executar ação na tarefa"}</p>
            )}
          </div>
        )}
      </Modal>

      {/* Modal: confirmar limpeza da conversa */}
      <Modal isOpen={confirmState.open} onClose={() => handleConfirmResult(false)}>
        <div className="modal-content confirm-modal-content" id="nexus-confirm-modal">
          <h3>Confirmar</h3>
          <p>{confirmState.message}</p>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => handleConfirmResult(false)}>
              Cancelar
            </button>
            <button type="button" className="btn-submit" onClick={() => handleConfirmResult(true)}>
              Limpar
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}