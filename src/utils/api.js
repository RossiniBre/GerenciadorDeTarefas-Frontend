export const API_URL = "http://localhost:8080";

export async function loadTasks(token) {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
}

export async function createTask(token, task) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  const data = await response.json();
  return { response, data };
}

export async function updateTask(token, id, updates) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  const data = await response.json();
  return { response, data };
}

export async function deleteTask(token, id) {
  return fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function changeTaskStatus(token, id, action) {
  return fetch(`${API_URL}/tasks/${id}/${action}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function userRegister(userData) {
    const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return { response, data };
}

export async function forgotPassword(email) {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return { response, data };
}

export async function resetPassword(code, newPassword) {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: code, newPassword }),
  });

  const data = await response.json().catch(() => null);

  return { response, data };
}