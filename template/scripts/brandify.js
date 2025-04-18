#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const brandBlock = `<!-- Brand: Montserrat, Blue/Red/Green, JustEcosystem -->\n![Logo](https://raw.githubusercontent.com/VyasSathya/JustEcosystem/main/brand/logo.svg)\n<style>body { font-family: Montserrat, Arial, sans-serif; }</style>\n`;

function updateBrandInReadme(readmePath) {
  let content = fs.readFileSync(readmePath, 'utf8');
  if (!content.includes('<!-- Brand:')) {
    content = brandBlock + '\n' + content;
    fs.writeFileSync(readmePath, content, 'utf8');
    console.log(`✅ Brand block added to ${readmePath}`);
  } else {
    console.log(`ℹ️ Brand block already present in ${readmePath}`);
  }
}

const readmePath = path.resolve(process.cwd(), 'README.md');
if (fs.existsSync(readmePath)) {
  updateBrandInReadme(readmePath);
} else {
  console.error('❌ README.md not found.');
  process.exit(1);
}
