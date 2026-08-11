import React, { useState, useEffect } from 'react';
import './github-analyzer_App.css';

export default function App() {
  const [username, setUsername] = useState('octocat');
  const [searchInput, setSearchInput] = useState('octocat');
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('stars');

  const fetchGitHubData = async (userToFetch) => {
    if (!userToFetch.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const userRes = await fetch(`https://api.github.com/users/${userToFetch}`);
      if (!userRes.ok) {
        if (userRes.status === 404) {
          throw new Error(`User "${userToFetch}" not found.`);
        } else if (userRes.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again later.');
        } else {
          throw new Error('Failed to fetch GitHub profile.');
        }
      }
      const userData = await userRes.json();
      setProfile(userData);

      const reposRes = await fetch(
        `https://api.github.com/users/${userToFetch}/repos?per_page=100&sort=pushed`
      );
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        setRepos(reposData);
      } else {
        setRepos([]);
      }
    } catch (err) {
      setError(err.message);
      setProfile(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubData(username);
  }, [username]);

  const copyProfileLink = async () => {
    if (!profile?.html_url) return;
    await navigator.clipboard.writeText(profile.html_url);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setUsername(searchInput.trim());
    }
  };

  const sortedRepos = [...repos].sort((a, b) => {
    if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
    if (sortBy === 'forks') return b.forks_count - a.forks_count;
    if (sortBy === 'updated') return new Date(b.pushed_at) - new Date(a.pushed_at);
    return 0;
  });

  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

  const languages = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  const topLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="gh-container">
      <header className="gh-header">
        <div className="gh-title-group">
          <svg className="gh-logo" height="32" viewBox="0 0 16 16" width="32" fill="currentColor">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 01-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 010 8c0-4.42 3.58-8 8-8z" />
          </svg>
          <h1>GitHub Profile Analyzer</h1>
        </div>

        <form onSubmit={handleSearchSubmit} className="gh-search-form">
          <input
            type="text"
            placeholder="Enter GitHub username..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="gh-input"
          />
          <button type="submit" className="gh-search-btn">
            Analyze
          </button>
        </form>
      </header>

      {loading && (
        <div className="gh-loading">
          <div className="spinner"></div>
          <p>Fetching user profile and repositories...</p>
        </div>
      )}

      {error && !loading && (
        <div className="gh-error-card">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && profile && (
        <main className="gh-content">
          <div className="gh-profile-card">
            <img src={profile.avatar_url} alt={profile.login} className="gh-avatar" />
            <div className="gh-user-info">
              <h2>{profile.name || profile.login}</h2>
              <button className="gh-copy-link" onClick={copyProfileLink}>🔗 Copy profile link</button>
              <a
                href={profile.html_url}
                target="_blank"
                rel="noreferrer"
                className="gh-username-link"
              >
                @{profile.login}
              </a>
              {profile.bio && <p className="gh-bio">{profile.bio}</p>}

              <div className="gh-meta">
                {profile.location && <span>📍 {profile.location}</span>}
                {profile.company && <span>🏢 {profile.company}</span>}
                {profile.blog && (
                  <span>
                    🔗 <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noreferrer">Website</a>
                  </span>
                )}
                <span>📅 Joined {new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="gh-stats-grid">
            <div className="stat-box">
              <span className="stat-label">Public Repos</span>
              <span className="stat-value">{profile.public_repos}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Followers</span>
              <span className="stat-value">{profile.followers}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Following</span>
              <span className="stat-value">{profile.following}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Total Stars</span>
              <span className="stat-value">⭐ {totalStars}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Total Forks</span>
              <span className="stat-value">🍴 {totalForks}</span>
            </div>
          </div>

          {topLanguages.length > 0 && (
            <div className="gh-languages-card">
              <h3>Top Languages</h3>
              <div className="gh-lang-list">
                {topLanguages.map(([lang, count]) => (
                  <div key={lang} className="gh-lang-pill">
                    <span className="lang-name">{lang}</span>
                    <span className="lang-count">{count} repos</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="gh-repos-section">
            <div className="gh-repos-header">
              <h3>Top Repositories ({sortedRepos.length})</h3>
              <div className="gh-sort-controls">
                <label>Sort by: </label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="stars">Most Stars</option>
                  <option value="forks">Most Forks</option>
                  <option value="updated">Recently Updated</option>
                </select>
              </div>
            </div>

            {sortedRepos.length === 0 ? (
              <p className="no-repos">No public repositories found for this user.</p>
            ) : (
              <div className="gh-repos-grid">
                {sortedRepos.slice(0, 12).map((repo) => (
                  <div key={repo.id} className="gh-repo-card">
                    <div className="repo-card-header">
                      <a href={repo.html_url} target="_blank" rel="noreferrer" className="repo-title">
                        {repo.name}
                      </a>
                      {repo.visibility && <span className="repo-badge">{repo.visibility}</span>}
                    </div>
                    <p className="repo-desc">{repo.description || 'No description provided.'}</p>

                    <div className="repo-footer">
                      {repo.language && <span className="repo-lang">● {repo.language}</span>}
                      <span className="repo-stat">⭐ {repo.stargazers_count}</span>
                      <span className="repo-stat">🍴 {repo.forks_count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
