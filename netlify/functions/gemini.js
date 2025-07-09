// BUNDLE THE DATABASE DIRECTLY INTO THE FUNCTION
// By using require(), the Netlify build process includes the JSON data,
// which prevents any file path issues in the serverless environment.
const masterProfile = require('./master_profile.json');

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

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

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
        throw new Error('The AI model returned an empty or invalid response. This may be due to the input content triggering a safety filter.');
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

        if (!apiKey) {
            throw new Error("API key is not configured in the Netlify environment.");
        }

        if (mode === 'resume') {
            // This is a single, powerful prompt that leverages the AI's relational understanding.
            const resumeGenerationPrompt = `
You are an elite AI career strategist and resume writer. Your task is to create a perfectly tailored resume by performing a deep, relational analysis of a candidate's full professional history against a target job description.

**CRITICAL RULES:**
1.  **Strict Grounding:** You MUST NOT invent, embellish, or infer any facts, figures, or details that are not explicitly present in the \`Master Profile Database\`. All output must be 100% traceable to the provided source data.
2.  **No Hallucinations:** Do not add any information that is not in the master profile.

**Your "Chain of Thought" Process:**
1.  **Analyze the Job Description:** First, deeply comprehend the provided \`Job Description\`. Identify the core responsibilities, essential skills (both hard and soft), key technologies, and the underlying business goals. Look beyond just the keywords.
2.  **Analyze the Master Profile:** Next, review the candidate's entire \`Master Profile Database\`. Understand the narrative of their career and the impact of each project.
3.  **Synthesize and Select:** Based on your analysis, strategically select the most relevant roles and projects from the Master Profile that best demonstrate the candidate's fitness for the role described in the Job Description. Prioritize experiences that solve similar problems or showcase the most critical required competencies.
4.  **Rewrite and Tailor:** Generate the resume content. Rewrite the summary and the bullet points for the selected experiences to speak directly to the needs and language of the Job Description. Quantify results wherever possible, using only the numbers present in the source data.
5.  **Final Verification:** Before producing the final output, perform a final cross-check of the resume you have generated against the \`Master Profile Database\`. Ensure that every detail, date, and metric is 100% accurate and correctly attributed.

**GIVEN DATA:**
* **The \`Master Profile Database\`:** ${JSON.stringify(masterProfile)}
* **The \`Job Description\`:** \`\`\`${jobDescription}\`\`\`

**YOUR FINAL OUTPUT:**
Produce only the complete, tailored resume in Markdown format, starting with the candidate's name. Do not include any of your analysis or commentary in the final output.
`;

            const finalResume = await callGeminiAPI(apiKey, resumeGenerationPrompt);
            return { statusCode: 200, body: finalResume };
        }

        // --- OTHER MODES (Cover Letter, Interview Prep, etc.) ---
        const otherModesPrompt = {
            coverLetter: `Using the tailored resume provided below, write a compelling 3-4 paragraph cover letter for the job description...`,
            interviewPrep: `As the hiring manager for the role described below...`,
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
