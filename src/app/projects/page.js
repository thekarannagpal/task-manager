"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Projects() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const fetchData = async () => {
    try {
      const [projectsRes, usersRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/users")
      ]);
      const projData = await projectsRes.json();
      setProjects(projData);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setAllUsers(usersData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, members: selectedMembers }),
      });
      if (res.ok) {
        setShowModal(false);
        setName("");
        setDescription("");
        setSelectedMembers([]);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMemberToggle = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "2rem" }}>
        <h1 className="text-gradient">Projects</h1>
        {session?.user?.role === "ADMIN" && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New Project
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {projects.map(p => (
          <Link href={`/projects/${p._id}`} key={p._id}>
            <div className="glass-card" style={{ height: "100%", cursor: "pointer" }}>
              <h3 style={{ marginBottom: "0.5rem" }}>{p.name}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1rem" }}>{p.description}</p>
              <div className="flex-between">
                <span className="badge badge-progress">{p.members?.length || 0} Members</span>
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && <p>No projects found.</p>}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "500px", background: "var(--bg-secondary)", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ marginBottom: "1.5rem" }}>Create New Project</h2>
            <form onSubmit={handleCreateProject} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label>Project Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label>Description</label>
                <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label>Assign Members</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", background: "var(--bg-color)", padding: "1rem", borderRadius: "8px", maxHeight: "150px", overflowY: "auto" }}>
                  {allUsers.filter(u => u._id !== session?.user?.id).map(user => (
                    <label key={user._id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        checked={selectedMembers.includes(user._id)}
                        onChange={() => handleMemberToggle(user._id)}
                      />
                      <span>{user.name} <small className="text-secondary">({user.email})</small></span>
                    </label>
                  ))}
                  {allUsers.length <= 1 && <span className="text-secondary">No other users found to invite.</span>}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
