const fs = require('fs');
const content = fs.readFileSync('exercises.js', 'utf-8');
const lines = content.split('\n');

const keywords = ['تصاعدي', 'تنازلي', 'أكبر', 'أصغر', 'رتب'];
console.log("Searching for keywords:", keywords.join(', '));

for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < keywords.length; j++) {
        if (lines[i].includes(keywords[j])) {
            console.log(`Line ${i + 1}: ${lines[i].trim()}`);
            break;
        }
    }
}
