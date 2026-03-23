'use client';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { format, fromUnixTime } from 'date-fns';
import { GitBranch, GitCommit, FileCode, AlertCircle, Users, Star, GitFork, FileText } from 'lucide-react';

interface RepoDashboardProps {
  repoName: string;
}

export default function RepoDashboard({ repoName }: RepoDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commitData, setCommitData] = useState<any[]>([]);
  const [codeFreqData, setCodeFreqData] = useState<any[]>([]);
  
  const [metrics, setMetrics] = useState({
    totalCommitsYear: 0,
    totalCommitsAllTime: 0,
    branchesCount: 0,
    contributorsCount: 0,
    filesCount: 0,
    stars: 0,
    forks: 0
  });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = `
          query GitHubStats($owner: String!, $repo: String!) {
            githubRepoStats(owner: $owner, repo: $repo) {
              totalCommits
              totalCommitsAllTime
              branchesCount
              contributorsCount
              filesCount
              stars
              forks
              commitActivity {
                week
                total
              }
              codeFrequency {
                week
                additions
                deletions
              }
            }
          }
        `;
        
        const [owner, repo] = repoName.split('/');
        
        const res = await fetch('http://localhost:8000/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            variables: { owner, repo }
          })
        });
        
        if (!res.ok) throw new Error(`GraphQL request failed: ${res.status}`);
        
        const json = await res.json();
        if (json.errors) throw new Error(json.errors[0].message);
        
        const data = json.data.githubRepoStats;

        if (!isMounted) return;

        if (data.commitActivity && data.commitActivity.length > 0) {
          const formattedCommits = data.commitActivity.map((item: any) => ({
            date: format(fromUnixTime(item.week), 'MMM dd'),
            commits: item.total
          }));
          setCommitData(formattedCommits);
        }
        
        if (data.codeFrequency && data.codeFrequency.length > 0) {
          const formattedCodeFreq = data.codeFrequency.map((item: any) => ({
            date: format(fromUnixTime(item.week), 'MMM dd'),
            additions: item.additions,
            deletions: Math.abs(item.deletions)
          }));
          setCodeFreqData(formattedCodeFreq);
        }

        setMetrics({
          totalCommitsYear: data.totalCommits,
          totalCommitsAllTime: data.totalCommitsAllTime,
          branchesCount: data.branchesCount,
          contributorsCount: data.contributorsCount,
          filesCount: data.filesCount,
          stars: data.stars,
          forks: data.forks
        });

      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [repoName]);

  if (loading) return <div style={{ padding: '2rem', border: '1px solid #eaeaea', borderRadius: '16px', textAlign: 'center' }}>Loading {repoName}...</div>;
  if (error) return <div style={{ padding: '2rem', border: '1px solid #ffcccc', background: '#fff0f0', borderRadius: '16px', color: '#cc0000', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle /> Error loading {repoName}: {error}</div>;

  return (
    <div style={{ padding: '2rem', border: '1px solid #eaeaea', borderRadius: '16px', background: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <a href={`https://github.com/${repoName}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#171515' }}>
          {repoName}
        </a>
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <Star size={24} color="#eab308" />
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1e293b' }}>{metrics.stars}</span>
          <span style={{ color: '#64748b', fontSize: '0.75rem', textAlign: 'center' }}>Stars</span>
        </div>
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <GitFork size={24} color="#64748b" />
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1e293b' }}>{metrics.forks}</span>
          <span style={{ color: '#64748b', fontSize: '0.75rem', textAlign: 'center' }}>Forks</span>
        </div>
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <GitCommit size={24} color="#3b82f6" />
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1e293b' }}>{metrics.totalCommitsAllTime}</span>
          <span style={{ color: '#64748b', fontSize: '0.75rem', textAlign: 'center' }}>Total Commits</span>
        </div>
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <Users size={24} color="#8b5cf6" />
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1e293b' }}>{metrics.contributorsCount}</span>
          <span style={{ color: '#64748b', fontSize: '0.75rem', textAlign: 'center' }}>Contributors</span>
        </div>
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <FileText size={24} color="#f97316" />
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1e293b' }}>{metrics.filesCount}</span>
          <span style={{ color: '#64748b', fontSize: '0.75rem', textAlign: 'center' }}>Files</span>
        </div>
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <GitBranch size={24} color="#10b981" />
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1e293b' }}>{metrics.branchesCount}</span>
          <span style={{ color: '#64748b', fontSize: '0.75rem', textAlign: 'center' }}>Branches</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Commits Chart */}
        <div style={{ height: '300px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#334155' }}>Commit Activity (Weekly, Last Year)</h3>
          {commitData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={commitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={`colorCommits-${repoName.replace('/', '-')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} minTickGap={30} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="commits" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill={`url(#colorCommits-${repoName.replace('/', '-')})`} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ background: '#f8fafc', borderRadius: '12px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No commit data available.</p>
            </div>
          )}
        </div>

        {/* Code Frequency Chart */}
        <div style={{ height: '300px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#334155' }}>Code Frequency</h3>
          {codeFreqData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={codeFreqData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} minTickGap={30} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  cursor={{fill: '#f1f5f9'}}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b' }}/>
                <Bar dataKey="additions" name="Additions" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="deletions" name="Deletions" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ background: '#f8fafc', borderRadius: '12px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No code frequency data available.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
