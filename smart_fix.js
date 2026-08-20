const fs = require('fs');
const path = require('path');
try {
    const desktopPath = 'c:\\Users\\LENOVO\\Desktop';
    const dirs = fs.readdirSync(desktopPath);
    const mathDir = dirs.find(d => d.includes('رياضيات') || d.includes('فضاء'));
    if (!mathDir) {
        console.error('Directory not found');
        process.exit(1);
    }
    const fullPath = path.join(desktopPath, mathDir, 'exams.js');
    console.log('Targeting:', fullPath);
    const txt = fs.readFileSync(fullPath, 'utf8');
    const lines = txt.split('\n');
    let oldCodeStart = -1;
    let oldCodeEnd = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('duration: 45, // Minutes') && oldCodeStart === -1) {
            oldCodeStart = i - 1; // back to the empty line before it
        }
        if (lines[i].includes('class ExamApp {') && oldCodeEnd === -1) {
            oldCodeEnd = i - 2; // back to before '// App Components'
        }
    }
    if (oldCodeStart !== -1 && oldCodeEnd !== -1) {
        const newText = lines.slice(0, oldCodeStart).concat(lines.slice(oldCodeEnd)).join('\n');
        fs.writeFileSync(fullPath, newText);
        console.log('Successfully fixed exams.js');
    } else {
        console.log('Could not find markers', oldCodeStart, oldCodeEnd);
    }
} catch (err) {
    console.error(err);
}
