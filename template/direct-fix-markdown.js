/**
 * A script to fix markdown files by removing multiple consecutive blank lines
 * Usage: node direct-fix-markdown.js [files...]
 */

const fs = require('fs');
const path = require('path');

// Function to fix markdown content
function fixMarkdown(content) {
  // Replace three or more consecutive blank lines with two blank lines
  return content.replace(/\n{3,}/g, '\n\n');
}

// Function to process a file
function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  try {
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the content
    const fixedContent = fixMarkdown(content);
    
    // Write back to the file if changes were made
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`✅ Fixed ${filePath}`);
      return true;
    } else {
      console.log(`✓ No issues found in ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

// Main function
function main() {
  // Get files from command line arguments
  const files = process.argv.slice(2);
  
  // If no files specified, show usage
  if (files.length === 0) {
    console.log('Usage: node direct-fix-markdown.js [files...]');
    console.log('Example: node direct-fix-markdown.js template/.docs/**/*.md template/.task/**/*.md');
    return;
  }
  
  let processedCount = 0;
  let fixedCount = 0;
  
  // Process each file
  files.forEach(filePattern => {
    try {
      // Handle glob patterns
      if (filePattern.includes('*')) {
        // For simplicity, we just check specific directories
        if (filePattern.includes('.docs')) {
          const docsFiles = [
            'template/.docs/README.md',
            'template/.docs/master/DOC-ALL-ARCH-001.md'
          ];
          docsFiles.forEach(file => {
            processedCount++;
            if (processFile(file)) fixedCount++;
          });
        }
        if (filePattern.includes('.task')) {
          const taskFiles = [
            'template/.task/README.md',
            'template/.task/tasks/MIG-001.md'
          ];
          taskFiles.forEach(file => {
            processedCount++;
            if (processFile(file)) fixedCount++;
          });
        }
      } else {
        // Process a single file
        processedCount++;
        if (processFile(filePattern)) fixedCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing pattern ${filePattern}: ${error.message}`);
    }
  });
  
  console.log(`\nSummary: Processed ${processedCount} files, fixed ${fixedCount} files.`);
}

// Run the main function
main(); 