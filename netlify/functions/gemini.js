// --- IMPORT THE DATABASES ---
const masterProfile = require('./master_profile.json'); // For Resume Engine
const chatbotProfile = require('./chatbot_profile.json'); // For Chatbot

// --- MASTER PROMPT TEMPLATE ---
const getMasterPrompt = (mode, jobDescription, resumeText, userQuery) => {
    if (mode === 'resume') {
        return `You are an elite AI resume writer. Your task is to create a perfectly tailored resume based on the provided Master Profile Database and a target Job Description.
        **//-- START OF PROCESS --//**
        **1. GIVEN:**
           - **The \`Master Profile Database\`:** ${JSON.stringify(masterProfile)}
           - **The \`Job Description\`:** \`\`\`${jobDescription}\`\`\`
        **2. EXECUTE:**
           - Analyze the job description to create a blueprint.
           - Score and select the most relevant projects from the database.
           - Generate a new professional summary and core competencies section.
           - **CRITICAL INSTRUCTION FOR BULLET POINTS:** Rewrite each selected accomplishment into a single, concise, and powerful bullet point.
             - **STRUCTURE:** Each bullet point MUST start with a strong action verb or a quantifiable result. The sentence must be in the **active voice**.
             - **SYNTHESIZE, DON'T PARAPHRASE:** Synthesize the most important action and outcome into a new, powerful sentence.
             - **TONE & LENGTH:** Match the job description's writing style. Max two lines per bullet.
             - **CLEAN OUTPUT:** Do NOT include internal IDs or arrows.
           - Assemble the final resume in Markdown with the correct bullet counts (RH:5, LM:3, AK:5).
           - Verify for 100% accuracy. No hallucinations.
        **//-- END OF PROCESS --//**
        **EXPECTED OUTPUT:** A complete, tailored resume in Markdown format, starting with the name.`;
    }
    if (mode === 'chatbot') {
        // FIX: Create a concise summary of the profile to prevent request size errors.
        const conciseProfile = `
        Name: ${chatbotProfile.contactInfo.name}
        Professional Summary: A Senior Business Systems Analyst and Technical Program Manager with over 6 years of experience, specializing in process automation, AI/ML implementation, and data-driven strategy.

        Experience Overview:
        - At Robert Half, he led data governance initiatives, managed AI platform integrations, and reengineered key business processes.
        - As a co-founder at LilacMosaic Technologies, he drove product strategy from concept to launch for an AI-powered platform and implemented the Agile framework from scratch.
        - At Akamai Technologies, he managed large-scale financial system migrations for Tax, Expense, and Payments, delivering significant cost savings and efficiency improvements.

        Personal Journey: ${chatbotProfile.myJourney.story}
        Guiding Principles: ${chatbotProfile.guidingPrinciples.principles.join(' ')}
        Hobbies: ${chatbotProfile.outsideOfWork.hobbies.map(h => `${h.name}: ${h.anecdote}`).join('; ')}
        Fun Facts: ${chatbotProfile.funFacts.facts.join(' ')}
        `;

        return `You are Mayur Mehta's personal AI assistant. Your purpose is to answer questions from visitors like recruiters or hiring managers.
        **CRITICAL RULE:** Your knowledge is strictly limited to the information contained in the summarized Knowledge Base provided below. Do NOT answer any questions outside of this context. If a question is about a topic not covered in the database (e.g., personal opinions on politics), you must politely decline to answer, stating that your knowledge is limited to Mayur's professional and personal profile.

        **Knowledge Base (A summary of Mayur's profile):**
        ${conciseProfile}

        **User's Question:**
        "${userQuery}"

        Based ONLY on the provided knowledge base, provide a helpful and concise answer to the user's question.`;
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
        const { mode, jobDescription, resumeText, userQuery } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) { throw new Error("API key is not configured."); }

        const prompt = getMasterPrompt(mode, jobDescription, resumeText, userQuery);
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
