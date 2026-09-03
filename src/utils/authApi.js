const API_BASE_URL = "http://localhost:8080";

export async function login(identifier, password) {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  const data = await response.json().catch(() => null);
  return { response, data };
}

export async function fetchMe(token) {
  return fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateMe(token, updates) {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  const data = await response.json().catch(() => null);
  return { response, data };
}

export async function deleteMe(token) {
  return fetch(`${API_BASE_URL}/users/me`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}