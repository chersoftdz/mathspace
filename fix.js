const fs = require('fs');

const filePath = 'c:\\Users\\LENOVO\\Desktop\\فضاء الرياضيات\\exams.js';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// The new data ends at line 191 `];`
// We want to keep 0 to 193.
const newLines = [...lines.slice(0, 193), ...lines.slice(409)];
fs.writeFileSync(filePath, newLines.join('\n'));
console.log('Fixed exams.js successfully');
