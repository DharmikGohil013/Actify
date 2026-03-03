import React from "react";
import { useParams } from "react-router-dom";

export default function ProjectDetails() {
  const { projectId } = useParams();
  return (
    <div className="page-container" style={{ animation: "pageEnter .5s ease" }}>
      <div className="page-header"><h1>Project Details</h1></div>
      <div className="empty-state">
        <span style={{ fontSize: 48 }}>📊</span>
        <h3>Project Dashboard</h3>
        <p>Details for project <strong>{projectId}</strong> coming soon.</p>
      </div>
    </div>
  );
}
