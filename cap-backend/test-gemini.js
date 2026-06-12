const apiKey = 'REMOVED_GCP_API_KEY';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ contents: [{ parts: [{ text: 'test' }] }] })
}).then(r => r.text()).then(console.log).catch(console.error);
