import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { fetchMe, updateMe, deleteMe } from "../utils/authApi";
import "./MyAccountPage.css";
import "./SuccessToast.css";

export default function MyAccountPage() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [displayName, setDisplayName] = useState("Carregando...");
  const [userMeta, setUserMeta] = useState("Carregando...");

  const [newUsername, setNewUsername] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [toast, setToast] = useState({ message: "", show: false });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadAccountInfo = useCallback(async () => {
    try {
      const response = await fetchMe(token);

      if (!response.ok) {
        throw new Error("Não foi possível carregar o usuário.");
      }

      const user = await response.json();
      setDisplayName(user.displayName || "Usuário");
      setUserMeta(`${user.email} | ${user.username}`);
    } catch (error) {
      console.error("Erro ao carregar conta:", error);
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAccountInfo();
    }, [loadAccountInfo]);

  function showToast(message) {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: "", show: false }), 1500);
  }

  const [showSuccessToast, setShowSuccessToast] = useState(false);

    const { checkSession } = useAuth();

    async function handleSave() {
      const body = {};
      if (newUsername.trim()) body.username = newUsername.trim();
      if (newDisplayName.trim()) body.displayName = newDisplayName.trim();
      if (newEmail.trim()) body.email = newEmail.trim();

      if (Object.keys(body).length === 0) {
        alert("Preencha ao menos um campo pra salvar.");
        return;
      }

      setSaving(true);

      try {
        const { response, data } = await updateMe(token, body);

        if (!response.ok) {
          throw new Error(data?.message || `Erro ${response.status}`);
        }

        setDisplayName(data.displayName);
        setUserMeta(`${data.email} | ${data.username}`);

        await checkSession();

        setShowSuccessToast(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        console.error("Erro ao salvar dados da conta:", error);
        showToast("Não foi possível salvar. Tente novamente.");
      } finally {
        setSaving(false);
      }
    }

  const [showDeleteSuccessToast, setShowDeleteSuccessToast] = useState(false);

    async function handleConfirmDelete() {
    try {
        const response = await deleteMe(token);

        if (!response.ok && response.status !== 204) {
        throw new Error(`Erro ${response.status}`);
        }

        setShowDeleteModal(false);
        setShowDeleteSuccessToast(true);

        setTimeout(() => {
        logout();
        navigate("/login");
        }, 3000);
    } catch (error) {
        console.error("Erro ao deletar conta:", error);
        setShowDeleteModal(false);
        showToast("Não foi possível deletar a conta. Tente novamente.");
    }
    }

  return (
    <main className="account-container page-transition visible">
      <header className="infos">
        <div className="user-identity">
          <h2 id="display-name">{displayName}</h2>
          <h3 id="user-meta">{userMeta}</h3>
        </div>
        <p id="task-count"></p>
      </header>

      <form
        className="alter-infos"
        onSubmit={(event) => {
          event.preventDefault();
          handleSave();
        }}
      >
        <div className="fields-grid">
          <div className="field">
            <input
              type="text"
              id="new-username"
              placeholder=" "
              value={newUsername}
              onChange={(event) => setNewUsername(event.target.value)}
            />
            <label htmlFor="new-username">Alterar nome de usuário</label>
          </div>

          <div className="field">
            <input
              type="text"
              id="new-display-name"
              placeholder=" "
              value={newDisplayName}
              onChange={(event) => setNewDisplayName(event.target.value)}
            />
            <label htmlFor="new-display-name">Nome de exibição</label>
          </div>

          <div className="field field-password">
            <a
              href="/forgot-password"
              className="reset-password-link"
              onClick={(event) => {
                event.preventDefault();
                navigate("/forgot-password");
              }}
            >
              Redefinir senha
            </a>
          </div>

          <div className="field">
            <input
              type="email"
              id="new-email"
              placeholder=" "
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
            />
            <label htmlFor="new-email">Alterar email</label>
          </div>
        </div>

        <div id="account-buttons">
          <button id="save-infos" type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <button
            id="delete-account"
            type="button"
            onClick={() => setShowDeleteModal(true)}
          >
            Deletar minha conta
          </button>
        </div>
      </form>

      <div id="toast" className={`toast ${toast.show ? "show" : ""}`}>
        {toast.message}
      </div>

      {showSuccessToast && (
        <div className="success-overlay">
            <div className="success-modal">
            <div className="success-icon">✓</div>
            <h2>Dados atualizados com sucesso!</h2>
            <p>Redirecionando...</p>
            </div>
        </div>
        )}

      {showDeleteModal && (
        <div
          id="confirm-delete-account-modal"
          className="modal"
          onClick={(event) => {
            if (event.target.id === "confirm-delete-account-modal") {
              setShowDeleteModal(false);
            }
          }}
        >
          <div className="modal-content confirm-modal-content">
            <h3>Deletar conta</h3>
            <p>Tem certeza que deseja deletar sua conta? Essa ação não pode ser desfeita.</p>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-delete"
                onClick={handleConfirmDelete}
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteSuccessToast && (
        <div className="success-overlay">
            <div className="success-modal danger">
            <div className="success-icon danger">✓</div>
            <h2>Conta deletada com sucesso!</h2>
            <p>Redirecionando...</p>
            </div>
        </div>
        )}
    </main>
  );
}