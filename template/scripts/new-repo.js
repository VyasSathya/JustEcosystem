#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function copyRecursive(src, dest, ignoreDirs = ['.git', 'node_modules']) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    if (ignoreDirs.includes(item)) continue;
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyRecursive(srcPath, destPath, ignoreDirs);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const [, , newRepoName] = process.argv;
if (!newRepoName) {
  console.error('Usage: new-repo.js <new-repo-name>');
  process.exit(1);
}
const templateRoot = path.resolve(__dirname, '..');
const destRoot = path.resolve(process.cwd(), newRepoName);
copyRecursive(templateRoot, destRoot);
console.log(`✅ Project scaffolded at ${destRoot}`);
// Remove template git history
const gitDir = path.join(destRoot, '.git');
if (fs.existsSync(gitDir)) fs.rmSync(gitDir, { recursive: true, force: true });
// Initialize new git repo
execSync('git init', { cwd: destRoot });
console.log('✅ Git repo initialized.');
