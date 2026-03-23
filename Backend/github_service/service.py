from typing import Dict, Any, List
from .interfaces import IGitHubClient

class GitHubStatsService:
    """Service to process data from GitHub CLI."""
    
    def __init__(self, client: IGitHubClient):
        self.client = client

    async def get_repo_stats(self, owner: str, repo: str) -> Dict[str, Any]:
        """Fetch and aggregate stats into a single dictionary."""
        commits_raw = await self.client.get_commit_activity(owner, repo)
        code_freq_raw = await self.client.get_code_frequency(owner, repo)
        branches_count = await self.client.get_branches_count(owner, repo)
        
        # Process commit activity
        total_commits = 0
        commits = []
        if isinstance(commits_raw, list):
            for item in commits_raw:
                if isinstance(item, dict) and "total" in item and "week" in item:
                    commits.append({
                        "week": item["week"],
                        "total": item["total"]
                    })
                    total_commits += item["total"]

        # Process code frequency
        code_freq = []
        if isinstance(code_freq_raw, list):
            for item in code_freq_raw[-26:]: # last 26 weeks
                if isinstance(item, list) and len(item) == 3:
                    code_freq.append({
                        "week": item[0],
                        "additions": item[1],
                        "deletions": item[2]
                    })

        return {
            "total_commits": total_commits,
            "branches_count": branches_count,
            "commit_activity": commits,
            "code_frequency": code_freq
        }
