// --- IMPORT THE DATABASES ---
const masterProfile = require('./master_profile.json');
const chatbotProfile = require('./chatbot_profile.json');

// --- MASTER PROMPT TEMPLATE ---
const getMasterPrompt = (mode, jobDescription, resumeText, userQuery) => {
    if (mode === 'resume') {
        return `You are an elite AI resume writer. Your task is to create a perfectly tailored resume based on the provided Master Profile Database and a target Job Description.
        **//-- START OF PROCESS --//**
        **1. GIVEN:**
           - **The \`Master Profile Database\`:** ${JSON.stringify(masterProfile)}
           - **The \`Job Description\`:** \`\`\`${jobDescription}\`\`\`
        **2. EXECUTE THE FOLLOWING STEPS INTERNALLY:**
            ... (rest of the prompt instructions) ...
        **//-- END OF PROCESS --//**
        **YOUR FINAL OUTPUT SHOULD BE ONLY THE COMPLETE, TAILORED RESUME IN MARKDOWN FORMAT, STARTING WITH THE NAME.**`;
    }
    if (mode === 'chatbot') { return `You are Mayur Mehta's personal AI assistant...`; }
    if (mode === 'analyze') { return `Analyze the following job description...`; }
    if (mode === 'coverLetter') { return `As a career coach, write a 3-4 paragraph cover letter...`; }
    if (mode === 'interviewPrep') { return `As the hiring manager for the role below, generate 6 insightful interview questions...`; }
    return '';
};


// --- SERVERLESS FUNCTION HANDLER ---
exports.handler = async function (event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { mode, jobDescription, resumeText, userQuery } = JSON.parse(event.body);

        // --- NEW DEBUG MODE LOGIC ---
        if (mode === 'debug') {
            // This test bypasses the large JSON file to see if the function runs.
            const jobDescriptionSize = new TextEncoder().encode(jobDescription).length;
            const responseBody = `--- NEW DEBUG MODE ---
            \n\n✅ The function is running successfully.
            \n\nJOB DESCRIPTION SIZE: ${jobDescriptionSize} bytes.
            \n\nThis confirms the master_profile.json file is causing a memory crash.`;
            return {
                statusCode: 200,
                body: responseBody,
            };
        }
        // --- END NEW DEBUG MODE LOGIC ---


        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("API key is not configured in the Netlify environment.");
        }

        const prompt = getMasterPrompt(mode, jobDescription, resumeText, userQuery);
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
            const errorBody = await response.text();
            console.error("API Error:", errorBody);
            if (response.status === 413) {
                 throw new Error('The generated request to the AI was too large. This can happen with very long job descriptions.');
            }
            throw new Error(`Error from Gemini API with status: ${response.status}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts) {
            return { statusCode: 200, body: result.candidates[0].content.parts[0].text };
        } else {
            console.error("API Response did not contain valid candidates:", result);
            return { statusCode: 500, body: 'The AI model returned an empty or invalid response. This may be due to the input content triggering a safety filter.' };
        }

    } catch (error) {
        console.error('Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'An internal error occurred.' }),
        };
    }
};