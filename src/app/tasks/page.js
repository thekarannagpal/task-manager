"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function MyTasks() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchTasks();
    }
  }, [session]);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "2rem" }}>
        <h1 className="text-gradient">My Tasks</h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {tasks.map(t => (
          <div key={t._id} className="glass-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ marginBottom: "0.25rem" }}>{t.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                {t.projectId?.name} • {t.description}
              </p>
            </div>
            
            <select 
              value={t.status} 
              onChange={(e) => updateTaskStatus(t._id, e.target.value)}
              className={`badge badge-${t.status.toLowerCase().replace('_', '-')}`}
              style={{ border: "none", outline: "none", padding: "0.5rem", cursor: "pointer" }}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        ))}
        {tasks.length === 0 && <p>No tasks found.</p>}
      </div>
    </div>
  );
}
