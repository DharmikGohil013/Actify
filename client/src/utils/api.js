import { throttledApiCall } from './requestThrottler';

const API = "https://actify.onrender.com/api"; // Production backend server

// Backend server URL updated to production

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

// Comprehensive backend route verification
export async function verifyBackendRoutes() {
  console.log('🔍 COMPREHENSIVE BACKEND ROUTE VERIFICATION');
  console.log('='.repeat(50));
  
  const testRoutes = [
    // Working routes (for comparison)
    { path: '/auth/login', method: 'POST', expected: 'Working', body: { email: 'test@test.com', password: 'test' } },
    { path: '/auth/register', method: 'POST', expected: 'Working', body: { name: 'Test', email: 'test@test.com', password: 'test' } },
    
    // Missing OTP routes
    { path: '/auth/send-otp', method: 'POST', expected: 'MISSING', body: { email: 'test@test.com' } },
    { path: '/auth/verify-otp', method: 'POST', expected: 'MISSING', body: { email: 'test@test.com', otp: '123456' } },
    { path: '/auth/create-account', method: 'POST', expected: 'MISSING', body: { name: 'Test', email: 'test@test.com', password: 'test' } },
    
    // Health check
    { path: '/health', method: 'GET', expected: 'Unknown', body: null },
  ];
  
  const results = {};
  
  for (const route of testRoutes) {
    const fullUrl = `${API}${route.path}`;
    console.log(`\n🧪 Testing ${route.method} ${route.path}`);
    console.log(`   Full URL: ${fullUrl}`);
    console.log(`   Expected: ${route.expected}`);
    
    try {
      const options = {
        method: route.method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (route.body) {
        options.body = JSON.stringify(route.body);
      }
      
      const res = await fetch(fullUrl, options);
      const responseText = await res.text();
      
      let responseData = {};
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = { rawText: responseText };
      }
      
      const result = {
        status: res.status,
        statusText: res.statusText,
        response: responseData,
        exists: res.status !== 404,
        working: res.ok,
        url: fullUrl
      };
      
      results[route.path] = result;
      
      // Log result with color coding
      if (res.status === 404) {
        console.log(`   ❌ MISSING (404): ${responseData.msg || responseData.message || 'Not Found'}`);
      } else if (res.ok) {
        console.log(`   ✅ EXISTS & WORKING (${res.status})`);
      } else {
        console.log(`   ⚠️ EXISTS BUT ERROR (${res.status}): ${responseData.msg || responseData.message || res.statusText}`);
      }
      
    } catch (error) {
      console.log(`   💥 NETWORK ERROR: ${error.message}`);
      results[route.path] = {
        status: 'NETWORK_ERROR',
        statusText: error.message,
        exists: false,
        working: false,
        url: fullUrl
      };
    }
  }
  
  // Generate summary report
  console.log('\n� SUMMARY REPORT');
  console.log('='.repeat(50));
  
  const workingRoutes = Object.entries(results).filter(([_, result]) => result.working);
  const existingRoutes = Object.entries(results).filter(([_, result]) => result.exists);
  const missingRoutes = Object.entries(results).filter(([_, result]) => result.status === 404);
  
  console.log(`✅ Working routes: ${workingRoutes.length}`);
  console.log(`🔍 Existing routes: ${existingRoutes.length}`);
  console.log(`❌ Missing routes (404): ${missingRoutes.length}`);
  
  if (workingRoutes.length > 0) {
    console.log('\n✅ WORKING ROUTES:');
    workingRoutes.forEach(([path]) => console.log(`   - ${path}`));
  }
  
  if (missingRoutes.length > 0) {
    console.log('\n❌ MISSING ROUTES (Need to be added to backend):');
    missingRoutes.forEach(([path]) => console.log(`   - ${path}`));
  }
  
  // Backend fix instructions
  if (missingRoutes.some(([path]) => path.includes('otp'))) {
    console.log('\n🔧 BACKEND FIX REQUIRED:');
    console.log('Add these routes to your Express backend:');
    console.log(`
// In your auth routes file (e.g., routes/auth.js):
router.post('/auth/send-otp', async (req, res) => {
  // Your OTP sending logic here
  const { email } = req.body;
  // Send OTP email
  res.json({ success: true, message: 'OTP sent successfully' });
});

router.post('/auth/verify-otp', async (req, res) => {
  // Your OTP verification logic here
  const { email, otp } = req.body;
  // Verify OTP
  res.json({ success: true, message: 'OTP verified successfully' });
});

router.post('/auth/create-account', async (req, res) => {
  // Your account creation logic here
  const { name, email, password } = req.body;
  // Create account after OTP verification
  res.json({ success: true, message: 'Account created successfully' });
});

// Make sure your router is mounted correctly in server.js:
app.use('/api', authRouter);
    `);
  }
  
  return results;
}

// Backward compatibility alias
export const testAuthEndpoints = verifyBackendRoutes;

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
    const data = await throttledApiCall(`${API}/tasks?date=${dateString}`, {
      headers: authHeaders(),
    });
    
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
    const data = await throttledApiCall(`${API}/tasks?upcoming=1`, {
      headers: authHeaders(),
    });
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error in getUpcomingTasks:", error);
    return []; // Return empty array as fallback
  }
}

export async function getMissedTasks() {
  try {
    const data = await throttledApiCall(`${API}/tasks?missed=1`, {
      headers: authHeaders(),
    });
    
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
    const data = await throttledApiCall(`${API}/notifications`, {
      headers: authHeaders(),
    });
    
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
    const data = await throttledApiCall(`${API}/users/me`, {
      headers: authHeaders(),
    });
    
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
  const res = await fetch(`${API}/users/search?q=${encodeURIComponent(query)}`, {
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
  try {
    const data = await throttledApiCall(`${API}/users/friends`, {
      method: 'GET',
      headers: authHeaders(),
    });
    
    return data;
  } catch (error) {
    console.error("Error in getFriends:", error);
    throw new Error("Invalid response from server");
  }
}

export async function sendOTP(email) {
  try {
    console.log('🔄 Attempting to send OTP to:', email);
    
    // Primary endpoint - what we expect to work
    const primaryEndpoint = `${API}/auth/send-otp`;
    
    console.log('📡 Trying primary endpoint:', primaryEndpoint);
    
    const res = await fetch(primaryEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    
    console.log('📊 Response status:', res.status);
    console.log('📊 Response headers:', Object.fromEntries(res.headers.entries()));
    
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Send OTP success:', data);
      return data;
    }
    
    // If we get here, there was an error
    const errorText = await res.text();
    console.error('❌ Send OTP failed:', {
      status: res.status,
      statusText: res.statusText,
      errorText,
      url: primaryEndpoint
    });
    
    // Parse error response if it's JSON
    let errorData = {};
    try {
      errorData = JSON.parse(errorText);
    } catch (e) {
      errorData = { message: errorText };
    }
    
    // For 404, provide a specific error message with backend fix instructions
    if (res.status === 404) {
      const backendFixMessage = `
🚨 BACKEND ISSUE DETECTED:
The OTP endpoint '${primaryEndpoint}' does not exist on your server.

🔧 TO FIX THIS BACKEND ISSUE:
1. Add this route to your Express router:
   router.post('/auth/send-otp', sendOTPController);
   
2. Make sure your auth router is mounted correctly:
   app.use('/api', authRouter);
   
3. Implement the sendOTPController function
4. Redeploy to Render

📋 Current Error: ${errorData.msg || errorData.message || 'Route not found'}
      `;
      
      console.error(backendFixMessage);
      throw new Error(`OTP endpoint not found. ${errorData.msg || 'Backend route missing'} - Please check backend deployment.`);
    }
    
    // For other errors, provide the server response
    throw new Error(`Server error ${res.status}: ${errorData.msg || errorData.message || errorText}`);
    
  } catch (error) {
    console.error('💥 Send OTP critical error:', error);
    
    // If it's a network error, provide helpful context
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Cannot connect to server. Please check your internet connection and server status.');
    }
    
    // Re-throw our custom errors
    throw error;
  }
}

// Temporary workaround - use regular register if OTP is not available
export async function registerWithoutOTP(name, email, password) {
  try {
    console.log('⚠️ Using fallback registration (no OTP) for:', email);
    
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    
    console.log('📊 Fallback register response status:', res.status);
    
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Fallback registration success:', data);
      return { ...data, fallbackUsed: true };
    }
    
    const errorText = await res.text();
    console.error('❌ Fallback registration failed:', errorText);
    
    let errorData = {};
    try {
      errorData = JSON.parse(errorText);
    } catch (e) {
      errorData = { message: errorText };
    }
    
    throw new Error(`Registration failed ${res.status}: ${errorData.msg || errorData.message || errorText}`);
    
  } catch (error) {
    console.error('💥 Fallback registration error:', error);
    throw error;
  }
}

// Fallback function for testing different endpoints
export async function sendOTPFallback(email) {
  console.log('🔄 Running OTP endpoint discovery...');
  
  const testEndpoints = [
    `${API}/auth/send-otp`,     // Expected
    `${API}/auth/sendotp`,      // Alternative 1
    `${API}/auth/send_otp`,     // Alternative 2  
    `${API}/send-otp`,          // Without auth prefix
    `${API}/sendotp`,           // Simple
    `https://actify.onrender.com/auth/send-otp`, // Without /api
    `https://actify.onrender.com/send-otp`,      // Root level
  ];
  
  const results = [];
  
  for (const endpoint of testEndpoints) {
    try {
      console.log(`🧪 Testing: ${endpoint}`);
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const result = {
        endpoint,
        status: res.status,
        statusText: res.statusText,
        working: res.ok
      };
      
      if (res.ok) {
        console.log(`✅ Found working endpoint: ${endpoint}`);
        const data = await res.json();
        return { success: true, data, endpoint };
      } else {
        console.log(`❌ ${endpoint} returned ${res.status}`);
      }
      
      results.push(result);
      
    } catch (error) {
      console.log(`💥 ${endpoint} failed: ${error.message}`);
      results.push({
        endpoint,
        status: 'ERROR',
        statusText: error.message,
        working: false
      });
    }
  }
  
  console.log('📊 All endpoint test results:', results);
  throw new Error('No working OTP endpoint found on server. Backend deployment issue confirmed.');
}

export async function verifyOTP(email, otp) {
  try {
    console.log('🔐 Attempting to verify OTP for:', email);
    const endpoint = `${API}/auth/verify-otp`;
    console.log('📡 Using endpoint:', endpoint);
    
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    
    console.log('📊 Verify OTP response status:', res.status);
    
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Verify OTP success:', data);
      return data;
    }
    
    const errorText = await res.text();
    console.error('❌ Verify OTP failed:', {
      status: res.status,
      statusText: res.statusText,
      errorText,
      url: endpoint
    });
    
    if (res.status === 404) {
      throw new Error(`OTP verification endpoint not found. The backend route '${endpoint}' does not exist.`);
    }
    
    throw new Error(`Verification failed ${res.status}: ${errorText || res.statusText}`);
    
  } catch (error) {
    console.error('💥 Verify OTP error:', error);
    throw error;
  }
}

export async function createAccount(name, email, password) {
  try {
    console.log('👤 Attempting to create account for:', email);
    const endpoint = `${API}/auth/create-account`;
    console.log('📡 Using endpoint:', endpoint);
    
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    
    console.log('📊 Create account response status:', res.status);
    
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Create account success:', data);
      return data;
    }
    
    const errorText = await res.text();
    console.error('❌ Create account failed:', {
      status: res.status,
      statusText: res.statusText,
      errorText,
      url: endpoint
    });
    
    if (res.status === 404) {
      throw new Error(`Account creation endpoint not found. The backend route '${endpoint}' does not exist.`);
    }
    
    throw new Error(`Account creation failed ${res.status}: ${errorText || res.statusText}`);
    
  } catch (error) {
    console.error('💥 Create account error:', error);
    throw error;
  }
}


