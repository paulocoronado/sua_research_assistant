"use client";

import { useTheme } from "@/components/ThemeProvider";
import styles from "./layout.module.css";
import Link from "next/link";
import { useState } from "react";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.container}>
      <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}>
        <div style={{ padding: "1.5rem", fontWeight: "bold", fontSize: "1.25rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {!collapsed && <span style={{ color: "var(--primary)" }}>SUA</span>}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: "none", border: "none", color: "var(--foreground)", cursor: "pointer", padding: "0.25rem" }}>
            {collapsed ? "»" : "«"}
          </button>
        </div>
        <nav style={{ flex: 1, marginTop: "1rem" }}>
          <div className={styles.navItem}><span className={styles.navIcon}>📄</span> {!collapsed && "Documents"}</div>
          <div className={styles.navItem}><span className={styles.navIcon}>🏷️</span> {!collapsed && "Codes"}</div>
          <div className={styles.navItem}><span className={styles.navIcon}>🗣️</span> {!collapsed && "Quotations"}</div>
          <div className={styles.navItem}><span className={styles.navIcon}>📝</span> {!collapsed && "Memos"}</div>
          <div className={styles.navItem}><span className={styles.navIcon}>🕸️</span> {!collapsed && "Networks"}</div>
          <Link href="/workspace/sua_analysis" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className={styles.navItem}><span className={styles.navIcon}>📊</span> {!collapsed && "SUA Analysis"}</div>
          </Link>
        </nav>
      </aside>
      
      <main className={styles.main}>
        <header className={styles.topbar}>
          <div style={{ fontWeight: 600 }}>Project: Default Workspace</div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button onClick={toggleTheme} className={styles.iconButton} title="Toggle Theme">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <Link href="/" style={{ marginLeft: "1.5rem", color: "var(--foreground)", opacity: 0.8, fontWeight: 500, fontSize: "0.9rem" }}>
              Exit Workspace
            </Link>
          </div>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
