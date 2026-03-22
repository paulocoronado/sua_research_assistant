"use client";

import styles from "./page.module.css";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <button 
          onClick={toggleTheme} 
          className={styles.themeToggle} 
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </header>
      
      <div className={`${styles.orb} ${styles.orb1}`}></div>
      <div className={`${styles.orb} ${styles.orb2}`}></div>
      
      <div className={styles.content}>
        <h1 className={styles.title}>SUA</h1>
        <h2 className={styles.subtitle}>
          Research Assistant
        </h2>
        <p className={styles.subtitle} style={{ fontSize: "1rem", marginTop: "-1.5rem", opacity: 0.8 }}>
          A modern, multi-layer qualitative data analysis platform.
        </p>
        
        <div className={styles.actions}>
          <Link href="/workspace">
            <button className={styles.btnPrimary}>Enter Workspace</button>
          </Link>
          <Link href="#features">
            <button className={styles.btnSecondary}>Learn More</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
