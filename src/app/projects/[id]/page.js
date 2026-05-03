"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export default function ProjectDetails() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");

  const fetchProjectData = async () => {
    try {
      const [projRes, tasksRes, usersRes] = await Promise.all([
        fetch(`/api/projects`), 
        fetch(`/api/tasks`),
        fetch(`/api/users`)
      ]);
      const projData = await projRes.json();
      const tasksData = await tasksRes.json();
      let usersData = [];
      if (usersRes.ok) {
        usersData = await usersRes.json();
      }
      
      const currentProj = projData.find(p => p._id === id);
      setProject(currentProj);
      setTasks(tasksData.filter(t => t.projectId?._id === id));

      if (currentProj && usersData.length > 0) {
         const projectMemberIds = currentProj.members.map(m => m._id);
         const allowedUsers = usersData.filter(u => projectMemberIds.includes(u._id) || u._id === currentProj.ownerId?._id);
         setAllUsers(allowedUsers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: taskTitle, 
          description: taskDesc, 
          projectId: id,
          assigneeId: assigneeId || undefined,
          dueDate: dueDate || undefined
        }),
      });
      if (res.ok) {
        setShowTaskModal(false);
        setTaskTitle("");
        setTaskDesc("");
        setAssigneeId("");
        setDueDate("");
        fetchProjectData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchProjectData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading project details...</div>;
  if (!project) return <div>Project not found</div>;

  const renderColumn = (status, title) => {
    const columnTasks = tasks.filter(t => t.status === status);
    return (
      <div className="glass-card" style={{ flex: 1, minWidth: "300px", background: "rgba(26,29,36,0.4)" }}>
        <h3 style={{ marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
          {title} <span className="badge" style={{ background: "var(--bg-secondary)" }}>{columnTasks.length}</span>
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {columnTasks.map(t => (
            <div key={t._id} className="glass-card" style={{ padding: "1rem", background: "var(--bg-secondary)" }}>
              <h4 style={{ marginBottom: "0.5rem" }}>{t.title}</h4>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>{t.description}</p>
              
              {t.dueDate && (
                <div style={{ fontSize: "0.75rem", color: "var(--warning)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  Due: {new Date(t.dueDate).toLocaleDateString()}
                </div>
              )}
              
              <div className="flex-between" style={{ marginTop: t.dueDate ? "0" : "1rem" }}>
                <span className="text-secondary" style={{ fontSize: "0.75rem" }}>{t.assigneeId?.name || "Unassigned"}</span>
                <select 
                  value={t.status} 
                  onChange={(e) => updateTaskStatus(t._id, e.target.value)}
                  style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "2rem" }}>
        <div>
          <h1 className="text-gradient">{project.name}</h1>
          <p className="text-secondary">{project.description}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>+ Add Task</button>
      </div>

      <div style={{ display: "flex", gap: "1.5rem", overflowX: "auto", paddingBottom: "1rem" }}>
        {renderColumn("TODO", "To Do")}
        {renderColumn("IN_PROGRESS", "In Progress")}
        {renderColumn("DONE", "Done")}
      </div>

      {showTaskModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "500px", background: "var(--bg-secondary)", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ marginBottom: "1.5rem" }}>Add Task</h2>
            <form onSubmit={handleCreateTask} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label>Task Title</label>
                <input type="text" required value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label>Description</label>
                <textarea rows="3" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)}></textarea>
              </div>
              
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                  <label>Assignee</label>
                  <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} style={{ padding: "0.5rem", borderRadius: "8px" }}>
                    <option value="">Unassigned</option>
                    {allUsers.map(user => (
                      <option key={user._id} value={user._id}>{user.name}</option>
                    ))}
                  </select>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                  <label>Timeline / Due Date</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ padding: "0.5rem", borderRadius: "8px" }} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
