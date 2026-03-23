import strawberry
from typing import List
from .client import GitHubClient
from .service import GitHubStatsService

@strawberry.type
class CommitActivity:
    week: int
    total: int

@strawberry.type
class CodeFrequency:
    week: int
    additions: int
    deletions: int

@strawberry.type
class RepoStats:
    total_commits: int
    branches_count: int
    commit_activity: List[CommitActivity]
    code_frequency: List[CodeFrequency]

@strawberry.type
class GitHubQuery:
    @strawberry.field
    async def github_repo_stats(self, owner: str, repo: str) -> RepoStats:
        client = GitHubClient()
        service = GitHubStatsService(client)
        stats = await service.get_repo_stats(owner, repo)
        
        commits = [CommitActivity(**c) for c in stats["commit_activity"]]
        code_freq = [CodeFrequency(**c) for c in stats["code_frequency"]]
        
        return RepoStats(
            total_commits=stats["total_commits"],
            branches_count=stats["branches_count"],
            commit_activity=commits,
            code_frequency=code_freq
        )
