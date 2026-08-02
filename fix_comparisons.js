const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'exercises.js');
let content = fs.readFileSync(filePath, 'utf-8');

// The user originally reversed < and > in the curriculum because of RTL issues.
// For example: 8.09 > 8.90 was used to mean "8.09 is less than 8.90" (reading right to left).
// And < was used to mean "greater than".
// We need to find options: [">", "<", "="] and their answers and swap < and > where they were wrongly set.

// Let's do a search and replace on specific exercise patterns.

let changes = 0;

// find instances of options: [">", "<", "="] or similar
// If an answer is ">", it was meaning "less than", so now it should be "<".
// Wait, if it was 8.09 ... 8.90, the option in standard math is <.
// If the answer was originally set to ">", we need to change it to "<".
// Let's just swap < and > in all answer fields where options are just symbols.
// Also swap < and > in solution fields.

content = content.replace(/"answer":\s*">"/g, '"answer": "###TEMP_LT###"');
content = content.replace(/"answer":\s*"<"/g, '"answer": ">"');
content = content.replace(/"answer":\s*"###TEMP_LT###"/g, '"answer": "<"');

content = content.replace(/answer:\s*">"/g, 'answer: "###TEMP_LT###"');
content = content.replace(/answer:\s*"<"/g, 'answer: ">"');
content = content.replace(/answer:\s*"###TEMP_LT###"/g, 'answer: "<"');

// Fix strings like "تذكر: > تعني أصغر من"
content = content.replace(/تذكر: > تعني أصغر من/g, 'تذكر: < تعني أصغر من');
content = content.replace(/تذكر: < تعني أكبر من/g, 'تذكر: > تعني أكبر من');
content = content.replace(/تذكر > تعني أصغر من/g, 'تذكر: < تعني أصغر من');
content = content.replace(/تذكر < تعني أكبر من/g, 'تذكر: > تعني أكبر من');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Done modifying comparisons');
