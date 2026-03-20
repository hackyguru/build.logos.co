export type IssueData = {
  id: number;
  title: string;
  url: string;
  repo: string;
  labels: { name: string; color: string }[];
  createdAt: string;
  comments: number;
  user: string;
  userAvatar: string;
};

export async function fetchGoodFirstIssues(): Promise<IssueData[]> {
  const query = encodeURIComponent(
    'org:logos-co label:"good first issue" is:issue is:open'
  );
  const res = await fetch(
    `https://api.github.com/search/issues?q=${query}&per_page=100&sort=created&order=desc`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
    }
  );

  const data = await res.json();

  if (!data.items || !Array.isArray(data.items)) {
    console.warn("GitHub Search API returned unexpected response:", data);
    return [];
  }

  return data.items.map((item: any) => {
    // Extract repo name from repository_url
    const repoParts = item.repository_url?.split("/") || [];
    const repo = repoParts[repoParts.length - 1] || "";

    return {
      id: item.id,
      title: item.title,
      url: item.html_url,
      repo,
      labels: (item.labels || []).map((l: any) => ({
        name: l.name,
        color: l.color,
      })),
      createdAt: item.created_at,
      comments: item.comments || 0,
      user: item.user?.login || "",
      userAvatar: item.user?.avatar_url || "",
    };
  });
}
