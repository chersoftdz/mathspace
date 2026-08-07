const fs = require('fs');

const code = fs.readFileSync('c:/Users/LENOVO/Desktop/فضاء الرياضيات/index.html', 'utf8');

let tags = [];
let lines = code.split('\n');
const tagPattern = /<\/?[a-zA-Z0-9]+[^>]*>/g;

for (let i = 0; i < lines.length; i++) {
    let match;
    while ((match = tagPattern.exec(lines[i])) !== null) {
        let tagStr = match[0];

        if (tagStr.endsWith('/>')) continue; // self closing

        let tagNameMatch = tagStr.match(/<\/?([a-zA-Z0-9]+)/);
        if (!tagNameMatch) continue;

        let tagName = tagNameMatch[1];
        if (['img', 'input', 'br', 'hr', 'link', 'meta'].includes(tagName.toLowerCase())) {
            continue;
        }

        if (tagStr.startsWith('</')) {
            if (tags.length === 0) {
                console.log(`Error: Found closing </${tagName}> at line ${i + 1}, but no open tag.`);
                process.exit(1);
            }
            let last = tags.pop();
            if (last.name !== tagName) {
                console.log(`Error: Mismatched tag at line ${i + 1}! Expected </${last.name}> (opened at ${last.line}), found </${tagName}>`);
                console.log(`Opening tag was: ${last.full}`);
                process.exit(1);
            }
        } else {
            tags.push({ name: tagName, line: i + 1, full: tagStr });
        }
    }
}

if (tags.length > 0) {
    console.log("Unclosed tags remaining:");
    tags.forEach(t => console.log(`  <${t.name}> opened at ${t.line}`));
} else {
    console.log("All tags perfectly matched!");
}
