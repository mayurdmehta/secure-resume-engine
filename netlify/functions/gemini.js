// --- IMPORT THE DATABASES ---
const masterProfile = require('./master_profile.json');
const chatbotProfile = require('./chatbot_profile.json');

// --- HELPER: Call the Gemini API ---
async function callGeminiAPI(prompt, apiKey) {
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
        throw new Error(`Error from Gemini API with status: ${response.status}`);
    }

    const result = await response.json();
    if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts) {
        return result.candidates[0].content.parts[0].text;
    } else {
        console.error("API Response did not contain valid candidates:", result);
        throw new Error('The AI model returned an empty or invalid response.');
    }
}

// --- HELPER: Select relevant projects based on keywords ---
function selectRelevantProjects(keywords, profile) {
    const keywordSet = new Set(keywords.map(k => k.toLowerCase()));
    if (keywordSet.size === 0) { // Fallback if no keywords are extracted
        return profile; // Return the full profile if keyword extraction fails
    }

    const scoredProjects = profile.experience.flatMap(exp =>
        exp.projects.map(project => {
            const summaryWords = new Set((project.summary || '').toLowerCase().match(/\b(\w+)\b/g) || []);
            const score = [...keywordSet].filter(keyword => summaryWords.has(keyword)).length;
            return { ...project, score, company: exp.company, title: exp.title, dates: exp.dates };
        })
    );

    scoredProjects.sort((a, b) => b.score - a.score);
    const topProjects = scoredProjects.slice(0, 10); // Take the top 10 projects overall

    const projectsByCompany = {};
    for (const project of topProjects) {
        if (!projectsByCompany[project.company]) {
            projectsByCompany[project.company] = [];
        }
        projectsByCompany[project.company].push(project);
    }

    const relevantExperience = Object.values(projectsByCompany).map(companyProjects => ({
        company: companyProjects[0].company,
        title: companyProjects[0].title,
        dates: companyProjects[0].dates,
        projects: companyProjects.map(({ id, title, summary }) => ({ id, title, summary }))
    }));

    return { ...profile, experience: relevantExperience };
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
            throw new Error("API key is not configured.");
        }

        let prompt;

        if (mode === 'resume') {
            // STEP 1: Analyze the job description for keywords
            const analysisPrompt = `Analyze the following job description and extract the top 15 most important technical skills, methodologies, and concepts. Return them as a simple JSON array of strings. Example: ["SaaS Implementation", "Oracle EBS", "Agile", "Data Governance"].\n\n**Job Description:**\n\`\`\`${jobDescription}\`\`\``;
            const keywordsText = await callGeminiAPI(analysisPrompt, apiKey);
            const keywords = JSON.parse(keywordsText);

            // STEP 2: Use keywords to select relevant data and build the final prompt
            const relevantProfile = selectRelevantProjects(keywords, masterProfile);
            prompt = `You are an elite AI resume writer. Your task is to create a perfectly tailored resume based on the provided RELEVANT portions of a Master Profile Database and a target Job Description.
            **GIVEN:**
               - **The \`Relevant Profile Data\`:** ${JSON.stringify(relevantProfile)}
               - **The \`Job Description\`:** \`\`\`${jobDescription}\`\`\`
            **EXECUTE:**
               - Analyze the job description.
               - From the RELEVANT data, select the best projects to highlight.
               - Generate a new professional summary and core competencies section.
               - **CRITICAL INSTRUCTION FOR BULLET POINTS:** Rewrite each accomplishment into a single, concise, and powerful bullet point.
                 - **STRUCTURE:** Start with a strong action verb or a quantifiable result. Use the active voice.
                 - **SYNTHESIZE, DON'T PARAPHRASE:** Create a new, powerful sentence from the source data.
                 - **TONE & LENGTH:** Match the job description's style. Max two lines per bullet.
                 - **CLEAN OUTPUT:** Do NOT include internal IDs or arrows.
               - Assemble the resume in Markdown with bullet counts (RH:5, LM:3, AK:5).
               - Verify for 100% accuracy. No hallucinations.
            **EXPECTED OUTPUT:** A complete, tailored resume in Markdown format.`;

        } else if (mode === 'chatbot') {
            const conciseProfile = `Name: ${chatbotProfile.contactInfo.name}. Professional Summary: A Senior Business Systems Analyst and Technical Program Manager with over 6 years of experience...`; // A very short summary
            prompt = `You are Mayur Mehta's personal AI assistant. Your knowledge is strictly limited to the information in the provided Knowledge Base. If asked about something not covered, politely decline.
            **Knowledge Base:** ${JSON.stringify(chatbotProfile)}
            **User's Question:** "${userQuery}"
            Based ONLY on the database, provide a helpful and concise answer.`;
        } else {
            // Simplified prompts for other modes to reduce size
            if (mode === 'analyze') { prompt = `Analyze the following job description and produce a structured JSON "Blueprint" containing: \`targetRole\`, \`top5HardSkills\`, \`top3CulturalTraits\`, \`writingStyle\`, and \`coreProblem\`. \n\n**Job Description:**\n\`\`\`${jobDescription}\`\`\``; }
            if (mode === 'coverLetter') { prompt = `As a career coach, write a 3-4 paragraph cover letter for the following job, using the provided resume. Highlight 2-3 key accomplishments. Address it to the 'Hiring Team'.\n**Job:** \`\`\`${jobDescription}\`\`\`\n**Resume:** \`\`\`${resumeText}\`\`\``; }
            if (mode === 'interviewPrep') { prompt = `As the hiring manager for the role below, generate 6 insightful interview questions based on the candidate's resume. Mix behavioral and technical questions.\n**Job:** \`\`\`${jobDescription}\`\`\`\n**Resume:** \`\`\`${resumeText}\`\`\``; }
        }

        if (!prompt) {
            return { statusCode: 400, body: 'Invalid mode provided.' };
        }

        const resultText = await callGeminiAPI(prompt, apiKey);
        return { statusCode: 200, body: resultText };

    } catch (error) {
        console.error('Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'An internal error occurred.' }),
        };
    }
};