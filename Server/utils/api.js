// utils/api.js
import axios from "axios";

export async function searchUsers(query) {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`/api/users/search?q=${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.users; // assuming backend sends { users: [...] }
  } catch (err) {
    console.error("searchUsers error:", err.response?.data || err.message);
    return [];
  }
}

export async function followUser(userId) {
  const token = localStorage.getItem("token");
  await axios.post(`/api/users/follow/${userId}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
