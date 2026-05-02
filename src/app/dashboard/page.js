"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./Dashboard.module.css";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/projects")
      ]);
      const tasksData = await tasksRes.json();
      const projectsData = await projectsRes.json();
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) return <div>Loading dashboard...</div>;

  const todoTasks = tasks.filter(t => t.status === "TODO");
  const inProgressTasks = tasks.filter(t => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter(t => t.status === "DONE");

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className="text-gradient">Dashboard</h1>
        <p>Welcome back, {session?.user?.name}!</p>
      </div>

      <div className={styles.metrics}>
        <div className={`glass-card ${styles.metricCard}`}>
          <h3>Total Projects</h3>
          <div className={styles.value}>{projects.length || 0}</div>
        </div>
        <div className={`glass-card ${styles.metricCard}`}>
          <h3>To Do</h3>
          <div className={styles.value}>{todoTasks.length || 0}</div>
        </div>
        <div className={`glass-card ${styles.metricCard}`}>
          <h3>In Progress</h3>
          <div className={styles.value}>{inProgressTasks.length || 0}</div>
        </div>
        <div className={`glass-card ${styles.metricCard}`}>
          <h3>Done</h3>
          <div className={styles.value}>{doneTasks.length || 0}</div>
        </div>
      </div>

      <div className={styles.recentSection}>
        <div className="glass-card">
          <div className="flex-between">
            <h2>Recent Projects</h2>
            <Link href="/projects" className="btn btn-secondary">View All</Link>
          </div>
          <div className={styles.list}>
            {projects.slice(0, 3).map(p => (
              <div key={p._id} className={styles.listItem}>
                <h4>{p.name}</h4>
                <p>{p.description || "No description"}</p>
              </div>
            ))}
            {projects.length === 0 && <p className="text-secondary mt-2">No projects found.</p>}
          </div>
        </div>

        <div className="glass-card">
          <div className="flex-between">
            <h2>Your Tasks</h2>
            <Link href="/tasks" className="btn btn-secondary">View All</Link>
          </div>
          <div className={styles.list}>
            {tasks.slice(0, 3).map(t => (
              <div key={t._id} className={styles.listItem}>
                <div className="flex-between">
                  <h4>{t.title}</h4>
                  <span className={`badge badge-${t.status.toLowerCase().replace('_', '-')}`}>{t.status.replace('_', ' ')}</span>
                </div>
                <p>{t.projectId?.name}</p>
              </div>
            ))}
            {tasks.length === 0 && <p className="text-secondary mt-2">No tasks assigned.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
