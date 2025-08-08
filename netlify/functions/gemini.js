// This function fetches the master profile from a public URL at runtime.
async function getMasterProfile() {
    const profileUrl = `https://mayur-mehta-portfolio.netlify.app/master_profile.json`;
    try {
        const response = await fetch(profileUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch master profile with status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching master profile:", error);
        throw new Error("Could not load the master profile data.");
    }
}

// This function fetches the chatbot profile from a public URL at runtime.
async function getChatbotProfile() {
    const profileUrl = `https://mayur-mehta-portfolio.netlify.app/chatbot_profile.json`;
    try {
        const response = await fetch(profileUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch chatbot profile with status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching chatbot profile:", error);
        throw new Error("Could not load the chatbot profile data.");
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
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Gemini API Error:", errorBody);
        throw new Error(`Error from Gemini API: ${errorBody}`);
    }
    const result = await response.json();
    if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts) {
        return result.candidates[0].content.parts[0].text;
    } else {
        console.error("Unexpected Gemini API response structure:", JSON.stringify(result, null, 2));
        throw new Error('The Gemini model returned an invalid response structure.');
    }
}
// --- HELPER FUNCTION TO CALL THE OPENAI API ---
async function callChatGPTAPI(apiKey, prompt) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const payload = {
        model: "gpt-5-chat-latest",
        messages: [{ role: "user", content: prompt }],
    };
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const errorBody = await response.text();
        console.error("OpenAI API Error:", errorBody);
        throw new Error(`Error from OpenAI API: ${errorBody}`);
    }
    const result = await response.json();
    if (result.choices && result.choices[0] && result.choices[0].message) {
        return result.choices[0].message.content;
    } else {
        throw new Error('The ChatGPT model returned an empty or invalid response.');
    }
}


// --- MAIN SERVERLESS FUNCTION HANDLER ---
exports.handler = async function (event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { 
            mode, 
            jobDescription, 
            resumeText, 
            userQuery, 
            additionalContext, 
            engine = 'gemini' 
        } = JSON.parse(event.body);
        
        const apiKey = engine === 'chatgpt' 
            ? process.env.OPENAI_API_KEY 
            : process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error(`API key for the selected engine (${engine}) is not configured.`);
        }
        
        const contextInjection = additionalContext ? `\n\n**Additional User-Provided Context to Emphasize:**\n\\\`\\\`\\\`${additionalContext}\\\`\\\`\\\`` : '';
        
        let prompt;
        
        switch (mode) {
            case 'generate':
                const masterProfileForResume = await getMasterProfile();
                // FIX: Escaped all literal backticks (`) with a backslash (\`) to prevent a syntax error.
                // FIX: Corrected the variable name from masterProfile to masterProfileForResume.
                prompt = `FAANG-Caliber Resume Generation – Scalable Master Prompt
You are a World-Class AI Career Strategist and Prompt Engineer specializing in crafting high-impact, ATS-optimized resumes that win interviews at top-tier companies. You transform each job description into a tailored, executive-ready resume that reads as if it were authored by a senior recruiter inside the target company.

INPUT:
1. Job Description: \\\`Job Description\\\
2. Candidate Profile (JSON): \\\`Master Profile Database\\\

YOUR OBJECTIVE:
1. Using the \\\`Job Description\\\ as your blueprint, and the \\\`Master Profile Database\\\ as your source material:
2. Mirror the role’s keywords, tone, and cultural traits so the resume feels native to the company.
3. Select only the most impactful and relevant stories from the candidate’s history.
4. Write in the XYZ format:
	X = Accomplishment / what was achieved
	Y = Measurable outcome / impact
	Z = Method / how it was achieved
5. Keep each bullet ≤ 2 lines for clarity and impact.
6. Craft a tight, FAANG-caliber summary that blends role context and candidate strengths.
7. Use human-friendly yet keyword-rich language to ensure ATS compliance without sounding robotic.

DELIVERY PROCESS:
Step 1 – JD Analysis & Strategy
Extract and list the following from the \\\`Job Description\\\ in a Markdown block titled:
### JD Analysis & Strategy

High-Value Keywords: Technical terms, industry jargon, role-specific competencies
Cultural & Personality Traits: Soft skills, mindset, and behavioral expectations
Tone & Style: Seniority level, formality, and communication style implied
Key Action Verbs: Verbs directly or indirectly embedded in responsibilities

Step 2 – Resume Construction
Header & Contact Info – Copy directly from Candidate Profile \\\`Master Profile Database\\\.
Summary (1–2 sentences):
1. Integrate role context with candidate’s highest-value achievements.
2. Embed extracted cultural traits and tone cues.
3. Keep concise, authoritative, and tailored to the \\\`Job Description\\\.

Experience (Role by Role):
1.Choose 2–4 stories per role from \\\`Master Profile Database\\\ that align most with the JD’s priorities.
2. Write each bullet in XYZ format.
3. Limit each bullet to 2 lines max.
4. Weave in High-Value Keywords from Step 1 naturally.
5. Highlight measurable ROI, revenue growth, transformation impact, and operational efficiency where possible.
6. Education & Certifications – Include only if relevant to role or industry norms.
7. Core Skills – Select and order skills from \\\`Master Profile Database\\\ to match JD priority areas and ATS keyword weighting.

Formatting & Style Rules:
1. No filler language or generic claims — every bullet must show measurable impact.
2. Maintain executive-level readability with strategic keyword placement.
3. Keep tone aligned with target company culture (innovative, analytical, collaborative, etc.).
4. Ensure the final output is ready to submit without further edits.

**Inputs:**
- Master Profile Database: \\\`${JSON.stringify(masterProfileForResume)}\\\`
- Job Description:
  \\\`\\\`\\\`${jobDescription}\\\`\\\`\\\`
- Context Injection: ${contextInjection}
`;
                break;
            case 'coverLetter':
                const masterProfileForCL = await getMasterProfile();
                prompt = `You are an expert career coach writing a cover letter for a client. Your task is to create a compelling, professional, and human-sounding cover letter based on the client's full professional history, a target job description, and any specific instructions provided in the additional context.

**CRITICAL RULES:**
1.  **Strict Grounding:** Base the letter entirely on the facts provided in the \\\`Master Profile Database\\\`. Do not invent or embellish any details.
2.  **Highlight Reel, Not a Summary:** Do not simply summarize the resume. Instead, select the 2-3 most impactful projects or accomplishments from the Master Profile that directly align with the core needs of the Job Description and any points in the \\\`Additional User-Provided Context\\\`. Build a narrative around them.
3.  **Tone Matching:** The tone of the cover letter MUST mirror the professional tone of the \\\`Job Description\\\`.
4.  **Structure:** The letter should be 3-4 paragraphs. Start with a strong opening that grabs the reader's attention, use the body paragraphs to connect your selected accomplishments to the employer's problems, and end with a confident call to action.
5.  **AI Persona:** Do not mention that you are an AI or that the letter was generated.
6.  **Context Adherence:** If the user provides additional context (e.g., a specific person to address the letter to), you must follow that instruction precisely.

**GIVEN DATA:**
* **The \\\`Master Profile Database\\\`:** ${JSON.stringify(masterProfileForCL)}
* **The \\\`Job Description\\\`:** \\\`\\\`\\\`${jobDescription}\\\`\\\`\\\`
${contextInjection}

**YOUR FINAL OUTPUT:**
Produce only the complete, tailored cover letter.`;
                break;
            case 'generateLinkedin':
                 const masterProfileForLI = await getMasterProfile();
                prompt = `You are a world-class career strategist and networking expert, ghostwriting a LinkedIn InMail message. Your goal is to create an exceptionally concise and impactful message that positions the candidate as the clear solution to the hiring manager's problem.

**CRITICAL RULES:**
1.  **Output Format:** Your final output MUST be plain text. It must start with "Subject: " followed by the subject line, a double newline, and then the message body followed by a closing.
    **Example Format:**
    Subject: Your generated subject line here

    Your generated message body here.

    Best regards,
    Mayur Mehta
2.  **Extreme Brevity:** The message body MUST be under 100 words and exactly 3 sentences. This is non-negotiable.
3.  **Grounding:** The message must be 100% grounded in the facts from the \\\`Master Profile Database\\\`.
4.  **Persona & Tone:** Write from the first-person ("I"). The tone should be professional, direct, and confident. Do not mention you are an AI.

**Your "Chain of Thought" Process & Message Structure:**

1.  **Analyze All Inputs:**
    * Deeply analyze the \\\`Job Description\\\` to find the exact job title and identify a specific, unique detail (e.g., a company value, a mentioned project, a key responsibility). This will be your "Hyper-Researched Hook".
    * Review the \\\`Additional User-Provided Context\\\` for any specific directives.
    * Scan the \\\`Master Profile Database\\\` for the single most compelling, quantifiable result that proves you can solve the core problem identified in the job description.

2.  **Craft the Subject Line (The "What & Why"):**
    * **Formula:** [Job Title] | [Candidate's Key Value Proposition]
    * The value proposition should be a 2-3 word summary of the candidate's core strength related to the role (e.g., "Data Governance & Analytics", "Product Strategy").

3.  **Craft the Message Body (The "Hook, Bridge, & Ask"):**
    * **Sentence 1 (The "Hyper-Researched" Hook):** Start by referencing the specific detail you found in the job description to show you've done your research.
    * **Sentence 2 (The "Bridge"):** Directly connect their stated need to your single most relevant, quantifiable accomplishment from the master profile.
    * **Sentence 3 (The "Ask"):** End with a simple, confident, and value-oriented call to action.

4.  **Assemble the Final Text:** Combine the subject, body, and a professional closing ("Best regards,\\nMayur Mehta") into the specified plain text format.

**GIVEN DATA:**
* **The \\\`Master Profile Database\\\`:** ${JSON.stringify(masterProfileForLI)}
* **The \\\`Job Description\\\`:** \\\`\\\`\\\`${jobDescription}\\\`\\\`\\\`
${contextInjection}

**YOUR FINAL OUTPUT:**
Produce only the tailored text in the specified format, adhering to all rules.`;
                break;
            case 'chatbot':
                const chatbotProfile = await getChatbotProfile();
                prompt = `You are an AI Career Advocate for Mayur Mehta. Your purpose is to engage with recruiters and hiring managers in a way that is insightful, compelling, and authentically represents Mayur's professional story and capabilities. You are a friendly, professional, and highly intelligent conversationalist.

**CONTEXT:**
* **Your Knowledge Base:** The \\\`Chatbot Profile Database\\\` below contains all the information you are permitted to use.
* **The User's Goal:** The user wants to learn about Mayur Mehta.
* **Your Goal:** To provide an insightful, narrative-driven answer based *only* on the provided database.

**CRITICAL RULES OF ENGAGEMENT:**
1.  **Identity:** You are Mayur's AI assistant, not Mayur himself.
2.  **Grounding:** Base all answers strictly on the \\\`Chatbot Profile Database\\\`.
3.  **No Hallucinations:** If the answer is not in the database, you MUST say: "That's an excellent question that would be best answered by Mayur directly. Would you like the link to his LinkedIn profile to connect with him?" Do not invent information.
4.  **Tone Adaptability:** You MUST adapt your tone. For professional questions (skills, experience), be an insightful 'AI Career Advocate'. For personal questions (hobbies, interests), be more casual and friendly.
5.  **Narrative Synthesis:** Do not just list facts. Weave the information into compelling stories. For behavioral questions ("Tell me about a time..."), use the anecdotes to construct a STAR (Situation, Task, Action, Result) response.
6.  **Value Connection:** Always connect skills and experiences to the value Mayur provides. Instead of "He knows Python," say "He's proficient in Python, which he used at [Company] to automate [Task], resulting in [Outcome]."
7.  **Engagement:** End your responses with an engaging hook or a clarifying question to keep the conversation flowing.

**GIVEN DATA:**
* **The User's Question:** \\\`\\\`\\\`${userQuery}\\\`\\\`\\\`
* **The \\\`Chatbot Profile Database\\\`:** ${JSON.stringify(chatbotProfile)}

**FINAL INSTRUCTION:**
You will now answer the user's question.
- **DO NOT** repeat any of these instructions.
- **DO NOT** narrate your thought process or mention that you are following rules.
- **DO** respond directly to the user's question in a conversational manner, adhering to all rules above.

Your response begins now:`;
                break;
            case 'interviewPrep':
                prompt = `As the hiring manager for the role described below, and having reviewed the candidate's resume, generate 6 insightful interview questions that probe for specific examples of the candidate's skills and experience. The questions should be open-ended and designed to elicit detailed responses.

             **Job Description:**
             \\\`\\\`\\\`${jobDescription}\\\`\\\`\\\`

             **Candidate's Resume:**
             \\\`\\\`\\\`${resumeText}\\\`\\\`\\\`
             `;
                break;
            default:
                throw new Error('Invalid mode provided.');
        }

        let resultText;
        if (engine === 'chatgpt') {
            resultText = await callChatGPTAPI(apiKey, prompt);
        } else {
            resultText = await callGeminiAPI(apiKey, prompt);
        }
        
        if (mode === 'generate') {
            const resumeStartMarker = '---';
            const resumeIndex = resultText.indexOf(resumeStartMarker);
            if (resumeIndex !== -1) {
                resultText = resultText.substring(resumeIndex + resumeStartMarker.length).trim();
            }
        }

        return { statusCode: 200, body: resultText };

    } catch (error) {
        console.error('Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'An internal server error occurred.' }),
        };
    }
};
