// --- IMPORT THE DATABASES ---
const masterProfile = require('./master_profile.json');
const chatbotProfile = require('./chatbot_profile.json');

// --- MASTER PROMPT TEMPLATE ---
const getMasterPrompt = (mode, jobDescription, resumeText, userQuery) => {
    if (mode === 'resume') {
        // This prompt now sends the full database and asks the AI to perform the analysis and generation in one step.
        // This is more robust and avoids complex, error-prone multi-step logic in our code.
        return `You are an elite AI resume writer. Your task is to create a perfectly tailored resume based on the provided Master Profile Database and a target Job Description.

**//-- START OF PROCESS --//**

**1. GIVEN:**
   - **The \`Master Profile Database\`:** ${JSON.stringify(masterProfile)}
   - **The \`Job Description\`:** \`\`\`${jobDescription}\`\`\`

**2. EXECUTE THE FOLLOWING STEPS INTERNALLY:**
   - **Step A: Analyze the Job Description.** Identify the most critical skills, the company's tone, and the core problem the role solves.
   - **Step B: Select Relevant Accomplishments.** From the full Master Profile Database, intelligently select the most relevant projects and accomplishments that align with the job description analysis.
   - **Step C: Generate the Resume Content.**
     - Write a new, targeted Professional Summary and a "Core Competencies" section.
     - For each selected accomplishment, synthesize its key details into a single, concise, and powerful bullet point.
     - **CRITICAL BULLET POINT RULES:**
       - **STRUCTURE:** Each bullet point MUST start with a strong action verb (e.g., Led, Delivered, Increased) or a quantifiable result (e.g., Achieved $4M in savings...). The sentence must be in the **active voice**.
       - **SYNTHESIZE, DON'T PARAPHRASE:** Create a new, powerful sentence from the source data. Do not just rephrase the long summaries.
       - **TONE & LENGTH:** Match the job description's writing style. Each bullet point must be no longer than two lines.
       - **CLEAN OUTPUT:** Do NOT include internal accomplishment IDs (e.g., RH01) or any arrows (->) in the final output.
   - **Step D: Assemble the Final Resume.**
     - Format the output as clean Markdown.
     - Adhere to the strict bullet point counts: Robert Half: 5, LilacMosaic: 3, Akamai: 5.
     - Ensure 100% accuracy against the source data. Do not hallucinate or invent facts.

**//-- END OF PROCESS --//**

**YOUR FINAL OUTPUT SHOULD BE ONLY THE COMPLETE, TAILORED RESUME IN MARKDOWN FORMAT, STARTING WITH THE NAME.**`;
    }
    if (mode === 'chatbot') {
        const conciseProfile = `Name: ${chatbotProfile.contactInfo.name}. Professional Summary: A Senior Business Systems Analyst and Technical Program Manager with over 6 years of experience...`;
        return `You are Mayur Mehta's personal AI assistant. Your knowledge is strictly limited to the information in the provided Knowledge Base. If asked about something not covered, politely decline.
        **Knowledge Base:** ${JSON.stringify(chatbotProfile)}
        **User's Question:** "${userQuery}"
        Based ONLY on the database, provide a helpful and concise answer.`;
    }
    if (mode === 'analyze') { return `Analyze the following job description and produce a structured JSON "Blueprint" containing: \`targetRole\`, \`top5HardSkills\`, \`top3CulturalTraits\`, \`writingStyle\`, and \`coreProblem\`. \n\n**Job Description:**\n\`\`\`${jobDescription}\`\`\``; }
    if (mode === 'coverLetter') { return `As a career coach, write a 3-4 paragraph cover letter for the following job, using the provided resume. Highlight 2-3 key accomplishments. Address it to the 'Hiring Team'.\n**Job:** \`\`\`${jobDescription}\`\`\`\n**Resume:** \`\`\`${resumeText}\`\`\``; }
    if (mode === 'interviewPrep') { return `As the hiring manager for the role below, generate 6 insightful interview questions based on the candidate's resume. Mix behavioral and technical questions.\n**Job:** \`\`\`${jobDescription}\`\`\`\n**Resume:** \`\`\`${resumeText}\`\`\``; }
    return '';
};


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
            // The 413 error specifically means the request was too large.
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