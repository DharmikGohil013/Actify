import React from "react";
import { useParams } from "react-router-dom";

export default function ProjectDetails() {
  const { projectId } = useParams();
  return <div>📊 Project Dashboard for: {projectId}</div>;
}
