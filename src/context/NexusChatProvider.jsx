import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { API_URL } from "../utils/api";
import { NexusChatContext } from "./NexusChatContext";

const CHAT_HISTORY_KEY = "nexusChatHistory";

function loadStoredHistory(token) {
  const raw = localStorage.getItem(CHAT_HISTORY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (parsed.token !== token) {
      localStorage.removeItem(CHAT_HISTORY_KEY);
      return [];
    }
    return Array.isArray(parsed.messages) ? parsed.messages : [];
  } catch (error) {
    console.error("Erro ao ler histórico do chat:", error);
    return [];
  }
}

function saveHistory(token, messages) {
  const cleaned = messages.map((entry) =>
    entry.kind === "suggestion" ? { ...entry, resolving: false } : entry,
  );
  localStorage.setItem(
    CHAT_HISTORY_KEY,
    JSON.stringify({ token, messages: cleaned }),
  );
}

function extractMessageFromResponse(data) {
  if (!data) return null;
  return (
    data.answer ??
    data.question ??
    data.reply ??
    data.message ??
    data.response ??
    data.reason ??
    data.error ??
    null
  );
}

async function safeParseJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function getSuggestionId(suggestion) {
  const id = suggestion.id ?? suggestion.suggestionId;
  if (!id) {
    console.warn(
      "Sugestão veio sem campo id/suggestionId esperado:",
      suggestion,
    );
  }
  return id;
}

export function NexusChatProvider({ children }) {
  const { token } = useAuth();

  const [messages, setMessages] = useState(() =>
    token ? loadStoredHistory(token) : [],
  );
  const [prevToken, setPrevToken] = useState(token);
  const [isSending, setIsSending] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);

  // Recarrega o histórico quando o token mudar (login/logout/troca de conta)
  if (token !== prevToken) {
    setPrevToken(token);
    setMessages(token ? loadStoredHistory(token) : []);
  }

  useEffect(() => {
    if (!token) return;
    saveHistory(token, messages);
  }, [messages, token]);

  const appendIaMessage = useCallback((text, responseType = null) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `h${prev.length}`,
        kind: "message",
        sender: "ia",
        text,
        responseType,
      },
    ]);
  }, []);

  const appendSuggestions = useCallback((suggestions) => {
    setMessages((prev) => [
      ...prev,
      ...suggestions.map((suggestion, index) => ({
        id: `h${prev.length + index}`,
        kind: "suggestion",
        suggestion,
        resolving: false,
      })),
    ]);
  }, []);

  // Não depende de nada da página — continua rodando mesmo se o
  // usuário navegar para outra rota enquanto a requisição está em voo.
  const askAssistant = useCallback(
    async (userMessage) => {
      setIsSending(true);
      setLoadingVisible(true);

      try {
        const response = await fetch(`${API_URL}/assistant/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userMessage }),
        });
        const data = await safeParseJson(response);

        if (!response.ok) {
          const serverMessage = extractMessageFromResponse(data);
          appendIaMessage(
            serverMessage ||
              `O servidor retornou um erro (status ${response.status}). Tenta de novo em instantes.`,
          );
          return;
        }

        const replyText = extractMessageFromResponse(data);
        const hasSuggestions =
          Array.isArray(data?.suggestions) && data.suggestions.length > 0;

        if (replyText) {
          appendIaMessage(replyText);
        } else if (!hasSuggestions) {
          appendIaMessage(
            "A IA respondeu, mas em um formato que ainda não reconheço.",
          );
        }

        if (hasSuggestions) {
          appendSuggestions(data.suggestions);
        }
      } catch (error) {
        console.error("Erro ao consultar a Nexus IA:", error);
        appendIaMessage(
          "Não consegui me conectar ao servidor agora. Verifique sua internet e tente de novo.",
        );
      } finally {
        setLoadingVisible(false);
        setIsSending(false);
      }
    },
    [token, appendIaMessage, appendSuggestions],
  );

  const sendMessage = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;
      setMessages((prev) => [
        ...prev,
        {
          id: `h${prev.length}`,
          kind: "message",
          sender: "user",
          text: trimmed,
        },
      ]);
      askAssistant(trimmed);
    },
    [isSending, askAssistant],
  );

  const resolveSuggestion = useCallback(
    async (endpointPath, entryId, suggestion, successMessage) => {
      const suggestionId = getSuggestionId(suggestion);

      if (!suggestionId) {
        appendIaMessage(
          "Não consegui identificar essa sugestão pra confirmar ou cancelar.",
        );
        return;
      }

      setMessages((prev) =>
        prev.map((entry) =>
          entry.id === entryId ? { ...entry, resolving: true } : entry,
        ),
      );

      try {
        const response = await fetch(`${API_URL}${endpointPath}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ suggestionId }),
        });

        const data = await safeParseJson(response);

        if (!response.ok) {
          const serverMessage = extractMessageFromResponse(data);
          setMessages((prev) =>
            prev.map((entry) =>
              entry.id === entryId ? { ...entry, resolving: false } : entry,
            ),
          );
          appendIaMessage(
            serverMessage ||
              `O servidor retornou um erro (status ${response.status}) ao processar essa ação.`,
          );
          return;
        }

        setMessages((prev) => prev.filter((entry) => entry.id !== entryId));
        appendIaMessage(successMessage);
      } catch (error) {
        console.error(`Erro ao chamar ${endpointPath}:`, error);
        setMessages((prev) =>
          prev.map((entry) =>
            entry.id === entryId ? { ...entry, resolving: false } : entry,
          ),
        );
        appendIaMessage(
          "Não consegui me conectar ao servidor pra concluir essa ação.",
        );
      }
    },
    [token, appendIaMessage],
  );

  const confirmSuggestion = useCallback(
    (entryId, suggestion) =>
      resolveSuggestion(
        "/assistant/confirm",
        entryId,
        suggestion,
        "Ação confirmada.",
      ),
    [resolveSuggestion],
  );

  const rejectSuggestion = useCallback(
    (entryId, suggestion) =>
      resolveSuggestion(
        "/assistant/reject",
        entryId,
        suggestion,
        "Ação cancelada.",
      ),
    [resolveSuggestion],
  );

  const clearChat = useCallback(() => {
    localStorage.removeItem(CHAT_HISTORY_KEY);
    setMessages([]);
  }, []);

  const value = {
    messages,
    isSending,
    loadingVisible,
    sendMessage,
    confirmSuggestion,
    rejectSuggestion,
    clearChat,
  };

  return (
    <NexusChatContext.Provider value={value}>
      {children}
    </NexusChatContext.Provider>
  );
}
