// BUNDLE THE DATABASE DIRECTLY INTO THE FUNCTION
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
            const resumeGenerationPrompt = `...`; // Prompt is unchanged but kept for context

            // --- ISOLATION TEST ---
            // We are temporarily bypassing the actual API call to test the function's health.
            return { statusCode: 200, body: "Isolation Test Successful! The function is running." };

            const finalResume = await callGeminiAPI(apiKey, resumeGenerationPrompt);
            return { statusCode: 200, body: finalResume };
        }

        // --- OTHER MODES ---
        // ... (rest of the function is unchanged)

    } catch (error) {
        console.error('Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'An internal error occurred.' }),
        };
    }
};
