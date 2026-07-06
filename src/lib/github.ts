import { useQuery } from "@tanstack/react-query";

export type RepoMetrics = {
  stars: number;
  forks: number;
  issues: number;
  language: string | null;
  lastCommit: string | null; // ISO date
};

async function fetchRepoMetrics(owner: string, repo: string): Promise<RepoMetrics> {
  const [repoRes, commitsRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    }),
  ]);
  if (!repoRes.ok) throw new Error(`GitHub API ${repoRes.status}`);
  const data = await repoRes.json();
  let lastCommit: string | null = null;
  if (commitsRes.ok) {
    const commits = await commitsRes.json();
    lastCommit = commits?.[0]?.commit?.author?.date ?? commits?.[0]?.commit?.committer?.date ?? null;
  }
  return {
    stars: data.stargazers_count ?? 0,
    forks: data.forks_count ?? 0,
    issues: data.open_issues_count ?? 0,
    language: data.language ?? null,
    lastCommit,
  };
}

export function useRepoMetrics(repoUrl: string) {
  const parsed = parseRepoUrl(repoUrl);
  return useQuery({
    queryKey: ["gh-repo", parsed?.owner, parsed?.repo],
    queryFn: () => fetchRepoMetrics(parsed!.owner, parsed!.repo),
    enabled: !!parsed,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

function parseRepoUrl(url: string) {
  const m = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, "") };
}
