#!/usr/bin/env node
const express = require('express');
const fetch = (...args) => import('node-fetch').then(m => m.default(...args));
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3030;

// === CONFIG ===
const ORG = 'VyasSathya'; // Change to your org/user
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

// === HELPERS ===
async function fetchRepos() {
  const res = await fetch(`https://api.github.com/users/${ORG}/repos`, {
    headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {}
  });
  return res.json();
}
async function fetchFile(repo, filePath) {
  const res = await fetch(`https://api.github.com/repos/${ORG}/${repo}/contents/${filePath}`,
    { headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {} });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.content) return null;
  return Buffer.from(data.content, 'base64').toString('utf8');
}

// === ROUTES ===
app.get('/api/repos', async (req, res) => {
  const repos = await fetchRepos();
  res.json(repos.map(r => ({ name: r.name, url: r.html_url })));
});
app.get('/api/status/:repo', async (req, res) => {
  const repo = req.params.repo;
  const checklist = await fetchFile(repo, 'CHECKLIST.md');
  const readme = await fetchFile(repo, 'README.md');
  const masterDoc = await fetchFile(repo, '.docs/master/README.md');
  const checklistOk = checklist && !/\[ \]/.test(checklist);
  res.json({
    repo,
    checklistOk,
    checklist: !!checklist,
    readme: !!readme,
    masterDoc: !!masterDoc
  });
});
app.use(express.static(path.join(__dirname, 'dashboard-ui')));
app.listen(PORT, () => console.log(`Dashboard server running on http://localhost:${PORT}`));
