const API_URL = "http://localhost:8080";
const token = localStorage.getItem("token");

async function loadTasks() {
    const response = await fetch(`${API_URL}/tasks`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return await response.json();
}