from abc import ABC, abstractmethod
from typing import Dict, Any, List

class IGitHubClient(ABC):
    """Abstract interface for GitHub HTTP Client."""
    
    @abstractmethod
    async def get_commit_activity(self, owner: str, repo: str) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    async def get_code_frequency(self, owner: str, repo: str) -> List[List[Any]]:
        pass

    @abstractmethod
    async def get_branches_count(self, owner: str, repo: str) -> int:
        pass

    @abstractmethod
    async def get_total_commits(self, owner: str, repo: str) -> int:
        pass

    @abstractmethod
    async def get_contributors_count(self, owner: str, repo: str) -> int:
        pass

    @abstractmethod
    async def get_repo_details(self, owner: str, repo: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    async def get_files_count(self, owner: str, repo: str, default_branch: str) -> int:
        pass
