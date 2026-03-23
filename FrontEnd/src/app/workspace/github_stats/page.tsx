'use client';
import { useState } from 'react';
import RepoDashboard from './components/RepoDashboard';

export default function GithubStatsPage() {
  const [inputValue, setInputValue] = useState('');
  const [repositories, setRepositories] = useState<string[]>([]);

  const handleAnalyze = () => {
    const repos = inputValue.split(',').map(r => r.trim()).filter(r => r.match(/^[\w.-]+\/[\w.-]+$/));
    setRepositories(repos);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#171515' }}>GitHub Stats Analyzer</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Enter a comma-separated list of GitHub repositories (e.g. <code>owner/repo</code>) to analyze their commits, additions, deletions, and branches.
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g. vercel/next.js, facebook/react"
          style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
        />
        <button 
          onClick={handleAnalyze}
          style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', background: '#171515', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
        >
          Analyze
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {repositories.length === 0 && (
          <p style={{ color: '#666', fontStyle: 'italic' }}>Please enter a valid list of repositories to analyze.</p>
        )}
        {repositories.map(repo => (
          <RepoDashboard key={repo} repoName={repo} />
        ))}
      </div>
    </div>
  );
}
