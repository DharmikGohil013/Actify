const API = "http://localhost:5000/api"; // Include `/api` if your server uses it!

// Change to your backend URL if needed

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: "Bearer " + token } : {};
}

export async function getTodayTasks() {
  const today = new Date();
  const dateString = today.toISOString().split("T")[0];
  const res = await fetch(`${API}/tasks?date=${dateString}`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getTasksForDate(dateString) {
  const res = await fetch(`${API}/tasks?date=${dateString}`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getTasksForWeek(weekStartDate) {
  const res = await fetch(`${API}/tasks/week?start=${weekStartDate}`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getUpcomingTasks() {
  const res = await fetch(`${API}/tasks?upcoming=1`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getMissedTasks() {
  const res = await fetch(`${API}/tasks?missed=1`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function addTask(task) {
  const res = await fetch(`${API}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function updateTask(id, task) {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}

export async function toggleTaskStatus(id) {
  const res = await fetch(`${API}/tasks/${id}/toggle`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  return res.json();
}

export async function getNotifications() {
  const res = await fetch(`${API}/notifications`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function markNotificationRead(id) {
  const res = await fetch(`${API}/notifications/${id}/read`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  return res.json();
}

export async function markAllNotificationsRead() {
  const res = await fetch(`${API}/notifications/read-all`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  return res.json();
}

export async function deleteNotification(id) {
  const res = await fetch(`${API}/notifications/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}

export async function getSettings() {
  const res = await fetch(`${API}/settings`, { headers: authHeaders() });
  return res.json();
}

export async function updateSettings(settings) {
  const res = await fetch(`${API}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(settings),
  });
  return res.json();
}

export async function getUserProfile() {
  const res = await fetch(`${API}/users/me`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function register(name, email, password) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}
