"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 150px)", textAlign: "center" }}>
      <h1 className="text-gradient" style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>TaskFlow</h1>
      <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", maxWidth: "600px", marginBottom: "2rem" }}>
        A premium full-stack task manager for your team. Collaborate, assign tasks, and track progress effortlessly.
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link href="/login" className="btn btn-primary">Get Started</Link>
        <Link href="/signup" className="btn btn-secondary">Create Account</Link>
      </div>
    </div>
  );
}
