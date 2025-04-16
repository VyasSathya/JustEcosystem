#!/usr/bin/env node

/**
 * Script to install VSCode extensions for markdown linting
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const EXTENSIONS = [
    'DavidAnson.vscode-markdownlint',   // Markdown linting
    'yzhang.markdown-all-in-one',       // Markdown formatting and TOC
    'shd101wyy.markdown-preview-enhanced', // Enhanced Markdown preview
    'esbenp.prettier-vscode'           // Prettier for consistent formatting
];

console.log('Installing VSCode extensions for markdown linting...');

// Create .vscode directory if it doesn't exist
const vscodeDir = path.join(__dirname, '..', '.vscode');
if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir, { recursive: true });
    console.log('Created .vscode directory');
}

// Check if extensions are installed and install if not
EXTENSIONS.forEach(extension => {
    try {
        console.log(`Checking extension: ${extension}`);
        execSync(`code --list-extensions | findstr ${extension}`, { stdio: 'ignore' });
        console.log(`Extension ${extension} is already installed.`);
    } catch (err) {
        // Extension not installed
        try {
            console.log(`Installing extension: ${extension}`);
            execSync(`code --install-extension ${extension}`, { stdio: 'inherit' });
            console.log(`Extension ${extension} installed successfully.`);
        } catch (installErr) {
            console.error(`Failed to install extension ${extension}:`, installErr.message);
        }
    }
});

console.log('\nExtension installation completed.');
console.log('Please restart VSCode for extensions to take effect.');

// Create or update project-recommended extensions file
const recommendedExtensions = {
    "recommendations": EXTENSIONS
};

const extensionsFile = path.join(vscodeDir, 'extensions.json');
fs.writeFileSync(extensionsFile, JSON.stringify(recommendedExtensions, null, 2));
console.log('Created VS Code extensions recommendations file.');
 