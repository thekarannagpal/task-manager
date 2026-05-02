"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <h2 className="text-gradient">TaskFlow</h2>
      </div>
      
      <div className={styles.actions}>
        {session ? (
          <div className={styles.userProfile}>
            <span className={styles.userName}>{session.user.name}</span>
            <span className={styles.roleBadge}>{session.user.role}</span>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
              Sign Out
            </button>
          </div>
        ) : (
          <Link href="/login" className="btn btn-primary">Sign In</Link>
        )}
      </div>
    </nav>
  );
}
