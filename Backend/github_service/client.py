import httpx
import os
import re
from typing import Dict, Any, List
from .interfaces import IGitHubClient

class GitHubClient(IGitHubClient):
    """Concrete implementation of IGitHubClient using httpx."""
    
    def __init__(self):
        self.base_url = "https://api.github.com"
        self.token = os.getenv("GITHUB_TOKEN")
        
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
        }
        if self.token:
            self.headers["Authorization"] = f"Bearer {self.token}"

    async def get_commit_activity(self, owner: str, repo: str) -> List[Dict[str, Any]]:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/repos/{owner}/{repo}/stats/commit_activity",
                    headers=self.headers
                )
                response.raise_for_status()
                if response.status_code == 202:
                    return []
                return response.json()
        except httpx.HTTPError:
            return []

    async def get_code_frequency(self, owner: str, repo: str) -> List[List[Any]]:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/repos/{owner}/{repo}/stats/code_frequency",
                    headers=self.headers
                )
                response.raise_for_status()
                if response.status_code == 202:
                    return []
                return response.json()
        except httpx.HTTPError:
            return []

    async def get_branches_count(self, owner: str, repo: str) -> int:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/repos/{owner}/{repo}/branches?per_page=1",
                    headers=self.headers
                )
                response.raise_for_status()
                link_header = response.headers.get("link", "")
                match = re.search(r'page=(\d+)>; rel="last"', link_header)
                if match:
                    return int(match.group(1))
                else:
                    return len(response.json())
        except httpx.HTTPError:
            return 0
