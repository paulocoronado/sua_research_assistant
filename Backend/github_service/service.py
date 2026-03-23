import asyncio
from typing import Dict, Any, List
from .interfaces import IGitHubClient

class GitHubStatsService:
    """Service to process data from GitHub CLI."""
    
    def __init__(self, client: IGitHubClient):
        self.client = client

    async def get_repo_stats(self, owner: str, repo: str) -> Dict[str, Any]:
        """Fetch and aggregate stats into a single dictionary concurrently."""
        results = await asyncio.gather(
            self.client.get_repo_details(owner, repo),
            self.client.get_commit_activity(owner, repo),
            self.client.get_code_frequency(owner, repo),
            self.client.get_branches_count(owner, repo),
            self.client.get_total_commits(owner, repo),
            self.client.get_contributors_count(owner, repo),
            return_exceptions=True
        )
        
        details_raw, commits_raw, code_freq_raw, branches_count, total_commits_all, contributors_count = [
            res if not isinstance(res, Exception) else ({} if i == 0 else ([] if i in [1,2] else 0))
            for i, res in enumerate(results)
        ]

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
            for item in code_freq_raw[-26:]: # last 6 months
                if isinstance(item, list) and len(item) == 3:
                    code_freq.append({
                        "week": item[0],
                        "additions": item[1],
                        "deletions": item[2]
                    })

        default_branch = details_raw.get("default_branch", "main")
        files_count = await self.client.get_files_count(owner, repo, default_branch)

        return {
            "total_commits": total_commits,
            "branches_count": branches_count,
            "commit_activity": commits,
            "code_frequency": code_freq,
            "total_commits_all_time": total_commits_all if total_commits_all > 0 else total_commits,
            "contributors_count": contributors_count,
            "files_count": files_count,
            "stars": details_raw.get("stargazers_count", 0),
            "forks": details_raw.get("forks_count", 0)
        }
