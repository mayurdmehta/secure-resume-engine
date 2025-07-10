// This function fetches the master profile from a public URL at runtime.
async function getMasterProfile() {
    const profileUrl = `https://mayur-mehta-portfolio.netlify.app/master_profile.json`; 
    try {
        const response = await fetch(profileUrl);
        if (!response.ok) throw new Error(`Failed to fetch master profile with status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching master profile:", error);
        throw new Error("Could not load the master profile data.");
    }
}

// --- HELPER FUNCTION TO CALL THE GEMINI API ---
async function callGeminiAPI(apiKey, prompt) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ],
    };
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Gemini API Error:", errorBody);
        throw new Error(`Error from Gemini API with status: ${response.status}`);
    }
    const result = await response.json();
    if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts) {
        return result.candidates[0].content.parts[0].text;
    } else {
        console.error("API Response did not contain valid candidates:", JSON.stringify(result, null, 2));
        throw new Error('The AI model returned an empty or invalid response.');
    }
}

// --- SERVERLESS FUNCTION HANDLER ---
exports.handler = async function (event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { mode, jobDescription, resumeText, userQuery } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("API key is not configured.");

        // --- RESUME GENERATION MODE ---
        if (mode === 'generate') {
            const masterProfile = await getMasterProfile();
            const resumeGenerationPrompt = `...`; // Unchanged prompt from previous version
            const finalResume = await callGeminiAPI(apiKey, resumeGenerationPrompt);
            return { statusCode: 200, body: finalResume };
        }

        // --- COVER LETTER GENERATION MODE ---
        if (mode === 'coverLetter') {
            const masterProfile = await getMasterProfile();
            const coverLetterPrompt = `
You are an expert career coach writing a cover letter for a client. Your task is to create a compelling, professional, and human-sounding cover letter based on the client's full professional history and a target job description.

**CRITICAL RULES:**
1.  **Strict Grounding:** Base the letter entirely on the facts provided in the \`Master Profile Database\`. Do not invent or embellish any details.
2.  **Highlight Reel, Not a Summary:** Do not simply summarize the resume. Instead, select the 2-3 most impactful projects or accomplishments from the Master Profile that directly align with the core needs of the Job Description and build a narrative around them.
3.  **Tone Matching:** The tone of the cover letter MUST mirror the professional tone of the \`Job Description\`.
4.  **Structure:** The letter should be 3-4 paragraphs. Start with a strong opening that grabs the reader's attention, use the body paragraphs to connect your selected accomplishments to the employer's problems, and end with a confident call to action.
5.  **AI Persona:** Do not mention that you are an AI or that the letter was generated.

**GIVEN DATA:**
* **The \`Master Profile Database\`:** ${JSON.stringify(masterProfile)}
* **The \`Job Description\`:** \`\`\`${jobDescription}\`\`\`

**YOUR FINAL OUTPUT:**
Produce only the complete, tailored cover letter.
`;
            const finalCoverLetter = await callGeminiAPI(apiKey, coverLetterPrompt);
            return { statusCode: 200, body: finalCoverLetter };
        }

        // --- OTHER MODES (Interview Prep, Chatbot) ---
        const otherModesPrompt = {
            interviewPrep: `As the hiring manager for the role described below, and having reviewed the candidate's resume, generate 6 insightful interview questions...`,
            chatbot: `You are Mayur Mehta's personal AI assistant...`
        }[mode];

        if (!otherModesPrompt) {
            return { statusCode: 400, body: 'Invalid mode provided.' };
        }

        const resultText = await callGeminiAPI(apiKey, otherModesPrompt);
        return { statusCode: 200, body: resultText };

    } catch (error) {
        console.error('Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'An internal error occurred.' }),
        };
    }
};