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


// Create a new project
export async function createProject(project) {
  const res = await fetch(`${API}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(project),
  });
  return res.json();
}

// Get all projects of logged-in user
export async function getMyProjects() {
  const res = await fetch(`${API}/projects`, {
    headers: authHeaders(),
  });
  return res.json();
}

// Get one project with full detail
export async function getProjectById(id) {
  const res = await fetch(`${API}/projects/${id}`, {
    headers: authHeaders(),
  });
  return res.json();
}

// Delete a project (Admin only)
export async function deleteProject(id) {
  const res = await fetch(`${API}/projects/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}

// Add member to a project (Admin only)
export async function addProjectMember(projectId, userId, role) {
  const res = await fetch(`${API}/projects/${projectId}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ userId, role }),
  });
  return res.json();
}

// Remove a member from a project (Admin only)
export async function removeProjectMember(projectId, userId) {
  const res = await fetch(`${API}/projects/${projectId}/members/${userId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}


// Create a task under a project
export async function createProjectTask(projectId, task) {
  const res = await fetch(`${API}/projects/${projectId}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(task),
  });
  return res.json();
}

// Start a task (Member marks it as started)
export async function startProjectTask(taskId) {
  const res = await fetch(`${API}/project-tasks/${taskId}/start`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  return res.json();
}

// Complete a task (Member marks it as done)
export async function completeProjectTask(taskId) {
  const res = await fetch(`${API}/project-tasks/${taskId}/complete`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  return res.json();
}

// Get all tasks under one project
export async function getProjectTasks(projectId) {
  const res = await fetch(`${API}/projects/${projectId}/tasks`, {
    headers: authHeaders(),
  });
  return res.json();
}



export async function searchUsers(query) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5000/api/users/search?q=${encodeURIComponent(query)}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Check if response is ok and type is JSON
  const contentType = res.headers.get("content-type");
  if (!res.ok || !contentType?.includes("application/json")) {
    const text = await res.text();
    console.error("Invalid response:", res.status, text);
    throw new Error("Invalid response from server");
  }

  return res.json();
}



export async function followUser(userId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`/api/users/follow/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Follow failed");
  return res.json();
}
