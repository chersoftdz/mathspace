const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'exercises.js');
let content = fs.readFileSync(filePath, 'utf8');

// استبدال النجمة برمز الضرب عبر البحث العادي
content = content.replace(/\*/g, '×');

fs.writeFileSync(filePath, content, 'utf8');
console.log('تم تحويل جميع إشارات (*) إلى (×) بنجاح.');
