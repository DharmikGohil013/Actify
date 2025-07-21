import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoaderOverlay from "../components/Loader";
import {
  getUserProfile,
  getTodayTasks,
  getUpcomingTasks,
  getFriends,
} from "../utils/api";

// --- Avatar Helper (aligned with Sidebar.jsx) ---
function getInitials(name) {
  if (!name) return "";
  return name.split(" ").map(word => word[0]).join("").slice(0, 2).toUpperCase();
}

// --- Apple Watch Style Progress Circle ---
function ProgressCircle({ percent, size = 120, stroke = 8, color = "#007AFF" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  
  return (
    <div style={{ 
      position: 'relative', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      filter: 'drop-shadow(0 8px 32px rgba(0, 122, 255, 0.3))'
    }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Ring */}
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={r} 
          fill="none" 
          stroke="rgba(255, 255, 255, 0.1)" 
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - dash}
          style={{ 
            transition: "stroke-dashoffset 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)",
            filter: 'drop-shadow(0 0 12px rgba(0, 122, 255, 0.6))'
          }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#007AFF" />
            <stop offset="50%" stopColor="#34C759" />
            <stop offset="100%" stopColor="#FF3B30" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position: 'absolute',
        textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        fontWeight: '700',
        fontSize: '28px',
        color: '#1D1D1F',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        {percent}%
      </div>
    </div>
  );
}

// --- Apple-Style Task Stats with Premium Icons ---
const typeIcons = { 
  Work: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2 6.89 2 8V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4Z" fill="url(#workGradient)"/>
      <defs>
        <linearGradient id="workGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#007AFF" />
          <stop offset="100%" stopColor="#5856D6" />
        </linearGradient>
      </defs>
    </svg>
  ), 
  Personal: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="url(#personalGradient)"/>
      <defs>
        <linearGradient id="personalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34C759" />
          <stop offset="100%" stopColor="#30D158" />
        </linearGradient>
      </defs>
    </svg>
  ), 
  Learning: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 17.5L6.5 12H10V7H14V12H17.5L12 17.5Z" fill="url(#learningGradient)"/>
      <defs>
        <linearGradient id="learningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9500" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
    </svg>
  ), 
  Other: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="url(#otherGradient)"/>
      <defs>
        <linearGradient id="otherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#AF52DE" />
          <stop offset="100%" stopColor="#FF2D92" />
        </linearGradient>
      </defs>
    </svg>
  ) 
};

function TaskStats({ tasks }) {
  const types = ["Work", "Personal", "Learning", "Other"];
  const total = tasks.length || 1;
  
  return (
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: "16px", 
      margin: "24px 0" 
    }}>
      {types.map((type) => {
        const count = tasks.filter((t) => t.type === type).length;
        const percentage = Math.round((count / total) * 100);
        
        return (
          <div key={type}
            style={{
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              padding: "20px 16px",
              textAlign: "center",
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 48px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
            }}
          >
            <div style={{ 
              marginBottom: "12px",
              display: "flex",
              justifyContent: "center"
            }}>
              {typeIcons[type]}
            </div>
            <div style={{ 
              fontSize: "32px", 
              fontWeight: "700", 
              color: "#1D1D1F",
              marginBottom: "4px"
            }}>
              {count}
            </div>
            <div style={{ 
              fontSize: "13px", 
              color: "#86868B",
              fontWeight: "500",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              {type}
            </div>
            <div style={{ 
              fontSize: "11px", 
              color: "#86868B",
              marginTop: "4px",
              fontWeight: "400"
            }}>
              {percentage}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- Motivational Quotes ---
const quotes = [
  "Success is the sum of small efforts, repeated.",
  "Each day is a new opportunity to improve.",
  "Stay focused, stay positive, keep moving.",
  "Small progress is still progress!",
  "You got this. Today is your day.",
];

// --- Main Component ---
export default function Profile() {
  const { user, logoutUser } = useContext(AuthContext); // Use logoutUser from AuthContext
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Sequential loading to prevent rate limiting
        console.log("🔄 Starting profile data fetch...");
        
        // 1. Load user profile first
        const userProfile = await getUserProfile();
        let profileData = userProfile.data || userProfile;
        console.log("Raw getUserProfile response:", profileData); // Debug log
        
        // Data validation and correction
        // Check if name and email fields might be swapped in the backend response
        if (profileData.name && profileData.email) {
          // If name contains @ symbol, it's probably the email
          if (profileData.name.includes('@') && !profileData.email.includes('@')) {
            console.warn("Detected swapped name/email fields, correcting...");
            const temp = profileData.name;
            profileData.name = profileData.email;
            profileData.email = temp;
          }
        }
        
        // Ensure we have proper fallbacks
        profileData = {
          name: profileData.name || "User",
          email: profileData.email || "No email",
          _id: profileData._id || null,
          ...profileData
        };
        
        console.log("Corrected profile data:", profileData); // Debug log
        setProfile(profileData);

        // 2. Load tasks with small delays to prevent rate limiting
        console.log("📅 Loading today's tasks...");
        const todayTasksData = await getTodayTasks();
        setTodayTasks(todayTasksData);
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 200));
        
        console.log("⏰ Loading upcoming tasks...");
        const upcomingTasksData = await getUpcomingTasks();
        setUpcomingTasks(upcomingTasksData);
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // 3. Load friends last
        console.log("👥 Loading friends...");
        const friends = await getFriends();
        const validFriends = Array.isArray(friends) ? friends.filter(f => f._id && f.name) : [];
        console.log("Fetched friends:", validFriends); // Debug log
        setFollowers(validFriends);
        
        console.log("✅ Profile data loading complete!");
      } catch (error) {
        console.error("❌ Error fetching profile data:", error);
        setError(error.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }
    
    // Add a small delay before starting to prevent immediate repeated calls
    const timeoutId = setTimeout(fetchData, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const handleLogout = () => {
    logoutUser(); // Use AuthContext's logoutUser
    navigate("/login"); // Redirect to login page
  };

  if (loading) {
    return <LoaderOverlay />;
  }

  if (error || !profile) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#ff4444" }}>
        {error || "Failed to load profile data"}
      </div>
    );
  }

  const completed = todayTasks.filter((t) => t.status === "Complete").length;
  const total = todayTasks.length || 1;
  const productiveToday = completed === todayTasks.length && total > 0;
  const completionRate = Math.round((completed / total) * 100);

  // Use user.name from AuthContext if available, else fall back to profile.name
  // Ensure we're displaying the correct data
  const profileName = profile?.name || user?.name;
  const profileEmail = profile?.email || user?.email;
  
  // Additional validation - make sure name doesn't contain @ symbol
  const displayName = (profileName && !profileName.includes('@')) 
    ? profileName 
    : (profileEmail && profileEmail.includes('@')) 
      ? "User" 
      : profileName || "Unknown User";
      
  const displayEmail = (profileEmail && profileEmail.includes('@')) 
    ? profileEmail 
    : (profileName && profileName.includes('@')) 
      ? profileName 
      : profileEmail || "No email";
      
  const displayInitials = getInitials(displayName);
  
  console.log("Display values:", { displayName, displayEmail, profileName, profileEmail }); // Debug log

  return (
    <div style={{
      minHeight: "100vh",
      padding: "40px 24px",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Blur Elements */}
      <div style={{
        position: "absolute",
        top: "-50%",
        left: "-20%",
        width: "140%",
        height: "200%",
        background: "radial-gradient(circle at 30% 20%, rgba(0, 122, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(52, 199, 89, 0.1) 0%, transparent 50%)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Premium Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "32px",
          right: "32px",
          background: "rgba(255, 59, 48, 0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          color: "#fff",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "50px",
          padding: "12px 24px",
          fontSize: "15px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
          boxShadow: "0 8px 32px rgba(255, 59, 48, 0.3)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 12px 48px rgba(255, 59, 48, 0.4)";
          e.currentTarget.style.background = "rgba(255, 59, 48, 1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(255, 59, 48, 0.3)";
          e.currentTarget.style.background = "rgba(255, 59, 48, 0.9)";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 7L9.5 15L7 12.5" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M16 17L8 17C6.9 17 6 16.1 6 15L6 9C6 7.9 6.9 7 8 7L10 7M16 17L22 12L16 7" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
        Logout
      </button>

      {/* Motivational Quote Banner */}
      <div style={{
        background: "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "24px",
        padding: "32px 40px",
        textAlign: "center",
        marginBottom: "40px",
        boxShadow: "0 16px 64px rgba(0, 0, 0, 0.1)",
        position: "relative",
        zIndex: 1,
        maxWidth: "800px",
        margin: "0 auto 40px auto"
      }}>
        <div style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#1D1D1F",
          lineHeight: "1.4",
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        }}>
          💡 {quote}
        </div>
      </div>

      <div className="profile-layout" style={{
        display: "grid",
        gridTemplateColumns: "400px 1fr",
        gap: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1
      }}>
        {/* Profile Card */}
        <div style={{
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "32px",
          padding: "40px 32px",
          textAlign: "center",
          boxShadow: "0 20px 80px rgba(0, 0, 0, 0.1)",
          position: "relative",
          overflow: "hidden",
          height: "fit-content"
        }}>
          {/* Neumorphic Avatar */}
          <div style={{
            width: "120px", 
            height: "120px", 
            borderRadius: "50%",
            background: "linear-gradient(145deg, #007AFF, #5856D6)",
            color: "#fff",
            fontWeight: "800", 
            fontSize: "48px",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 20px 60px rgba(0, 122, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            position: "relative",
            zIndex: 1
          }}>
            {displayInitials}
            <div style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              width: "20px",
              height: "20px",
              background: "rgba(255, 255, 255, 0.3)",
              borderRadius: "50%",
              filter: "blur(8px)"
            }} />
          </div>

          <div style={{ 
            fontSize: "32px", 
            fontWeight: "700", 
            color: "#1D1D1F",
            marginBottom: "8px",
            letterSpacing: "-0.5px"
          }}>
            {displayName}
          </div>
          
          <div style={{ 
            color: "#86868B", 
            fontWeight: "500", 
            fontSize: "17px", 
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}>
            <span style={{ fontSize: "14px", opacity: 0.7 }}>📧</span>
            {displayEmail}
          </div>

          {/* Status Badge */}
          <div style={{
            background: productiveToday
              ? "linear-gradient(135deg, #34C759, #30D158)"
              : "linear-gradient(135deg, #FF9500, #FF6B35)",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "50px",
            fontWeight: "700",
            fontSize: "15px",
            marginBottom: "32px",
            boxShadow: productiveToday 
              ? "0 8px 32px rgba(52, 199, 89, 0.4)"
              : "0 8px 32px rgba(255, 149, 0, 0.4)",
            display: "inline-block"
          }}>
            {productiveToday ? "🔥 All Tasks Complete!" : "⚡ Keep Going!"}
          </div>

          <ProgressCircle percent={completionRate} />
          
          <div style={{ 
            fontWeight: "600", 
            color: "#1D1D1F", 
            marginTop: "20px",
            fontSize: "17px"
          }}>
            {completed} of {total} Tasks Done
          </div>
        </div>

        {/* Right Side Content */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "24px",
          minWidth: 0  // Prevents flex overflow
        }}>
          {/* Task Stats */}
          <div style={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 16px 64px rgba(0, 0, 0, 0.08)"
          }}>
            <div style={{ 
              fontSize: "22px", 
              fontWeight: "700", 
              color: "#1D1D1F", 
              marginBottom: "8px",
              letterSpacing: "-0.3px"
            }}>
              Task Overview
            </div>
            <div style={{
              fontSize: "15px",
              color: "#86868B",
              marginBottom: "16px",
              fontWeight: "500"
            }}>
              Today's activity breakdown
            </div>
            <TaskStats tasks={todayTasks} />
          </div>

          {/* Upcoming Tasks */}
          <div style={{
            background: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 16px 64px rgba(0, 0, 0, 0.08)"
          }}>
            <div style={{ 
              fontSize: "22px", 
              fontWeight: "700", 
              color: "#1D1D1F", 
              marginBottom: "8px",
              letterSpacing: "-0.3px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#007AFF" strokeWidth="2"/>
                <polyline points="12,6 12,12 16,14" stroke="#007AFF" strokeWidth="2"/>
              </svg>
              Upcoming Tasks
            </div>
            <div style={{
              fontSize: "15px",
              color: "#86868B",
              marginBottom: "20px",
              fontWeight: "500"
            }}>
              Your scheduled activities
            </div>
            
            {upcomingTasks.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {upcomingTasks.slice(0, 4).map((task, index) => (
                  <div key={task._id} style={{
                    background: "rgba(255, 255, 255, 0.5)",
                    borderRadius: "16px",
                    padding: "16px 20px",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(4px)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.5)";
                  }}
                  >
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      <div style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1D1D1F",
                        marginBottom: "4px"
                      }}>
                        {task.name}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#86868B",
                        background: "rgba(0, 122, 255, 0.1)",
                        padding: "4px 8px",
                        borderRadius: "8px",
                        fontWeight: "500"
                      }}>
                        {task.status}
                      </div>
                    </div>
                    <div style={{
                      fontSize: "14px",
                      color: "#86868B",
                      fontWeight: "500"
                    }}>
                      {new Date(task.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: "center",
                color: "#86868B", 
                fontWeight: "500",
                fontSize: "16px",
                padding: "32px"
              }}>
                No upcoming tasks scheduled
              </div>
            )}
          </div>

          {/* Friends I Follow */}
          <div style={{
            background: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 16px 64px rgba(0, 0, 0, 0.08)"
          }}>
            <div style={{ 
              fontSize: "22px", 
              fontWeight: "700", 
              color: "#1D1D1F", 
              marginBottom: "8px",
              letterSpacing: "-0.3px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17 21V19C17 17.9 16.1 17 15 17H9C7.9 17 7 17.9 7 19V21" stroke="#007AFF" strokeWidth="2"/>
                <circle cx="12" cy="7" r="4" stroke="#007AFF" strokeWidth="2"/>
                <path d="M23 21V19C23 18.1 22.3 17.4 21.4 17.1" stroke="#007AFF" strokeWidth="2"/>
                <path d="M16 3.1C16.9 3.4 17.6 4.1 17.6 5S16.9 6.6 16 6.9" stroke="#007AFF" strokeWidth="2"/>
              </svg>
              Friends
            </div>
            <div style={{
              fontSize: "15px",
              color: "#86868B",
              marginBottom: "20px",
              fontWeight: "500"
            }}>
              People you're following
            </div>
            
            {followers.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {followers.map((friend) => (
                  <div key={friend._id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    background: "rgba(255, 255, 255, 0.5)",
                    borderRadius: "16px",
                    padding: "16px 20px",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(4px)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.5)";
                  }}
                  >
                    <div style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #007AFF, #5856D6)",
                      color: "#fff",
                      fontWeight: "700",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 24px rgba(0, 122, 255, 0.3)"
                    }}>
                      {getInitials(friend.name)}
                    </div>
                    <div style={{
                      fontSize: "17px",
                      fontWeight: "600",
                      color: "#1D1D1F"
                    }}>
                      {friend.name || "Unnamed Friend"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: "center",
                color: "#86868B", 
                fontWeight: "500",
                fontSize: "16px",
                padding: "32px"
              }}>
                Not following anyone yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}