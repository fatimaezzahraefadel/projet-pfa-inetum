const fs = require('fs');
const https = require('https');

async function run() {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'REMOVED_OPENROUTER_API_KEY';
    
    // Generate 50 mock candidates
    const candidatesInfo = [];
    for(let i=1; i<=50; i++) {
        const pastTickets = [];
        for(let j=0; j<6; j++) {
            pastTickets.push({
                title: 'Ticket ' + i + '-' + j,
                nature: 'Bug',
                module: 'SD',
                status: 'DONE'
            });
        }
        candidatesInfo.push({
            id: 'uuid-' + i,
            name: 'Consultant ' + i,
            role: 'CONSULTANT_TECHNIQUE',
            skills: ['ABAP', 'SAP Fiori', 'OData'],
            availabilityPercent: 100,
            pastAndCurrentTickets: pastTickets
        });
    }

    const systemPrompt = `You are an AI Dispatch system for an IT consulting company. Your job is to recommend the top 3 best technical consultants to assign to a specific ticket.
You must return the result as a raw JSON array (do NOT wrap in markdown \`\`\`json block).
Each object in the array must strictly follow this structure:
{
  "userId": "uuid-of-user",
  "userName": "Name of user",
  "userRole": "Role of user",
  "score": 85.5, // Total score out of 100
  "factors": {
    "availabilityScore": 90, // out of 100 based on availabilityPercent
    "skillsMatchScore": 80, // out of 100 based on matching skills & technologies mastered
    "similarTicketsScore": 60 // out of 100 based on if they already worked on a subject like the ticket
  },
  "explanation": "Brief explanation of why this user is recommended, mentioning their availability, matching skills, and past similar tickets."
}
Analyze the ticket need (besoin du ticket) and the candidates. You MUST base your recommendation on:
1. The ticket's need.
2. The consultants' skills and technologies they master.
3. Their availability.
4. Whether they have already worked on a subject like the ticket.
Give priority to those with matching skills, high availability, and relevant past experience on similar tickets.
`;

    const userPrompt = `
Ticket to assign:
- Title: NEW: Correction dump ABAP sur module SD
- Description: N/A
- Nature: Bug
- Module: SD
- Complexity: Medium
- Priority: High

Available Candidates:
${JSON.stringify(candidatesInfo, null, 2)}
`;

    const payload = {
        model: 'google/gemini-2.5-flash',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 1500
    };

    console.log('Sending request to OpenRouter... Payload length:', JSON.stringify(payload).length);
    const start = Date.now();

    const postData = JSON.stringify(payload);
    const options = {
        hostname: 'openrouter.ai',
        path: '/api/v1/chat/completions',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'Ticket-CAP Performance Dashboard'
        }
    };

    const req = https.request(options, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`Response received in ${Date.now() - start}ms. Status: ${res.statusCode}`);
            if (res.statusCode !== 200) {
                console.error('Error:', data);
            } else {
                const json = JSON.parse(data);
                console.log('Result:', json.choices?.[0]?.message?.content);
            }
        });
    });

    req.on('error', e => console.error(e));
    req.write(postData);
    req.end();
}

run();
