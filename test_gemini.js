const API_KEY = 'AQ.Ab8RN6IDNj1NSmAYaTngrpG3bpKcbBrYI2ekXR8rAO0MiqzINg';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello" }] }]
    })
}).then(res => res.json()).then(data => {
    console.log(JSON.stringify(data, null, 2));
}).catch(err => {
    console.error("Error:", err);
});
