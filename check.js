const fs = require('fs');
const code = fs.readFileSync('games.js', 'utf8');
try {
    new Function(code);
    console.log('Syntax OK');
} catch (e) {
    console.log(e.stack);
}
