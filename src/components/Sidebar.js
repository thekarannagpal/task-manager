"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Projects", href: "/projects", icon: "📁" },
    { name: "My Tasks", href: "/tasks", icon: "✅" },
  ];

  return (
    <aside className={styles.sidebar}>
      <ul className={styles.navLinks}>
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <li key={link.name}>
              <Link 
                href={link.href} 
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              >
                <span className={styles.icon}>{link.icon}</span>
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
