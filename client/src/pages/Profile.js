// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { getUserProfile, getTodayTasks, getUpcomingTasks } from "../utils/api";

// --- Animated Progress Ring ---
function ProgressCircle({ percent, size = 94, stroke = 11, color = "#43e97b" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#e5ecfb"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={circ - dash}
        style={{ transition: "stroke-dashoffset 1s" }}
      />
      <text
        x="50%"
        y="56%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={25}
        fontWeight={900}
        fill="#1976d2"
      >
        {percent}%
      </text>
    </svg>
  );
}

// --- Task type stats ---
const typeIcons = { Work: "💼", Personal: "🏠", Learning: "📚", Other: "⭐" };
function TaskStats({ tasks }) {
  const types = ["Work", "Personal", "Learning", "Other"];
  const countByType = types.map((type) => tasks.filter((t) => t.type === type).length);
  const total = tasks.length || 1;
  return (
    <div style={{ display: "flex", gap: 20, margin: "18px 0" }}>
      {types.map((type, idx) => (
        <div key={type}
          style={{
            background: "linear-gradient(110deg,#fafdff 60%,#e7f4fa 110%)",
            padding: "18px 0 10px 0",
            borderRadius: 13,
            flex: 1,
            textAlign: "center",
            fontWeight: 700,
            boxShadow: "0 2px 10px #1976d216"
          }}>
          <div style={{ fontSize: 23, marginBottom: 6 }}>{typeIcons[type]}</div>
          <div style={{ fontSize: 22, color: "#43e97b" }}>{countByType[idx]}</div>
          <div style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>
            {Math.round((countByType[idx] / total) * 100)}%
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Random motivational quotes ---
const quotes = [
  "Success is the sum of small efforts, repeated.",
  "Each day is a new opportunity to improve.",
  "Stay focused, stay positive, keep moving.",
  "Small progress is still progress!",
  "You got this. Today is your day."
];

// --- Snake Game: extract randomFood for clean ESLint ---
const CELL = 17, SIZE = 12;
function randomFood(snake) {
  let f;
  do {
    f = [
      Math.floor(Math.random() * SIZE),
      Math.floor(Math.random() * SIZE),
    ];
  } while (snake.some((c) => c[0] === f[0] && c[1] === f[1]));
  return f;
}
function SnakeGame() {
  const [snake, setSnake] = useState([[5, 5]]);
  const [dir, setDir] = useState([0, 1]);
  const [food, setFood] = useState([2, 2]);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowUp" || e.key === "w") setDir([-1, 0]);
      if (e.key === "ArrowDown" || e.key === "s") setDir([1, 0]);
      if (e.key === "ArrowLeft" || e.key === "a") setDir([0, -1]);
      if (e.key === "ArrowRight" || e.key === "d") setDir([0, 1]);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!running) return;
    const int = setInterval(() => {
      setSnake((snake) => {
        const head = [snake[0][0] + dir[0], snake[0][1] + dir[1]];
        if (
          head[0] < 0 ||
          head[0] >= SIZE ||
          head[1] < 0 ||
          head[1] >= SIZE ||
          snake.some((c) => c[0] === head[0] && c[1] === head[1])
        ) {
          setRunning(false);
          return [[5, 5]];
        }
        let newSnake = [head, ...snake];
        if (head[0] === food[0] && head[1] === food[1]) {
          setScore((s) => s + 1);
          setFood(randomFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 110);
    return () => clearInterval(int);
  }, [dir, running, food]);

  return (
    <div style={{
      margin: "18px auto 0 auto", background: "rgba(255,255,255,0.98)", borderRadius: 18,
      padding: 18, boxShadow: "0 2px 14px #43e97b18", width: 215, minHeight: 275, textAlign: "center"
    }}>
      <div style={{ fontWeight: 800, color: "#1976d2", fontSize: 19, marginBottom: 8 }}>
        <span role="img" aria-label="snake">🐍</span> Play Snake!
      </div>
      <div style={{
        display: "inline-block",
        background: "#fafdff",
        border: "2px solid #43e97b55",
        borderRadius: 12,
        padding: 6,
        marginBottom: 7,
      }}>
        <div style={{ display: "grid", gridTemplate: `repeat(${SIZE},${CELL}px)/repeat(${SIZE},${CELL}px)`, gap: 1 }}>
          {[...Array(SIZE * SIZE)].map((_, i) => {
            const y = Math.floor(i / SIZE), x = i % SIZE;
            const isHead = snake[0][0] === y && snake[0][1] === x;
            const isBody = snake.slice(1).some(c => c[0] === y && c[1] === x);
            const isFood = food[0] === y && food[1] === x;
            let bg = "#fff";
            if (isHead) bg = "linear-gradient(135deg,#1976d2 60%,#43e97b 100%)";
            else if (isBody) bg = "#b2ebf2";
            else if (isFood) bg = "radial-gradient(circle,#fff500 60%,#ff1744 120%)";
            return (
              <div key={i} style={{
                width: CELL, height: CELL, borderRadius: 3,
                background: bg, boxShadow: isHead ? "0 0 2px #1976d2" : undefined
              }} />
            );
          })}
        </div>
      </div>
      <div style={{ fontWeight: 700, color: "#1976d2", marginBottom: 7 }}>Score: {score}</div>
      <button
        onClick={() => {
          setSnake([[5, 5]]);
          setDir([0, 1]);
          setFood([2, 2]);
          setScore(0);
          setRunning(true);
        }}
        style={{
          padding: "8px 20px",
          background: "linear-gradient(90deg,#43e97b 40%,#1976d2 100%)",
          border: "none",
          borderRadius: 8,
          fontWeight: 700,
          color: "#fff",
          fontSize: 16,
          cursor: "pointer",
          marginTop: 7
        }}
      >
        {running ? "Restart" : "Start"}
      </button>
      <div style={{ fontSize: 12, marginTop: 4, color: "#888" }}>WASD or Arrow keys</div>
    </div>
  );
}

// --- Leaderboard (demo) ---
const leaderboardDemo = [
  { name: "Dharmik", score: 10 },
  { name: "Priyansh", score: 9 },
  { name: "Riya", score: 6 },
];

// --- Main Profile Page ---
export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [quote, setQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    async function fetchData() {
      setProfile(await getUserProfile());
      setTodayTasks(await getTodayTasks());
      setUpcomingTasks(await getUpcomingTasks());
    }
    fetchData();
  }, []);

  if (!profile)
    return (
      <div style={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#1976d2",
        fontWeight: 800
      }}>
        Loading profile...
      </div>
    );

  // Productivity calculations
  const completed = todayTasks.filter((t) => t.status === "Complete").length;
  const total = todayTasks.length || 1;
  const completionRate = Math.round((completed / total) * 100);
  const productiveToday = completed === todayTasks.length && todayTasks.length > 0;

  return (
    <div style={{
      minHeight: "97vh",
      padding: "46px 8px 28px 8px",
      background: "linear-gradient(105deg,#fafdff 80%,#d7f4fe 120%)",
      display: "flex",
      flexWrap: "wrap",
      gap: 40,
      justifyContent: "center",
      alignItems: "flex-start"
    }}>
      {/* Profile Card */}
      <div style={{
        maxWidth: 400,
        width: "100%",
        background: "rgba(255,255,255,0.99)",
        borderRadius: 28,
        boxShadow: "0 6px 36px #b8e5ff44",
        padding: "36px 32px 22px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <img
          src={
            profile.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || "User")}&background=222e3a&color=fff`
          }
          alt="avatar"
          width={88}
          height={88}
          style={{
            borderRadius: "50%",
            border: "3px solid #1976d2",
            background: "#fff",
            marginBottom: 15
          }}
        />
        <div style={{
          fontWeight: 900,
          fontSize: 31,
          color: "#1976d2",
          textAlign: "center",
          marginBottom: 6,
          letterSpacing: 1.1
        }}>
          {profile.name}
        </div>
        <div style={{ color: "#555", fontWeight: 600, fontSize: 16, marginBottom: 13 }}>{profile.email}</div>
        <div style={{
          background: productiveToday
            ? "linear-gradient(90deg,#43e97b,#1976d2)"
            : "linear-gradient(90deg,#f1c40f,#f0f4fa)",
          color: productiveToday ? "#fff" : "#888",
          padding: "7px 24px",
          borderRadius: 999,
          fontWeight: 900,
          fontSize: 16,
          marginBottom: 16,
          boxShadow: productiveToday ? "0 2px 16px #43e97b40" : undefined,
          letterSpacing: 0.7
        }}>
          {productiveToday ? "🔥 Streak: All Tasks Done Today!" : "⚡ Productivity: Keep Going!"}
        </div>
        <div style={{ margin: "16px 0 10px 0" }}>
          <ProgressCircle percent={completionRate} />
        </div>
        <div style={{ fontWeight: 800, color: "#1976d2" }}>
          Productivity Today: <span style={{ color: "#43e97b" }}>{completed}</span> / {todayTasks.length} done
        </div>
      </div>

      {/* Right column: stats, quote, game, leaderboard */}
      <div style={{ flex: 1, minWidth: 320, maxWidth: 620 }}>
        {/* Motivational quote */}
        <div style={{
          background: "linear-gradient(93deg,#dbeafe,#e6fffa 80%)",
          borderRadius: 17,
          boxShadow: "0 4px 17px #1976d213",
          padding: "28px 24px",
          marginBottom: 20,
          fontSize: 19,
          color: "#1976d2",
          fontWeight: 800,
          textAlign: "center",
        }}>
          <span role="img" aria-label="motivation">💡</span> {quote}
        </div>
        {/* Task stats */}
        <div style={{
          background: "rgba(255,255,255,0.98)",
          borderRadius: 19,
          boxShadow: "0 4px 22px #1976d210",
          padding: "32px 24px 19px 24px",
          marginBottom: 22
        }}>
          <div style={{ fontSize: 21, fontWeight: 800, color: "#1976d2", marginBottom: 10 }}>
            Task Types (Today)
          </div>
          <TaskStats tasks={todayTasks} />
        </div>

        {/* Upcoming tasks */}
        <div style={{
          background: "linear-gradient(93deg,#fffde7 60%,#e3fceb 140%)",
          borderRadius: 19,
          boxShadow: "0 4px 16px #fffde744",
          padding: "29px 24px 15px 24px",
          marginBottom: 22
        }}>
          <div style={{ fontWeight: 800, color: "#43e97b", fontSize: 19, marginBottom: 10 }}>
            <span role="img" aria-label="future">⏳</span> Upcoming Tasks
          </div>
          <ul style={{ listStyle: "none", padding: 0, color: "#2d72d9", fontWeight: 600, fontSize: 16 }}>
            {upcomingTasks.slice(0, 4).map((task) => (
              <li key={task._id} style={{ marginBottom: 9 }}>
                <span role="img" aria-label="task">📝</span>{" "}
                {task.name} – {new Date(task.date).toLocaleDateString()}
                <span style={{
                  fontSize: 14, color: "#888", fontWeight: 700, marginLeft: 12
                }}>({task.status})</span>
              </li>
            ))}
            {upcomingTasks.length === 0 && (
              <li style={{ color: "#bbb" }}>No upcoming tasks.</li>
            )}
          </ul>
        </div>

        {/* Snake Game */}
        <SnakeGame />

        {/* Leaderboard demo */}
        <div style={{
          background: "rgba(255,255,255,0.98)",
          borderRadius: 17,
          boxShadow: "0 3px 14px #1976d218",
          padding: "22px 19px 16px 19px",
          marginTop: 22
        }}>
          <div style={{ fontWeight: 900, color: "#1976d2", fontSize: 18, marginBottom: 10 }}>
            <span role="img" aria-label="trophy">🏆</span> Leaderboard (Demo)
          </div>
          <ol style={{ paddingLeft: 24, color: "#43e97b", fontWeight: 700, fontSize: 16 }}>
            {leaderboardDemo.map((u, i) => (
              <li key={u.name} style={{
                marginBottom: 4,
                color: i === 0 ? "#f1c40f" : "#1976d2"
              }}>{u.name} — <span style={{ color: "#1976d2" }}>{u.score}</span></li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
