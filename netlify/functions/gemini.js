const fs = require('fs').promises;
const path = require('path');

// --- HELPER FUNCTION TO CALL THE GEMINI API ---
async function callGeminiAPI(apiKey, prompt) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        // Adding safety settings to prevent content blocking
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
        // Log the full response if the structure is unexpected
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

        // --- RESUME GENERATION (TWO-STEP PROCESS) ---
        if (mode === 'resume') {
            // STEP 1: AI Pre-analysis to get keywords
            const keywordExtractionPrompt = `Based on the following job description, extract the most critical skills, technologies, and experiences. Return ONLY a JSON array of strings. Example: ["React", "Project Management", "SaaS"].\n\nJob Description:\n\`\`\`${jobDescription}\`\`\``;
            
            const keywordsResponse = await callGeminiAPI(apiKey, keywordExtractionPrompt);
            
            let keywords = [];
            try {
                // Clean up the response to ensure it's valid JSON
                const cleanedResponse = keywordsResponse.trim().replace(/^```json\n/, '').replace(/\n```$/, '');
                keywords = JSON.parse(cleanedResponse);
            } catch (e) {
                console.error("Failed to parse keywords from AI response:", e);
                throw new Error("The AI failed to return a valid keyword list for filtering.");
            }

            // STEP 2: Filter the master profile based on keywords
            const profilePath = path.join(__dirname, 'master_profile.json');
            const masterProfileString = await fs.readFile(profilePath, 'utf8');
            const masterProfile = JSON.parse(masterProfileString);

            const filteredProfile = {
                ...masterProfile,
                professional_experience: masterProfile.professional_experience.filter(exp => 
                    keywords.some(kw => new RegExp(kw, 'i').test(JSON.stringify(exp)))
                ),
                projects: masterProfile.projects.filter(proj => 
                    keywords.some(kw => new RegExp(kw, 'i').test(JSON.stringify(proj)))
                ),
            };

            // STEP 3: Generate the resume with the filtered profile
            const resumeGenerationPrompt = `You are an elite AI resume writer. Your task is to create a perfectly tailored resume based on the provided Filtered Profile Database and a target Job Description.
            **1. GIVEN:**
               - **The \`Filtered Profile Database\`:** ${JSON.stringify(filteredProfile)}
               - **The \`Job Description\`:** \`\`\`${jobDescription}\`\`\`
            **2. TASK:**
               - Write a complete, tailored resume in Markdown format.
               - Ensure every section (Summary, Experience, Projects) is rewritten to specifically address the requirements in the Job Description, using the data from the Filtered Profile.
            **YOUR FINAL OUTPUT SHOULD BE ONLY THE COMPLETE, TAILORED RESUME IN MARKDOWN FORMAT, STARTING WITH THE NAME.**`;

            const finalResume = await callGeminiAPI(apiKey, resumeGenerationPrompt);
            return { statusCode: 200, body: finalResume };
        }

        // --- OTHER MODES (Cover Letter, Interview Prep, etc.) ---
        // The 'analyze' mode has been removed to prevent conflicts.
        const otherModesPrompt = {
            coverLetter: `Using the tailored resume provided below, write a compelling 3-4 paragraph cover letter for the job description. Focus on aligning the candidate's experience with the company's needs. Format as a professional letter.\n\nResume:\n${resumeText}\n\nJob Description:\n${jobDescription}`,
            interviewPrep: `As the hiring manager for the role described below, and having reviewed the candidate's resume, generate 6 insightful interview questions. The questions should probe the candidate's experience and fit for the role.\n\nResume:\n${resumeText}\n\nJob Description:\n${jobDescription}`,
            chatbot: `You are Mayur Mehta's personal AI assistant. Your persona is witty, helpful, and slightly informal. Based on your knowledge base, answer the following user query: "${userQuery}"`
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