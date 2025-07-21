import React, { useEffect, useState } from "react";
import LoaderOverlay from "../components/Loader";
import {
  getTodayTasks,
  getUpcomingTasks,
  getMissedTasks,
  getNotifications,
  getUserProfile,
  checkServerHealth,
} from "../utils/api";
import "./Dashboard.css";

// --- Error Notification Component ---
function ErrorNotification({ errors, onDismiss }) {
  const [serverStatus, setServerStatus] = useState(null);
  const [checkingServer, setCheckingServer] = useState(false);

  if (!errors || Object.keys(errors).length === 0) return null;

  const checkServer = async () => {
    setCheckingServer(true);
    try {
      const status = await checkServerHealth();
      setServerStatus(status);
    } catch (error) {
      setServerStatus({ 
        status: 'error', 
        message: 'Failed to check server status',
        error: error.message 
      });
    } finally {
      setCheckingServer(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#34C759';
      case 'timeout': return '#FF9500';
      case 'offline': 
      case 'error': 
      default: return '#FF3B30';
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 20,
      right: 20,
      zIndex: 1000,
      maxWidth: 400,
      background: "rgba(255, 59, 48, 0.95)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: 16,
      padding: "16px 20px",
      color: "white",
      fontSize: 14,
      fontWeight: 500,
      boxShadow: "0 10px 30px rgba(255, 59, 48, 0.3)",
      animation: "fadeInUp 0.3s ease-out"
    }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: Object.keys(errors).length > 1 ? 8 : 0
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AlertIcon color="white" size={20} />
          <span style={{ fontWeight: 600 }}>
            {Object.keys(errors).length === 1 ? "Connection Issue" : "Multiple Connection Issues"}
          </span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: 18,
              padding: 4,
              borderRadius: 4,
              opacity: 0.8
            }}
            onMouseEnter={(e) => e.target.style.opacity = 1}
            onMouseLeave={(e) => e.target.style.opacity = 0.8}
          >
            ×
          </button>
        )}
      </div>
      
      {Object.values(errors).map((error, index) => (
        <div key={index} style={{ 
          fontSize: 13, 
          opacity: 0.9,
          marginTop: index > 0 ? 4 : 0
        }}>
          • {error}
        </div>
      ))}

      {/* Server status section */}
      <div style={{ 
        marginTop: 12, 
        paddingTop: 12, 
        borderTop: "1px solid rgba(255, 255, 255, 0.2)",
        display: "flex",
        alignItems: "center",
        gap: 8
      }}>
        <button
          onClick={checkServer}
          disabled={checkingServer}
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: 8,
            color: "white",
            padding: "4px 8px",
            fontSize: 12,
            fontWeight: 500,
            cursor: checkingServer ? "not-allowed" : "pointer",
            opacity: checkingServer ? 0.6 : 1,
            transition: "all 0.2s ease"
          }}
        >
          {checkingServer ? "Checking..." : "Check Server"}
        </button>
        
        {serverStatus && (
          <div style={{
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 4
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: getStatusColor(serverStatus.status)
            }} />
            <span style={{ opacity: 0.9 }}>{serverStatus.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Premium Avatar with glassmorphic design ---
function Avatar({ name }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Improved initials logic
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return "U";
    
    // Trim whitespace and split by spaces
    const trimmedName = name.trim();
    if (!trimmedName) return "U";
    
    const nameParts = trimmedName.split(/\s+/); // Split by one or more whitespace characters
    
    if (nameParts.length === 1) {
      // Single name: take first two characters
      return nameParts[0].slice(0, 2).toUpperCase();
    } else {
      // Multiple names: take first character of first two parts
      return nameParts
        .slice(0, 2)
        .map(part => part.charAt(0))
        .join("")
        .toUpperCase();
    }
  };

  const letters = getInitials(name);

  return (
    <div 
      className="premium-avatar"
      style={{
        width: 80,
        height: 80,
        borderRadius: 24,
        background: "linear-gradient(135deg, rgba(0, 122, 255, 0.8) 0%, rgba(52, 199, 89, 0.6) 100%)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        fontWeight: 700,
        color: "#ffffff",
        letterSpacing: "1px",
        boxShadow: isHovered 
          ? "0 20px 40px rgba(0, 122, 255, 0.3), 0 8px 16px rgba(0, 0, 0, 0.1)"
          : "0 12px 30px rgba(0, 122, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.08)",
        transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        transform: isHovered ? "scale(1.05)" : "scale(1)",
        textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
        cursor: "pointer",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        textAlign: "center",
        lineHeight: 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={name || "User"}
    >
      {letters}
    </div>
  );
}

// --- Premium StatCard with glassmorphism ---
function StatCard({ label, value, icon, color, delay = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className="premium-stat-card"
      style={{
        background: "rgba(255, 255, 255, 0.25)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 20,
        padding: "28px 24px",
        textAlign: "center",
        boxShadow: isHovered 
          ? `0 20px 60px ${color}30, 0 8px 25px rgba(0, 0, 0, 0.1)`
          : `0 12px 40px ${color}20, 0 4px 15px rgba(0, 0, 0, 0.08)`,
        transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        opacity: isVisible ? 1 : 0,
        animation: isVisible ? "fadeInUp 0.6s ease-out" : "none",
        minWidth: 200,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
        borderRadius: "20px 20px 0 0"
      }} />
      
      <div style={{ 
        fontSize: 48, 
        fontWeight: 800, 
        marginBottom: 12,
        color: color,
        filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
        letterSpacing: "-0.5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12
      }}>
        <span style={{ 
          display: "flex",
          alignItems: "center",
          filter: `drop-shadow(0 2px 4px ${color}40)`
        }}>
          {icon}
        </span>
        {value}
      </div>
      <div style={{ 
        fontSize: 16, 
        fontWeight: 600, 
        color: "#1d1d1f",
        letterSpacing: "-0.2px",
        opacity: 0.8
      }}>
        {label}
      </div>
    </div>
  );
}

// --- Premium Task Item Component ---
function TaskItem({ task, index }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <li
      style={{ 
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: 16,
        padding: "20px 24px",
        borderLeft: `4px solid ${
          task.priority === "High" ? "#FF3B30" :
          task.priority === "Medium" ? "#FF9500" :
          "#34C759"
        }`,
        boxShadow: isHovered 
          ? "0 12px 40px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05)"
          : "0 6px 20px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)",
        transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        cursor: "pointer",
        animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        fontSize: 17,
        fontWeight: 600,
        color: "#1d1d1f",
        marginBottom: 8,
        letterSpacing: "-0.2px"
      }}>
        {task.name}
      </div>
      <div style={{
        fontSize: 15,
        color: "#8e8e93",
        fontWeight: 500,
        marginBottom: 6
      }}>
        {task.time || "—"} • {task.type}
      </div>
      <div style={{
        fontSize: 13,
        color: "#8e8e93",
        fontWeight: 400
      }}>
        {task.status} • {new Date(task.date).toLocaleDateString()}
      </div>
    </li>
  );
}

// --- Premium Task List with glassmorphic cards ---
function TaskList({ tasks, emptyText, sectionColor = "#007AFF", errorMessage = null }) {
  if (errorMessage) {
    return (
      <div style={{ 
        color: "#FF3B30", 
        padding: "32px 24px", 
        fontWeight: 500,
        textAlign: "center",
        fontSize: 16,
        fontStyle: "italic",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        background: "rgba(255, 59, 48, 0.1)",
        borderRadius: 12,
        border: "1px solid rgba(255, 59, 48, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8
      }}>
        <AlertIcon color="#FF3B30" size={20} />
        {errorMessage}
      </div>
    );
  }

  if (!tasks || tasks.length === 0)
    return (
      <div style={{ 
        color: "#8e8e93", 
        padding: "32px 24px", 
        fontWeight: 500,
        textAlign: "center",
        fontSize: 16,
        fontStyle: "italic",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
      }}>
        {emptyText}
      </div>
    );

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
      {tasks.map((task, index) => (
        <TaskItem key={task._id} task={task} index={index} />
      ))}
    </ul>
  );
}

// --- Premium SVG Icons ---
const SunIcon = ({ color = "#FF9500", size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 2V4M12 20V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const BoltIcon = ({ color = "#007AFF", size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const MoonIcon = ({ color = "#5856D6", size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3C13.0609 3 14.0783 3.21071 15.0092 3.58779C11.4609 5.24063 9 9.02219 9 13.5C9 17.9778 11.4609 21.7594 15.0092 23.4122C14.0783 23.7893 13.0609 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0Z" fill={color} fillOpacity="0.1"/>
    <path d="M21 12.79A9 9 0 1111.21 3A7 7 0 0021 12.79Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TaskIcon = ({ color = "#007AFF", size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 11L12 14L22 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = ({ color = "#34C759", size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5"/>
    <path d="M12 6V12L16 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RefreshIcon = ({ color = "#FF9500", size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 4V10H7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 20V14H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AlertIcon = ({ color = "#FF3B30", size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.55 21H20.45A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 9V13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17H12.01" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BellIcon = ({ color = "#5856D6", size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RocketIcon = ({ color = "#34C759", size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 16.5C4.5 16.5 5.5 15.5 8 13L11 16L12.5 19.5C12.5 19.5 15.5 18.5 19.5 14.5C19.5 14.5 20.5 4.5 14.5 4.5C14.5 4.5 4.5 5.5 4.5 16.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.5 12.5L9 15L9 21L12 18L15 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 11L9 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HourglassIcon = ({ color = "#FF3B30", size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2V6C6 10.4183 9.58172 14 14 14C9.58172 14 6 17.5817 6 22V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 2V6C18 10.4183 14.4183 14 10 14C14.4183 14 18 17.5817 18 22V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 2H18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 22H18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// --- Dynamic greeting with enhanced emotion ---
function getGreeting() {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const timeInMinutes = hour * 60 + minute;

  if (timeInMinutes >= 300 && timeInMinutes < 720) {
    return {
      message: "Rise and shine! Today is a fresh start to chase your dreams!",
      icon: <SunIcon color="#FF9500" size={40} />,
      gradient: "linear-gradient(135deg, #FF9500 0%, #FFCC02 100%)"
    };
  } else if (timeInMinutes >= 721 && timeInMinutes < 780) {
    return {
      message: "Keep pushing forward! Your afternoon is full of possibilities!",
      icon: <BoltIcon color="#007AFF" size={40} />,
      gradient: "linear-gradient(135deg, #007AFF 0%, #5856D6 100%)"
    };
  } else {
    return {
      message: "Rest well! Tomorrow brings new opportunities to succeed!",
      icon: <MoonIcon color="#5856D6" size={40} />,
      gradient: "linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)"
    };
  }
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [missed, setMissed] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setErrors({}); // Reset errors
      
      try {
        console.log("🔄 Starting dashboard data fetch...");
        
        // Sequential loading to prevent rate limiting
        console.log("📅 Loading today's tasks...");
        const todayTasksData = await getTodayTasks();
        setTodayTasks(Array.isArray(todayTasksData) ? todayTasksData : []);
        
        await new Promise(resolve => setTimeout(resolve, 150));
        
        console.log("⏰ Loading upcoming tasks...");
        const upcomingTasksData = await getUpcomingTasks();
        setUpcoming(Array.isArray(upcomingTasksData) ? upcomingTasksData : []);
        
        await new Promise(resolve => setTimeout(resolve, 150));
        
        console.log("❌ Loading missed tasks...");
        const missedTasksData = await getMissedTasks();
        setMissed(Array.isArray(missedTasksData) ? missedTasksData : []);
        
        await new Promise(resolve => setTimeout(resolve, 150));
        
        console.log("🔔 Loading notifications...");
        const notificationsData = await getNotifications();
        setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
        
        await new Promise(resolve => setTimeout(resolve, 150));
        
        console.log("👤 Loading user profile...");
        const profileData = await getUserProfile();
        setProfile(profileData || { name: "User", email: "", _id: null, error: true });
        
        console.log("✅ Dashboard data loading complete!");
      } catch (error) {
        console.error("❌ Dashboard fetch error:", error);
        // Set fallback data
        setTodayTasks([]);
        setUpcoming([]);
        setMissed([]);
        setNotifications([]);
        setProfile({ name: "User", email: "", _id: null, error: true });
      } finally {
        setLoading(false);
      }
    }

    // Add delay to prevent immediate repeated calls
    const timeoutId = setTimeout(fetchData, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const incomplete = todayTasks.filter((t) => t.status === "Incomplete");
  const greeting = getGreeting();

  // Function to retry fetching data
  const retryFetch = async () => {
    setLoading(true);
    setErrors({});
    
    try {
      console.log("🔄 Retrying dashboard data fetch...");
      
      // Sequential loading to prevent rate limiting (same as useEffect)
      console.log("📅 Loading today's tasks...");
      const todayTasksData = await getTodayTasks();
      setTodayTasks(Array.isArray(todayTasksData) ? todayTasksData : []);
      
      await new Promise(resolve => setTimeout(resolve, 150));
      
      console.log("⏰ Loading upcoming tasks...");
      const upcomingTasksData = await getUpcomingTasks();
      setUpcoming(Array.isArray(upcomingTasksData) ? upcomingTasksData : []);
      
      await new Promise(resolve => setTimeout(resolve, 150));
      
      console.log("❌ Loading missed tasks...");
      const missedTasksData = await getMissedTasks();
      setMissed(Array.isArray(missedTasksData) ? missedTasksData : []);
      
      await new Promise(resolve => setTimeout(resolve, 150));
      
      console.log("🔔 Loading notifications...");
      const notificationsData = await getNotifications();
      setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
      
      await new Promise(resolve => setTimeout(resolve, 150));
      
      console.log("👤 Loading user profile...");
      const profileData = await getUserProfile();
      setProfile(profileData || { name: "User", email: "", _id: null, error: true });
      
      console.log("✅ Dashboard retry complete!");
    } catch (error) {
      console.error("❌ Dashboard retry fetch error:", error);
      setErrors({ general: 'Failed to reload data. Please try again.' });
      // Set fallback data
      setTodayTasks([]);
      setUpcoming([]);
      setMissed([]);
      setNotifications([]);
      setProfile({ name: "User", email: "", _id: null, error: true });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoaderOverlay />;

  return (
    <>
      {/* Error Notification */}
      <ErrorNotification 
        errors={errors} 
        onDismiss={() => setErrors({})} 
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseEmoji {
          0%, 100% { 
            transform: scale(1);
          }
          50% { 
            transform: scale(1.1);
          }
        }

        @keyframes floatAnimation {
          0%, 100% { 
            transform: translateY(0px);
          }
          50% { 
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% { 
            background-position: -200% 0;
          }
          100% { 
            background-position: 200% 0;
          }
        }

        .greeting-emoji {
          animation: pulseEmoji 2s ease-in-out infinite;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .floating-card {
          animation: floatAnimation 6s ease-in-out infinite;
        }

        .premium-notification {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .premium-notification:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
          
          .tasks-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>

      <div 
        style={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 50%, #667eea 100%)",
          minHeight: "100vh",
          padding: "40px 24px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Background Elements */}
        <div style={{
          position: "absolute",
          top: "5%",
          right: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(0, 122, 255, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          zIndex: 0
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: "350px",
          height: "350px",
          background: "radial-gradient(circle, rgba(52, 199, 89, 0.06) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          zIndex: 0
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1400px", margin: "0 auto" }}>
          {/* Hero Greeting Banner */}
          <div 
            className="floating-card"
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(60px)",
              WebkitBackdropFilter: "blur(60px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: 28,
              padding: "40px 48px",
              marginBottom: 48,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 30px rgba(0, 0, 0, 0.05)",
              display: "flex",
              alignItems: "center",
              gap: 24,
              animation: "fadeInUp 0.8s ease-out",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Gradient overlay */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: greeting.gradient,
              borderRadius: "28px 28px 0 0"
            }} />
            
            <Avatar name={profile?.name} />
            
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 36,
                fontWeight: 700,
                color: "#1d1d1f",
                letterSpacing: "-0.5px",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 16
              }}>
                <span className="greeting-emoji" style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))" 
                }}>
                  {greeting.icon}
                </span>
                {greeting.message.split(',')[0]}{profile?.name ? `, ${profile.name}` : "!"}
              </div>
              <div style={{
                background: greeting.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: "-0.3px",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                marginBottom: Object.keys(errors).length > 0 ? 16 : 0
              }}>
                Achieve something extraordinary today ✨
              </div>
              
              {/* Retry button when there are errors */}
              {Object.keys(errors).length > 0 && (
                <button
                  onClick={retryFetch}
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg, #FF9500 0%, #FF6B6B 100%)",
                    border: "none",
                    borderRadius: 12,
                    color: "white",
                    padding: "8px 16px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 4px 12px rgba(255, 149, 0, 0.3)"
                  }}
                  onMouseEnter={(e) => !loading && (e.target.style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => !loading && (e.target.style.transform = "translateY(0)")}
                >
                  <RefreshIcon color="white" size={16} />
                  {loading ? "Retrying..." : "Retry Loading"}
                </button>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div 
            className="stats-grid"
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(4, 1fr)", 
              gap: 24, 
              marginBottom: 48 
            }}
          >
            <StatCard 
              label="Today's Tasks" 
              value={todayTasks.length} 
              color="#007AFF" 
              icon={<TaskIcon color="#007AFF" size={32} />}
              delay={200}
            />
            <StatCard 
              label="Upcoming" 
              value={upcoming.length} 
              color="#34C759" 
              icon={<ClockIcon color="#34C759" size={32} />}
              delay={300}
            />
            <StatCard 
              label="Incomplete" 
              value={incomplete.length} 
              color="#FF9500" 
              icon={<RefreshIcon color="#FF9500" size={32} />}
              delay={400}
            />
            <StatCard 
              label="Missed" 
              value={missed.length} 
              color="#FF3B30" 
              icon={<AlertIcon color="#FF3B30" size={32} />}
              delay={500}
            />
          </div>

          {/* Task Sections Grid */}
          <div 
            className="tasks-grid"
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(2, 1fr)", 
              gap: 32, 
              marginBottom: 48 
            }}
          >
            {/* Today's Tasks */}
            <section style={{
              background: "rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 24,
              padding: "32px",
              boxShadow: "0 16px 50px rgba(0, 0, 0, 0.08)",
              animation: "fadeInUp 0.6s ease-out 0.6s both"
            }}>
              <div style={{ 
                fontSize: 24, 
                fontWeight: 700, 
                color: "#1d1d1f", 
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 12,
                letterSpacing: "-0.3px"
              }}>
                <span style={{ 
                  display: "flex", 
                  alignItems: "center",
                  filter: "drop-shadow(0 2px 4px rgba(0, 122, 255, 0.3))" 
                }}>
                  <SunIcon color="#007AFF" size={28} />
                </span>
                Today's Tasks
              </div>
              <TaskList 
                tasks={todayTasks} 
                emptyText="No tasks for today." 
                sectionColor="#007AFF"
                errorMessage={errors.todayTasks}
              />
            </section>

            {/* Next Task */}
            <section style={{
              background: "rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 24,
              padding: "32px",
              boxShadow: "0 16px 50px rgba(0, 0, 0, 0.08)",
              animation: "fadeInUp 0.6s ease-out 0.7s both"
            }}>
              <div style={{ 
                fontSize: 24, 
                fontWeight: 700, 
                color: "#1d1d1f", 
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 12,
                letterSpacing: "-0.3px"
              }}>
                <span style={{ 
                  display: "flex", 
                  alignItems: "center",
                  filter: "drop-shadow(0 2px 4px rgba(52, 199, 89, 0.3))" 
                }}>
                  <RocketIcon color="#34C759" size={28} />
                </span>
                Next Task
              </div>
              <TaskList 
                tasks={upcoming.slice(0, 1)} 
                emptyText="No upcoming task." 
                sectionColor="#34C759"
                errorMessage={errors.upcoming}
              />
            </section>

            {/* Incomplete Tasks */}
            <section style={{
              background: "rgba(255, 249, 235, 0.8)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(255, 149, 0, 0.2)",
              borderRadius: 24,
              padding: "32px",
              boxShadow: "0 16px 50px rgba(255, 149, 0, 0.1)",
              animation: "fadeInUp 0.6s ease-out 0.8s both"
            }}>
              <div style={{ 
                fontSize: 24, 
                fontWeight: 700, 
                color: "#FF9500", 
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 12,
                letterSpacing: "-0.3px"
              }}>
                <span style={{ 
                  display: "flex", 
                  alignItems: "center",
                  filter: "drop-shadow(0 2px 4px rgba(255, 149, 0, 0.3))" 
                }}>
                  <RefreshIcon color="#FF9500" size={28} />
                </span>
                Incomplete Tasks
              </div>
              <TaskList 
                tasks={incomplete} 
                emptyText="All done for today!" 
                sectionColor="#FF9500"
                errorMessage={errors.todayTasks} // Use same error as today's tasks since incomplete is derived from it
              />
            </section>

            {/* Missed Tasks */}
            <section style={{
              background: "rgba(255, 245, 247, 0.8)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(255, 59, 48, 0.2)",
              borderRadius: 24,
              padding: "32px",
              boxShadow: "0 16px 50px rgba(255, 59, 48, 0.1)",
              animation: "fadeInUp 0.6s ease-out 0.9s both"
            }}>
              <div style={{ 
                fontSize: 24, 
                fontWeight: 700, 
                color: "#FF3B30", 
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 12,
                letterSpacing: "-0.3px"
              }}>
                <span style={{ 
                  display: "flex", 
                  alignItems: "center",
                  filter: "drop-shadow(0 2px 4px rgba(255, 59, 48, 0.3))" 
                }}>
                  <HourglassIcon color="#FF3B30" size={28} />
                </span>
                Missed Tasks
              </div>
              <TaskList 
                tasks={missed} 
                emptyText="No missed tasks!" 
                sectionColor="#FF3B30"
                errorMessage={errors.missed}
              />
            </section>
          </div>

          {/* Notifications */}
          <section style={{
            background: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 24,
            padding: "32px",
            boxShadow: "0 16px 50px rgba(0, 0, 0, 0.08)",
            animation: "fadeInUp 0.6s ease-out 1s both"
          }}>
            <div style={{ 
              fontSize: 22, 
              fontWeight: 700, 
              color: "#1d1d1f", 
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 12,
              letterSpacing: "-0.3px"
            }}>
              <span style={{ 
                display: "flex", 
                alignItems: "center",
                filter: "drop-shadow(0 2px 4px rgba(88, 86, 214, 0.3))" 
              }}>
                <BellIcon color="#5856D6" size={26} />
              </span>
              Notifications
            </div>
            {errors.notifications ? (
              <div style={{ 
                color: "#FF3B30", 
                margin: 0, 
                fontWeight: 500,
                textAlign: "center",
                padding: "24px",
                fontSize: 16,
                fontStyle: "italic",
                background: "rgba(255, 59, 48, 0.1)",
                borderRadius: 12,
                border: "1px solid rgba(255, 59, 48, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8
              }}>
                <AlertIcon color="#FF3B30" size={20} />
                {errors.notifications}
              </div>
            ) : notifications.length === 0 ? (
              <p style={{ 
                color: "#8e8e93", 
                margin: 0, 
                fontWeight: 500,
                textAlign: "center",
                padding: "24px",
                fontSize: 16,
                fontStyle: "italic"
              }}>
                No new notifications.
              </p>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {notifications.map((notif, index) => (
                  <li 
                    key={notif._id} 
                    className="premium-notification"
                    style={{
                      padding: "20px 24px",
                      animation: `fadeInUp 0.4s ease-out ${index * 0.1 + 1.1}s both`
                    }}
                  >
                    <div style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#1d1d1f",
                      marginBottom: 8
                    }}>
                      <b>{notif.type}</b>: {notif.message}
                    </div>
                    <div style={{
                      fontSize: 14,
                      color: "#8e8e93",
                      fontWeight: 500
                    }}>
                      {new Date(notif.date).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
