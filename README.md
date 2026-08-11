# GitHub Profile Analyzer React Component

An interactive GitHub Profile Analyzer dashboard built with React and custom dark-theme CSS using the official GitHub REST API.

## Features
- **User Search**: Instant lookup for any public GitHub user account
- **Profile Summary**: Displays avatar, bio, location, company, blog, creation date, and followers/following metrics
- **Aggregated Stats**: Shows public repository counts, total accumulated stars, total forks, and top programming languages
- **Repository List**: Interactive grid displaying repository cards with description, language badge, star count, fork count, and direct GitHub links
- **Sorting Options**: Sort repos by Most Stars, Most Forks, or Recently Updated
- **Error & Loading States**: Clean indicators for non-existent users, API rate limits, or network issues

## Setup and Usage

1. Add `github-analyzer_App.jsx` and `github-analyzer_App.css` to your Vite React workspace.
2. Render the component in `src/main.jsx`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './github-analyzer_App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

3. Run Vite dev server:
```bash
npm run dev
```
