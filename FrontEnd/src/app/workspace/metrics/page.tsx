"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function MetricsDashboard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/metrics/analyze");
      let errorMessage = "Failed to fetch analysis";
      if (!res.ok) {
        try {
          const json = await res.json();
          if (json.error) errorMessage = json.error;
        } catch(e) {}
        throw new Error(errorMessage);
      }
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Moodle Metrics Analysis</h1>
        <p>Run complex statistical tests and generate categorical distributions directly from the platform.</p>
        <button className={styles.analyzeBtn} onClick={runAnalysis} disabled={loading}>
          {loading ? "Running Analysis..." : "Run Analysis"}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {data && (
        <div className={styles.results}>
          <div className={styles.successMsg}>{data.message}</div>
          
          <div className={styles.section}>
            <h2>Categorical Distributions (100% Stacked)</h2>
            <div className={styles.chartGrid}>
              {data.images.map((img: string, i: number) => (
                <div key={i} className={styles.chartCard}>
                  {/* We append a timestamp to avoid browser caching old images */}
                  <img src={`${img}?t=${new Date().getTime()}`} alt={`Distribution ${i}`} className={styles.chartImg} />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2>Comparative Tests (Numeric Data)</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Variable</th>
                    <th>Normal (Shapiro)</th>
                    <th>Test Used</th>
                    <th>p-value</th>
                    <th>Post-Hoc</th>
                  </tr>
                </thead>
                <tbody>
                  {data.numeric_tests.map((row: any, idx: number) => (
                    <tr key={idx}>
                      <td>{row.Variable}</td>
                      <td>{row.Normal ? "Yes" : "No"}</td>
                      <td>{row.Test}</td>
                      <td>{typeof row.p_value === 'number' ? row.p_value.toFixed(4) : row.p_value}</td>
                      <td className={styles.posthoc}>{row.PostHoc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Comparative Tests (Categorical Data)</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Variable</th>
                    <th>Test Used</th>
                    <th>p-value</th>
                    <th>Cramér's V</th>
                  </tr>
                </thead>
                <tbody>
                  {data.categorical_tests.map((row: any, idx: number) => (
                    <tr key={idx}>
                      <td>{row.Variable}</td>
                      <td>{row.Test}</td>
                      <td>{typeof row.p_value === 'number' ? row.p_value.toFixed(4) : row.p_value}</td>
                      <td>{typeof row.Cramer_V === 'number' ? row.Cramer_V.toFixed(4) : row.Cramer_V}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
