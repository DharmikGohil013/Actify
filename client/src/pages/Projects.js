// import React, { useEffect, useState } from "react";
// import { getAllProjects, getProjectStats } from "../utils/api";
// import LoaderOverlay from "../components/Loader";

// export default function Projects() {
//   const [loading, setLoading] = useState(true);
//   const [projects, setProjects] = useState([]);
//   const [stats, setStats] = useState({});

//   useEffect(() => {
//     async function fetchProjects() {
//       setLoading(true);
//       const allProjects = await getAllProjects();
//       setProjects(allProjects || []);

//       const statsMap = {};
//       for (let i = 0; i < (allProjects || []).length; i++) {
//         const project = allProjects[i];
//         const stat = await getProjectStats(project._id);
//         statsMap[project._id] = stat;
//       }

//       setStats(statsMap);
//       setLoading(false);
//     }

//     fetchProjects();
//   }, []);

//   if (loading) return <LoaderOverlay />;

//   return (
//     <div style={{ padding: 32, background: "#f6f9fc", minHeight: "100vh" }}>
//       <h2 style={{ fontWeight: 900, fontSize: 28, marginBottom: 26, color: "#253e83" }}>
//         📁 All Projects
//       </h2>

//       {projects.length === 0 ? (
//         <p style={{ color: "#999", fontWeight: 600 }}>You are not part of any projects yet.</p>
//       ) : (
//         <div style={{ display: "flex", flexWrap: "wrap", gap: 28 }}>
//           {projects.map((project) => {
//             const stat = stats[project._id] || {};
//             return (
//               <div
//                 key={project._id}
//                 style={{
//                   background: "#fff",
//                   padding: 24,
//                   borderRadius: 16,
//                   boxShadow: "0 4px 14px #b9c5d440",
//                   flex: "1 1 300px",
//                   minWidth: 280,
//                   maxWidth: 400,
//                   borderLeft: "6px solid #1976d2",
//                 }}
//               >
//                 <h3 style={{ marginBottom: 8, color: "#253e83", fontWeight: 800 }}>
//                   {project.name}
//                 </h3>
//                 <div style={{ fontSize: 14, color: "#666", marginBottom: 14 }}>
//                   Team: <strong>{project.teamName || "—"}</strong> <br />
//                   Role: <strong>{project.role || "Member"}</strong> <br />
//                   Deadline:{" "}
//                   <strong>
//                     {project.deadline ? new Date(project.deadline).toLocaleDateString() : "—"}
//                   </strong>
//                 </div>

//                 <div style={{ display: "flex", gap: 16 }}>
//                   <ProjectStat label="Tasks" value={stat.total || 0} color="#1976d2" />
//                   <ProjectStat label="Completed" value={stat.completed || 0} color="#43e97b" />
//                   <ProjectStat label="Pending" value={stat.pending || 0} color="#ff9100" />
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// function ProjectStat({ label, value, color }) {
//   return (
//     <div
//       style={{
//         flex: 1,
//         background: "#f3f8fc",
//         borderRadius: 12,
//         padding: "14px 12px",
//         textAlign: "center",
//         color: color,
//         fontWeight: 800,
//         fontSize: 15,
//         boxShadow: "0 2px 6px #00000011",
//       }}
//     >
//       {value}
//       <div style={{ fontSize: 13, color: "#999", fontWeight: 600 }}>{label}</div>
//     </div>
//   );
// }
import React from "react";

export default function Projects() {
  return <div>📁 All Projects (List of your teams and projects)</div>;
}
