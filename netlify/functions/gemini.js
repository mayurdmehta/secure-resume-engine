<!-- ======================================================================= -->
<!-- FILE: functions/gemini.js (Your NEW Backend)                            -->
<!-- ======================================================================= -->
```javascript
// This code goes in a file named `gemini.js` inside a `functions` or `netlify/functions` folder.

// --- MASTER PROMPT TEMPLATE ---
const getMasterPrompt = (mode, jobDescription, masterProfile, resumeText) => {
    // Resume Generation Prompt
    if (mode === 'resume') {
        return `
You are an advanced AI resume tailoring engine. Based on the provided Master Profile Database and the Job Description, create a perfectly tailored resume.
**//-- START OF PROCESS --//**
**1. GIVEN:**
   - **The \`Master Profile Database\`:** ${JSON.stringify(masterProfile)}
   - **The \`Job Description\`:** \`\`\`${jobDescription}\`\`\`
**2. EXECUTE:**
   - Analyze the job description to create a blueprint.
   - Score and select the most relevant accomplishments from the database.
   - Generate a new professional summary and core competencies section.
   - Rewrite the selected accomplishment summaries following these strict rules:
     - **Tone:** Match the job description's tone.
     - **Structure:** \`[Result/Quantifiable Metric]\` -> \`by [Task/Action]\` -> \`[Outcome/Business Objective/Method]\`.
     - **Clarity & Length:** Use simple language, max two lines per bullet.
   - Assemble the final resume in Markdown with the correct bullet counts (RH:5, LM:3, AK:5).
   - Verify for 100% accuracy against the source data. No hallucinations.
**//-- END OF PROCESS --//**
**EXPECTED OUTPUT:** A complete, tailored resume in Markdown format, starting with the name.`;
    }
    // Job Analysis Prompt
    if (mode === 'analyze') {
        return `Analyze the following job description and produce a structured JSON "Blueprint" containing: \`targetRole\`, \`top5HardSkills\`, \`top3CulturalTraits\`, \`writingStyle\`, and \`coreProblem\`. \n\n**Job Description:**\n\`\`\`${jobDescription}\`\`\``;
    }
    // Cover Letter Prompt
    if (mode === 'coverLetter') {
        return `You are a professional career coach. Based on the provided Job Description and the candidate's Tailored Resume, write a concise and professional cover letter. It should be 3-4 paragraphs. Highlight 2-3 of the most relevant accomplishments from the resume and connect them directly to the job's core requirements. Maintain a confident but humble tone. Address it to the 'Hiring Team'.
**Job Description:** \`\`\`${jobDescription}\`\`\`
**Tailored Resume:** \`\`\`${resumeText}\`\`\``;
    }
    // Interview Prep Prompt
    if (mode === 'interviewPrep') {
        return `You are the hiring manager for the role in the Job Description below. You are preparing to interview the candidate whose resume is also provided. Generate a list of 6 insightful interview questions. Include a mix of behavioral questions (using the STAR method format) and questions that probe their technical and program management experience. The questions should be specific to the resume and the job requirements.
**Job Description:** \`\`\`${jobDescription}\`\`\`
**Tailored Resume:** \`\`\`${resumeText}\`\`\``;
    }
    return ''; // Default empty prompt
};


// --- SERVERLESS FUNCTION HANDLER ---
exports.handler = async function (event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { mode, jobDescription, masterProfile, resumeText } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY; // Securely access the API key from environment variables

        if (!apiKey) {
            throw new Error("API key is not configured.");
        }

        const prompt = getMasterPrompt(mode, jobDescription, masterProfile, resumeText);
        if (!prompt) {
            return { statusCode: 400, body: 'Invalid mode provided.' };
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error("API Error:", await response.text());
            return { statusCode: response.status, body: 'Error from Gemini API.' };
        }

        const result = await response.json();
        
        if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts) {
            const resultText = result.candidates[0].content.parts[0].text;
            return {
                statusCode: 200,
                body: resultText,
            };
        } else {
            return { statusCode: 500, body: 'Invalid response structure from API.' };
        }

    } catch (error) {
        console.error('Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An internal error occurred.' }),
        };
    }
};