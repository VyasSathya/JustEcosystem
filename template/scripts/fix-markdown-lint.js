#!/usr/bin/env node

/**
 * Script to fix common markdown linting issues:
 * 1. Remove trailing whitespace
 * 2. Ensure file ends with a single newline
 * 3. Remove duplicate H1 headers when present in frontmatter
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Configuration
const ROOT_DIR = path.join(__dirname, '..');
const VERBOSE = process.env.VERBOSE === 'true';

async function getMarkdownFiles(dir, fileList = []) {
    const files = await readdir(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = await stat(filePath);

        if (stats.isDirectory() && !file.startsWith('.git')) {
            await getMarkdownFiles(filePath, fileList);
        } else if (stats.isFile() && file.endsWith('.md')) {
            fileList.push(filePath);
        }
    }

    return fileList;
}

async function fixMarkdownFile(filePath) {
    let content = await readFile(filePath, 'utf8');
    let modified = false;
    let issues = [];

    // Fix trailing whitespace (but preserve intentional line breaks with exactly 2 spaces)
    const trailingWhitespaceFixed = content.replace(/([^ ]) +$/gm, '$1');
    if (trailingWhitespaceFixed !== content) {
        content = trailingWhitespaceFixed;
        modified = true;
        issues.push('trailing whitespace');
    }

    // Fix multiple consecutive blank lines - MD012
    // Apply multiple times to ensure all are fixed
    let prevContent;
    do {
        prevContent = content;
        content = content.replace(/\n{3,}/g, '\n\n');
    } while (content !== prevContent);

    if (content !== trailingWhitespaceFixed) {
        modified = true;
        issues.push('multiple consecutive blank lines');
    }

    // Ensure single newline at end of file
    if (!content.endsWith('\n')) {
        content += '\n';
        modified = true;
        issues.push('missing final newline');
    } else if (content.endsWith('\n\n')) {
        while (content.endsWith('\n\n')) {
            content = content.slice(0, -1);
            modified = true;
        }
        issues.push('multiple final newlines');
    }

    // Fix duplicate H1 headers when frontmatter has title
    if (content.match(/^---\s*[\s\S]*?title\s*:.*?---\s*#\s+/m)) {
        const fixedContent = content.replace(
            /^(---\s*[\s\S]*?title\s*:.*?---\s*)#\s+.*?$/m,
            '$1'
        );
        if (fixedContent !== content) {
            content = fixedContent;
            modified = true;
            issues.push('duplicate H1 header');
        }
    }

    // Fix fenced code blocks without language specification
    const codeBlockRegex = /```(?![\w\-+#.:]+\n)(?!\n\n)/g;
    if (content.match(codeBlockRegex)) {
        content = content.replace(codeBlockRegex, '```text\n');
        modified = true;
        issues.push('missing language specification in code blocks');
    }

    // Fix lists not surrounded by blank lines
    // First, find all lists in the content
    const listItemRegex = /^( *)([*+-]|\d+\.)\s/gm;
    let match;
    let listPositions = [];
    let fixedContent = content;

    // Collect all list item positions
    while ((match = listItemRegex.exec(content)) !== null) {
        const indent = match[1].length;
        let startPos = match.index;

        // Find beginning of list by looking for items with same indentation
        while (startPos > 0) {
            // Check if the previous line is also a list item with same indentation
            const prevLineMatch = content.substring(0, startPos).match(/\n( *)([*+-]|\d+\.)\s[^\n]*$/);
            if (prevLineMatch && prevLineMatch[1].length === indent) {
                startPos = content.lastIndexOf('\n', startPos - 1) + 1;
            } else {
                break;
            }
        }

        // Find end of list by looking for items with same indentation
        let endPos = match.index + match[0].length;
        while (endPos < content.length) {
            const nextLineMatch = content.substring(endPos).match(/^[^\n]*\n( *)([*+-]|\d+\.)\s/);
            if (nextLineMatch && nextLineMatch[1].length === indent) {
                endPos = endPos + nextLineMatch[0].length - nextLineMatch[1].length - nextLineMatch[2].length - 1;
            } else {
                endPos = content.indexOf('\n', endPos);
                endPos = endPos === -1 ? content.length : endPos;
                break;
            }
        }

        // Add list position if it's not already included
        const alreadyIncluded = listPositions.some(pos =>
            (startPos >= pos.start && startPos <= pos.end) ||
            (endPos >= pos.start && endPos <= pos.end)
        );

        if (!alreadyIncluded) {
            listPositions.push({ start: startPos, end: endPos, indent });
        }
    }

    // Process list positions in reverse order to avoid affecting subsequent positions
    listPositions.sort((a, b) => b.start - a.start);

    let listsFixed = false;
    for (const pos of listPositions) {
        // Check if there's a blank line before the list
        const needsLineBeforeList = pos.start > 0 &&
            !content.substring(0, pos.start).endsWith('\n\n') &&
            content.substring(0, pos.start).endsWith('\n');

        // Check if there's a blank line after the list
        const needsLineAfterList = pos.end < content.length &&
            !content.substring(pos.end).startsWith('\n\n') &&
            content.substring(pos.end).startsWith('\n');

        // Fix missing blank lines
        if (needsLineBeforeList) {
            fixedContent = fixedContent.substring(0, pos.start) + '\n' + fixedContent.substring(pos.start);
            listsFixed = true;
        }

        if (needsLineAfterList) {
            const insertPos = pos.end + (needsLineBeforeList ? 1 : 0);
            fixedContent = fixedContent.substring(0, insertPos) + '\n' + fixedContent.substring(insertPos);
            listsFixed = true;
        }
    }

    if (fixedContent !== content) {
        content = fixedContent;
        modified = true;
        issues.push('missing blank lines around lists');
    }

    if (modified) {
        await writeFile(filePath, content, 'utf8');
        if (VERBOSE) {
            console.log(`  - Fixed in ${filePath}: ${issues.join(', ')}`);
        } else {
            console.log(`  - Fixed ${issues.length} issues in ${filePath}`);
        }
        return true;
    }

    return false;
}

async function main() {
    console.log('Finding markdown files...');
    const markdownFiles = await getMarkdownFiles(ROOT_DIR);
    console.log(`Found ${markdownFiles.length} markdown files.`);

    let fixedCount = 0;

    for (const file of markdownFiles) {
        try {
            const wasFixed = await fixMarkdownFile(file);
            if (wasFixed) {
                fixedCount++;
            }
        } catch (error) {
            console.error(`Error fixing ${file}:`, error.message);
        }
    }

    console.log(`\nFixed issues in ${fixedCount} files.`);
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
