const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'exams.js');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// The new data ends at line 191 `];`
// Line 192 and 193 are empty / comments roughly.
// The old code starts at line 194 `    duration: 45, // Minutes` and ends at 408 `];`
// We want to delete lines 194 to 409 (1-indexed). So we keep up to line 193, and from 410 onwards.

const newLines = [...lines.slice(0, 193), ...lines.slice(409)];
fs.writeFileSync(filePath, newLines.join('\n'));
console.log('Fixed exams.js');
