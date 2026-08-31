//username gretting
async function loadUserGreeting() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "InitialScreen.html";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users/me`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "InitialScreen.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Não foi possível carregar o usuário.");
        }

        const user = await response.json();

        document.getElementById("user-name").textContent =
            user.displayName || "Usuário";

    } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        document.getElementById("user-name").textContent = "Usuário";
    }
}

document.addEventListener("DOMContentLoaded", loadUserGreeting);

// intregate IA
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-to-IA');
const submitButton = document.getElementById('submit-to-IA');
const quickSuggestionsWrapper = document.getElementById('suggestions-buttons');
const greetingElement = document.getElementById('greeting');
const nexusWrapperElement = document.getElementById('nexus-ia-wrapper');

const CHAT_HISTORY_KEY = 'nexusChatHistory';
let chatHistory = [];
let historyIdCounter = 0;
let isSendingMessage = false;

function generateHistoryId() {
    historyIdCounter += 1;
    return `h${Date.now()}_${historyIdCounter}`;
}

function saveChatHistory() {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify({ token, messages: chatHistory }));
}

function loadStoredChatHistory() {
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
        console.error('Erro ao ler histórico do chat:', error);
        return [];
    }
}

function removeFromHistory(historyId) {
    chatHistory = chatHistory.filter((entry) => entry.id !== historyId);
    saveChatHistory();
}

function restoreChatHistory() {
    chatHistory = loadStoredChatHistory();
    if (chatHistory.length === 0) return;

    hideIntro();

    chatHistory.forEach((entry) => {
        if (entry.type === 'message') {
            appendMessageToChat(entry.text, entry.sender, false, entry.responseType);
        } else if (entry.type === 'suggestion') {
            renderSuggestionCard(entry.suggestion, entry.id);
        }
    });
}

function hideIntro() {
    if (greetingElement) greetingElement.style.display = 'none';
    if (quickSuggestionsWrapper) quickSuggestionsWrapper.style.display = 'none';
    if (nexusWrapperElement) nexusWrapperElement.classList.add('chat-active');
}

document.addEventListener('DOMContentLoaded', () => {
    submitButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    if (quickSuggestionsWrapper) {
        quickSuggestionsWrapper.querySelectorAll('button').forEach((button) => {
            button.addEventListener('click', () => {
                messageInput.value = button.textContent.trim();
                sendMessage();
            });
        });
    }

    restoreChatHistory();
});

function sendMessage() {
    if (isSendingMessage) return;

    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    hideIntro();

    appendMessageToChat(userMessage, 'user');
    messageInput.value = '';

    askAssistant(userMessage);
}

async function askAssistant(userMessage) {
    isSendingMessage = true;
    submitButton.disabled = true;
    const loadingIndicator = showLoadingIndicator();

    try {
        const response = await fetch(`${API_URL}/assistant/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userMessage })
        });
        const data = await safeParseJson(response);
        console.log('Assistant raw response:', data);

        if (!response.ok) {
            const serverMessage = extractMessageFromResponse(data);
            appendMessageToChat(
                serverMessage || `O servidor retornou um erro (status ${response.status}). Tenta de novo em instantes.`,
                'ia'
            );
            return;
        }

        const replyText = extractMessageFromResponse(data);
        const hasSuggestions = Array.isArray(data?.suggestions) && data.suggestions.length > 0;

        if (replyText) {
            appendMessageToChat(replyText, 'ia');
        } else if (!hasSuggestions) {
            appendMessageToChat('A IA respondeu, mas em um formato que ainda não reconheço.', 'ia');
        }

        if (hasSuggestions) {
            renderSuggestions(data.suggestions);
        }

    } catch (error) {
        console.error('Erro ao consultar a Nexus IA:', error);
        appendMessageToChat('Não consegui me conectar ao servidor agora. Verifique sua internet e tente de novo.', 'ia');
    } finally {
        removeLoadingIndicator(loadingIndicator);
        isSendingMessage = false;
        submitButton.disabled = false;
    }
}

async function safeParseJson(response) {
    try {
        return await response.json();
    } catch (error) {
        return null;
    }
}

function extractMessageFromResponse(data) {
    if (!data) return null;
    return data.answer ?? data.question ?? data.reply ?? data.message ?? data.response ?? data.reason ?? data.error ?? null;
}

function appendMessageToChat(text, sender, persist = true, responseType = null) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', `chat-message-${sender}`);

    if (responseType) {
        messageElement.classList.add(`chat-message-${responseType.toLowerCase()}`);
    }

    if (!persist) {
        messageElement.style.animation = 'none';
    }

    messageElement.textContent = text;

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (persist) {
        chatHistory.push({ id: generateHistoryId(), type: 'message', text, sender, responseType });
        saveChatHistory();
    }

    return messageElement;
}

function showLoadingIndicator() {
    const indicator = document.createElement('div');
    indicator.classList.add('chat-message', 'chat-message-ia', 'chat-loading-indicator');
    indicator.innerHTML = `
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
    `;

    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return indicator;
}

function removeLoadingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
        indicator.remove();
    }
}
function renderSuggestions(suggestions) {
    suggestions.forEach((suggestion) => {
        const historyId = generateHistoryId();
        renderSuggestionCard(suggestion, historyId);
        chatHistory.push({ id: historyId, type: 'suggestion', suggestion });
    });

    saveChatHistory();
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderSuggestionCard(suggestion, historyId) {
    const suggestionId = getSuggestionId(suggestion);

    const card = document.createElement('div');
    card.classList.add('chat-message', 'chat-message-ia', 'suggestion-card');
    card.dataset.historyId = historyId;

    const description = document.createElement('p');
    description.classList.add('suggestion-description');
    description.textContent = describeSuggestion(suggestion);
    card.appendChild(description);

    const actionsWrapper = document.createElement('div');
    actionsWrapper.classList.add('suggestion-actions');

    const showButton = document.createElement('button');
    showButton.type = 'button';
    showButton.classList.add('suggestion-show');
    showButton.textContent = 'Mostrar';
    showButton.addEventListener('click', () => showSuggestionDetails(suggestion));

    const confirmButton = document.createElement('button');
    confirmButton.type = 'button';
    confirmButton.classList.add('suggestion-confirm');
    confirmButton.textContent = 'Confirmar';
    confirmButton.addEventListener('click', () => confirmSuggestion(suggestionId, card, historyId));

    const rejectButton = document.createElement('button');
    rejectButton.type = 'button';
    rejectButton.classList.add('suggestion-reject');
    rejectButton.textContent = 'Cancelar';
    rejectButton.addEventListener('click', () => rejectSuggestion(suggestionId, card, historyId));

    actionsWrapper.appendChild(showButton);
    actionsWrapper.appendChild(confirmButton);
    actionsWrapper.appendChild(rejectButton);
    card.appendChild(actionsWrapper);

    chatMessages.appendChild(card);

    return card;
}

function showSuggestionDetails(suggestion) {
    const overlay = document.createElement('div');
    overlay.classList.add('suggestion-modal-overlay');

    const modal = document.createElement('div');
    modal.classList.add('suggestion-modal');

    const title = document.createElement('h3');
    title.classList.add('suggestion-modal-title');
    title.textContent = 'Detalhes da ação sugerida';
    modal.appendChild(title);

    const list = document.createElement('dl');
    list.classList.add('suggestion-modal-details');

    const fields = [
        ['Ação', formatActionLabel(suggestion.action)],
        ['Título', suggestion.title],
        ['Descrição', suggestion.description],
        ['Categoria', formatCategoryLabel(suggestion.category)],
        ['Prioridade', formatPriorityLabel(suggestion.priority)],
        ['Vencimento', formatDateLabel(suggestion.dueDate)],
        ['Lembrete', formatDateLabel(suggestion.reminderDate)]
    ];

    fields.forEach(([label, value]) => {
        if (!value) return;

        const dt = document.createElement('dt');
        dt.textContent = label;

        const dd = document.createElement('dd');
        dd.textContent = value;

        list.appendChild(dt);
        list.appendChild(dd);
    });

    if (!list.children.length) {
        const empty = document.createElement('p');
        const actionLabel = formatActionLabel(suggestion.action) || 'Executar ação na tarefa';
        empty.textContent = actionLabel;
        modal.appendChild(empty);
    } else {
        modal.appendChild(list);
    }

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.classList.add('suggestion-modal-close');
    closeButton.textContent = 'Fechar';
    closeButton.addEventListener('click', () => overlay.remove());

    modal.appendChild(closeButton);
    overlay.appendChild(modal);

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) overlay.remove();
    });

    document.body.appendChild(overlay);
}

function formatActionLabel(action) {
    const actionLabels = {
        CREATE: 'Criar tarefa',
        UPDATE: 'Atualizar tarefa',
        DELETE: 'Excluir tarefa',
        START: 'Iniciar tarefa',
        COMPLETE: 'Concluir tarefa'
    };

    if (!action) return null;
    return actionLabels[action.toUpperCase()] || action;
}

function formatPriorityLabel(priority) {
    if (!priority) return null;

    const priorityLabels = {
        high: 'Alta',
        alta: 'Alta',
        medium: 'Média',
        media: 'Média',
        low: 'Baixa',
        baixa: 'Baixa'
    };

    return priorityLabels[priority.toLowerCase()] || priority;
}

function formatCategoryLabel(category) {
    if (!category) return null;

    const categoryLabels = {
        uncategorized: 'Sem categoria',
        work: 'Trabalho',
        study: 'Estudo',
        personal: 'Pessoal'
    };

    return categoryLabels[category.toLowerCase()] || category;
}

function formatDateLabel(dateValue) {
    if (!dateValue) return null;

    const parsed = new Date(dateValue);
    if (isNaN(parsed.getTime())) return dateValue; 

    return parsed.toLocaleString('pt-BR');
}

function getSuggestionId(suggestion) {
    const id = suggestion.id ?? suggestion.suggestionId;

    if (!id) {
        console.warn('Sugestão veio sem campo id/suggestionId esperado:', suggestion);
    }

    return id;
}

function describeSuggestion(suggestion) {
    const actionLabels = {
        CREATE: 'Criar a tarefa',
        UPDATE: 'Atualizar a tarefa',
        DELETE: 'Excluir a tarefa',
        START: 'Iniciar a tarefa',
        COMPLETE: 'Concluir a tarefa'
    };

    const actionKey = (suggestion.action || '').toUpperCase();
    const actionLabel = actionLabels[actionKey] || 'Executar ação na tarefa';
    const title = suggestion.title ? `"${suggestion.title}"` : '';

    return `${actionLabel} ${title}`.trim();
}

async function confirmSuggestion(suggestionId, cardElement, historyId) {
    await resolveSuggestion('/assistant/confirm', suggestionId, cardElement, historyId, 'Ação confirmada.');
}

async function rejectSuggestion(suggestionId, cardElement, historyId) {
    await resolveSuggestion('/assistant/reject', suggestionId, cardElement, historyId, 'Ação cancelada.');
}

async function resolveSuggestion(endpointPath, suggestionId, cardElement, historyId, successMessage) {
    if (!suggestionId) {
        console.error('Não é possível resolver a sugestão: suggestionId ausente.');
        appendMessageToChat('Não consegui identificar essa sugestão pra confirmar ou cancelar.', 'ia');
        enableSuggestionCard(cardElement);
        return;
    }

    disableSuggestionCard(cardElement);

    try {
        const response = await fetch(`${API_URL}${endpointPath}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ suggestionId })
        });

        const data = await safeParseJson(response);
        console.log(`Resposta de ${endpointPath}:`, data);

        if (!response.ok) {
            const serverMessage = extractMessageFromResponse(data);
            enableSuggestionCard(cardElement);
            appendMessageToChat(
                serverMessage || `O servidor retornou um erro (status ${response.status}) ao processar essa ação.`,
                'ia'
            );
            return;
        }

        if (cardElement) cardElement.remove();
        removeFromHistory(historyId);
        appendMessageToChat(successMessage, 'ia');

        if (typeof refreshTasks === 'function') {
            refreshTasks();
        }

    } catch (error) {
        console.error(`Erro ao chamar ${endpointPath}:`, error);
        enableSuggestionCard(cardElement);
        appendMessageToChat('Não consegui me conectar ao servidor pra concluir essa ação.', 'ia');
    }
}

function disableSuggestionCard(cardElement) {
    if (!cardElement) return;
    cardElement.querySelectorAll('button').forEach((button) => {
        button.disabled = true;
    });
}

function enableSuggestionCard(cardElement) {
    if (!cardElement) return;
    cardElement.querySelectorAll('button').forEach((button) => {
        button.disabled = false;
    });
}

//clear conversation
function showConfirmModal(message) {
    return new Promise((resolve) => {
        const overlay = document.getElementById('confirm-modal-overlay');
        const text = document.getElementById('confirm-modal-text');
        const okBtn = document.getElementById('confirm-modal-ok');
        const cancelBtn = document.getElementById('confirm-modal-cancel');

        text.textContent = message;
        overlay.classList.remove('hidden');

        function cleanup(result) {
            overlay.classList.add('hidden');
            okBtn.removeEventListener('click', onOk);
            cancelBtn.removeEventListener('click', onCancel);
            resolve(result);
        }

        function onOk() { cleanup(true); }
        function onCancel() { cleanup(false); }

        okBtn.addEventListener('click', onOk);
        cancelBtn.addEventListener('click', onCancel);
    });
}

document.getElementById('clear-chat-btn')?.addEventListener('click', async () => {
    const confirmed = await showConfirmModal('Tem certeza que quer limpar toda a conversa?');
    if (!confirmed) return;

    localStorage.removeItem(CHAT_HISTORY_KEY);
    chatHistory = [];
    chatMessages.innerHTML = '';

    if (greetingElement) greetingElement.style.display = '';
    if (quickSuggestionsWrapper) quickSuggestionsWrapper.style.display = '';
    if (nexusWrapperElement) nexusWrapperElement.classList.remove('chat-active');
});