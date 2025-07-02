// --- IMPORT THE MASTER PROFILE DATABASE ---
const masterProfile = require('./master_profile.json');

// --- MASTER PROMPT TEMPLATE ---
const getMasterPrompt = (mode, jobDescription, resumeText) => {
    if (mode === 'resume') {
        return `You are an elite AI resume writer. Your task is to create a perfectly tailored resume based on the provided Master Profile Database and a target Job Description. The database is now structured holistically, with each project broken down into 'problem', 'actions', and 'outcomes'.

**//-- START OF PROCESS --//**

**1. GIVEN:**
   - **The \`Master Profile Database\`:** ${JSON.stringify(masterProfile)}
   - **The \`Job Description\`:** \`\`\`${jobDescription}\`\`\`

**2. EXECUTE:**
   - **Analyze Job:** Create an internal blueprint (targetRole, top5HardSkills, top3CulturalTraits, writingStyle, coreProblem).
   - **Select Projects:** From the database, select the most relevant **projects** based on the blueprint.
   - **Generate Content:**
     - Create a new Professional Summary and Core Competencies section.
     - **CRITICAL INSTRUCTION FOR BULLET POINTS:** For each selected project, you may construct one or more bullet points. To construct a bullet point:
       - **Select Components:** Intelligently select the most relevant 'action' and the most impactful 'outcome' from that project's data that aligns with the job blueprint.
       - **STRUCTURE:** Weave the selected components into a single, concise, and powerful sentence. Each bullet point MUST start with a strong action verb (e.g., Led, Delivered, Increased) or a quantifiable result (e.g., Achieved $4M in savings...). The sentence must be in the **active voice**.
       - **TONE & LENGTH:** Match the job description's writing style. The final bullet point must be no longer than two lines.
       - **CLEAN OUTPUT:** Do NOT include internal IDs (e.g., RH01) or arrows (->).
   - **Assemble Resume:**
     - Use Markdown format.
     - Bullet counts: Robert Half: 5, LilacMosaic: 3, Akamai: 5.
     - Verify for 100% accuracy against the source data. No hallucinations.

**//-- END OF PROCESS --//**

**EXPECTED OUTPUT:** A complete, tailored resume in Markdown format, starting with the name.`;
    }
    if (mode === 'analyze') { return `Analyze the following job description and produce a structured JSON "Blueprint" containing: \`targetRole\`, \`top5HardSkills\`, \`top3CulturalTraits\`, \`writingStyle\`, and \`coreProblem\`. \n\n**Job Description:**\n\`\`\`${jobDescription}\`\`\``; }
    if (mode === 'coverLetter') { return `You are a professional career coach. Based on the provided Job Description and the candidate's Tailored Resume, write a concise and professional cover letter. It should be 3-4 paragraphs. Highlight 2-3 of the most relevant accomplishments from the resume and connect them directly to the job's core requirements. Maintain a confident but humble tone. Address it to the 'Hiring Team'.\n**Job Description:** \`\`\`${jobDescription}\`\`\`\n**Tailored Resume:** \`\`\`${resumeText}\`\`\``; }
    if (mode === 'interviewPrep') { return `You are the hiring manager for the role in the Job Description below. You are preparing to interview the candidate whose resume is also provided. Generate a list of 6 insightful interview questions. Include a mix of behavioral questions (using the STAR method format) and questions that probe their technical and program management experience. The questions should be specific to the resume and the job requirements.\n**Job Description:** \`\`\`${jobDescription}\`\`\`\n**Tailored Resume:** \`\`\`${resumeText}\`\`\``; }
    return '';
};


// --- SERVERLESS FUNCTION HANDLER ---
exports.handler = async function (event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { mode, jobDescription, resumeText } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) { throw new Error("API key is not configured."); }

        const prompt = getMasterPrompt(mode, jobDescription, resumeText);
        if (!prompt) { return { statusCode: 400, body: 'Invalid mode provided.' }; }

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
            return { statusCode: response.status, body: 'Error from Gemini API.' };
        }

        const result = await response.json();
        
        if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts) {
            return { statusCode: 200, body: result.candidates[0].content.parts[0].text };
        } else {
            return { statusCode: 500, body: 'Invalid response structure from API.' };
        }

    } catch (error) {
        console.error('Function Error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'An internal error occurred.' }) };
    }
};