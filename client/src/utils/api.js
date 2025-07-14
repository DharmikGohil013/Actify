const API = "https://actify.onrender.com/api"; // Include `/api` if your server uses it!

// Change to your backend URL if needed

// Network connectivity check
export async function checkServerHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const res = await fetch(`${API}/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' }
    });
    
    clearTimeout(timeoutId);
    
    if (res.ok) {
      return { 
        status: 'online', 
        message: 'Server is reachable',
        statusCode: res.status 
      };
    } else {
      return { 
        status: 'error', 
        message: `Server responded with status ${res.status}`,
        statusCode: res.status 
      };
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      return { 
        status: 'timeout', 
        message: 'Server connection timed out (>5s)',
        error: error.message 
      };
    }
    return { 
      status: 'offline', 
      message: 'Cannot reach server',
      error: error.message 
    };
  }
}

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: "Bearer " + token } : {};
}

export async function getTodayTasks() {
  try {
    const today = new Date();
    const dateString = today.toISOString().split("T")[0];
    const res = await fetch(`${API}/tasks?date=${dateString}`, {
      headers: authHeaders(),
    });
    
    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType?.includes("application/json")) {
      const text = await res.text();
      console.error("Invalid response from getTodayTasks:", res.status, text);
      return []; // Return empty array as fallback
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error in getTodayTasks:", error);
    return []; // Return empty array as fallback
  }
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
  try {
    const res = await fetch(`${API}/tasks?upcoming=1`, {
      headers: authHeaders(),
    });
    
    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType?.includes("application/json")) {
      const text = await res.text();
      console.error("Invalid response from getUpcomingTasks:", res.status, text);
      return []; // Return empty array as fallback
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error in getUpcomingTasks:", error);
    return []; // Return empty array as fallback
  }
}

export async function getMissedTasks() {
  try {
    const res = await fetch(`${API}/tasks?missed=1`, {
      headers: authHeaders(),
    });
    
    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType?.includes("application/json")) {
      const text = await res.text();
      console.error("Invalid response from getMissedTasks:", res.status, text);
      return []; // Return empty array as fallback
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error in getMissedTasks:", error);
    return []; // Return empty array as fallback
  }
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
  try {
    const res = await fetch(`${API}/notifications`, {
      headers: authHeaders(),
    });
    
    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType?.includes("application/json")) {
      const text = await res.text();
      console.error("Invalid response from getNotifications:", res.status, text);
      return []; // Return empty array as fallback
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error in getNotifications:", error);
    return []; // Return empty array as fallback
  }
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
  try {
    const res = await fetch(`${API}/users/me`, {
      headers: authHeaders(),
    });
    
    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType?.includes("application/json")) {
      const text = await res.text();
      console.error("Invalid response from getUserProfile:", res.status, text);
      // Return a default profile object as fallback
      return { 
        name: "User", 
        email: "", 
        _id: null,
        error: true,
        errorMessage: `Server error: ${res.status}` 
      };
    }
    
    const data = await res.json();
    console.log("getUserProfile response:", data); // Debug log
    
    // Ensure the profile has required fields
    return {
      name: data.name || "User",
      email: data.email || "",
      _id: data._id || null,
      ...data,
      error: false
    };
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    // Return a default profile object as fallback
    return { 
      name: "User", 
      email: "", 
      _id: null,
      error: true,
      errorMessage: error.message 
    };
  }
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
  const res = await fetch(`https://actify.onrender.com/api/users/search?q=${encodeURIComponent(query)}`, {
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
  const res = await fetch(`${API}/users/follow/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });

  const text = await res.text(); // read as text
  try {
    const data = JSON.parse(text);
    if (!res.ok) throw new Error(data.msg || "Follow failed");
    return data;
  } catch (e) {
    console.error("Bad JSON or HTML response:", text);
    throw new Error("Server returned invalid response.");
  }
}

export async function getFriends() {
  const response = await fetch(`${API}/users/friends`, {
    method: 'GET',
    headers: authHeaders(),
  });
  const contentType = response.headers.get("content-type");
  if (!response.ok || !contentType?.includes("application/json")) {
    const text = await response.text();
    console.error("Invalid response from getFriends:", response.status, text);
    throw new Error("Invalid response from server");
  }
  return response.json();
}

export async function sendOTP(email) {
  const res = await fetch(`${API}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function verifyOTP(email, otp) {
  const res = await fetch(`${API}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return res.json();
}

export async function createAccount(name, email, password) {
  const res = await fetch(`${API}/auth/create-account`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}
