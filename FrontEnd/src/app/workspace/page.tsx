import styles from "./page.module.css";

export default function WorkspaceHome() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p>Welcome to SUA. Select a document to start coding.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Documents</h3>
          <div className={styles.statValue}>12</div>
        </div>
        <div className={styles.statCard}>
          <h3>Codes</h3>
          <div className={styles.statValue}>48</div>
        </div>
        <div className={styles.statCard}>
          <h3>Quotations</h3>
          <div className={styles.statValue}>156</div>
        </div>
        <div className={styles.statCard}>
          <h3>Memos</h3>
          <div className={styles.statValue}>8</div>
        </div>
      </div>

      <div className={styles.recentSection}>
        <h2>Recent Documents</h2>
        <div className={styles.documentList}>
          {/* Mockup Data */}
          {[1, 2, 3].map(i => (
            <div key={i} className={styles.documentItem}>
              <div className={styles.docIcon}>📄</div>
              <div className={styles.docInfo}>
                <div className={styles.docName}>Interview_0{i}.pdf</div>
                <div className={styles.docMeta}>Added 2 days ago • {Math.floor(Math.random() * 20) + 5} codes</div>
              </div>
              <button className={styles.docAction}>Open</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
