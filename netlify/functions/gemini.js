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
        // START: Destructure additionalContext from the request body
        const { mode, jobDescription, resumeText, userQuery, additionalContext } = JSON.parse(event.body);
        // END: Destructure additionalContext
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("API key is not configured.");
        }
        
        // START: Create a reusable context string to be injected into prompts
        const contextInjection = additionalContext ? `\n\n**Additional User-Provided Context to Emphasize:**\n\`\`\`${additionalContext}\`\`\`` : '';
        // END: Create a reusable context string

        // --- RESUME GENERATION MODE ---
        if (mode === 'generate') {
            const masterProfile = await getMasterProfile();
            // START: Inject context into the prompt
            const resumeGenerationPrompt = `
You are an elite AI career strategist and master storyteller. Your mission is to create a 'mirror resume' that is so perfectly tailored it feels like it was written by a human expert specifically for the target role.

**Your Strategic Process (Two Phases):**
Your output will be in two parts, separated by a Markdown horizontal rule (\`---\`).

**Phase 1: The Strategic Analysis**
First, as an analyst, you will deconstruct the **Job Description**. Your goal is to understand the role's DNA. You will output this analysis in a well-formatted Markdown block titled \`### **Resume Analysis & Strategy**\`, identifying:
* **Job Title:** The exact title.
* **Cultural Fit Traits:** Key cultural and personality traits the employer is looking for.
* **High-Value Keywords:** The core technical terms and business nouns central to the role.
* **Employer's Action Verbs:** The key verbs used to describe responsibilities.

**Phase 2: The Narrative Synthesis (The Resume)**
Immediately after the separator, you will embody the role of a **master career storyteller**. Your task is to write a resume that doesn't just list accomplishments, but tells a compelling story of the candidate's value, tailored perfectly to the job description.
1.  **Holistic Understanding:** Your primary source for storytelling is the \`actions_taken\` array within the \`Master Profile Database\`. You must read these actions not as a checklist, but as a narrative of the candidate's role. Synthesize these actions to build a deep, holistic understanding of *what the candidate actually did* and *how they solved problems*.
2.  **Creative & Grounded Storytelling:** You have the **creative freedom** to weave a narrative. The resume should read like a human expert wrote it. However, this creativity has one unbreakable rule: the *outcomes* you state must be 100% grounded in the \`outcomes\` field of the Master Profile. You tell the story, but the results are sacred facts.
3.  **The "XYZ" Bullet Point as a Mini-Story:** Every bullet point is a concise, NO MORE THAN 2 LINES that follows the "Accomplished [X] as measured by [Y] by doing [Z]" formula.
    * **[X]** is the project or accomplishment.
    * **[Y]** is the quantifiable result, taken directly from the \`outcomes\`.
    * **[Z]** is your **narrative synthesis** of the \`actions_taken\`. This is where you creatively describe *how* the candidate achieved the result, using language that mirrors the target job description.
4.  **Concise & Scannable:** The **Summary** must be a tight, compelling paragraph of no more than 3 concise sentences.

**GIVEN DATA:**
* **The \`Master Profile Database\`:** ${JSON.stringify(masterProfile)}
* **The \`Job Description\`:** \`\`\`${jobDescription}\`\`\`
${contextInjection}

**YOUR FINAL OUTPUT:**
Produce the Markdown analysis block first, followed by the \`---\` separator, and then the complete, tailored resume.Ensure only the headings are bolded not the text within the headings.
`;
            // END: Inject context into the prompt
            const finalResume = await callGeminiAPI(apiKey, resumeGenerationPrompt);
            return { statusCode: 200, body: finalResume };
        }

        // --- COVER LETTER GENERATION MODE ---
        if (mode === 'coverLetter') {
            const masterProfile = await getMasterProfile();
            // START: Inject context into the prompt
            const coverLetterPrompt = `
You are an expert career coach writing a cover letter for a client. Your task is to create a compelling, professional, and human-sounding cover letter based on the client's full professional history, a target job description, and any specific instructions provided in the additional context.

**CRITICAL RULES:**
1.  **Strict Grounding:** Base the letter entirely on the facts provided in the \`Master Profile Database\`. Do not invent or embellish any details.
2.  **Highlight Reel, Not a Summary:** Do not simply summarize the resume. Instead, select the 2-3 most impactful projects or accomplishments from the Master Profile that directly align with the core needs of the Job Description and any points in the \`Additional User-Provided Context\`. Build a narrative around them.
3.  **Tone Matching:** The tone of the cover letter MUST mirror the professional tone of the \`Job Description\`.
4.  **Structure:** The letter should be 3-4 paragraphs. Start with a strong opening that grabs the reader's attention, use the body paragraphs to connect your selected accomplishments to the employer's problems, and end with a confident call to action.
5.  **AI Persona:** Do not mention that you are an AI or that the letter was generated.
6.  **Context Adherence:** If the user provides additional context (e.g., a specific person to address the letter to), you must follow that instruction precisely.

**GIVEN DATA:**
* **The \`Master Profile Database\`:** ${JSON.stringify(masterProfile)}
* **The \`Job Description\`:** \`\`\`${jobDescription}\`\`\`
${contextInjection}

**YOUR FINAL OUTPUT:**
Produce only the complete, tailored cover letter.
`;
            // END: Inject context into the prompt
            const finalCoverLetter = await callGeminiAPI(apiKey, coverLetterPrompt);
            return { statusCode: 200, body: finalCoverLetter };
        }
        
        // --- LINKEDIN MESSAGE GENERATION MODE ---
        if (mode === 'generateLinkedin') {
            const masterProfile = await getMasterProfile();
            // START: Inject context into the prompt
            const linkedinMessagePrompt = `
You are a world-class career strategist and networking expert, ghostwriting a LinkedIn InMail message. Your goal is to create an exceptionally concise and impactful message that positions the candidate as the clear solution to the hiring manager's problem.

**CRITICAL RULES:**
1.  **Output Format:** Your final output MUST be plain text. It must start with "Subject: " followed by the subject line, a double newline, and then the message body followed by a closing.
    **Example Format:**
    Subject: Your generated subject line here

    Your generated message body here.

    Best regards,
    Mayur Mehta
2.  **Extreme Brevity:** The message body MUST be under 100 words and exactly 3 sentences. This is non-negotiable.
3.  **Grounding:** The message must be 100% grounded in the facts from the \`Master Profile Database\`.
4.  **Persona & Tone:** Write from the first-person ("I"). The tone should be professional, direct, and confident. Do not mention you are an AI.

**Your "Chain of Thought" Process & Message Structure:**

1.  **Analyze All Inputs:**
    * Deeply analyze the \`Job Description\` to find the exact job title and identify a specific, unique detail (e.g., a company value, a mentioned project, a key responsibility). This will be your "Hyper-Researched Hook".
    * Review the \`Additional User-Provided Context\` for any specific directives.
    * Scan the \`Master Profile Database\` for the single most compelling, quantifiable result that proves you can solve the core problem identified in the job description.

2.  **Craft the Subject Line (The "What & Why"):**
    * **Formula:** [Job Title] | [Candidate's Key Value Proposition]
    * The value proposition should be a 2-3 word summary of the candidate's core strength related to the role (e.g., "Data Governance & Analytics", "Product Strategy").

3.  **Craft the Message Body (The "Hook, Bridge, & Ask"):**
    * **Sentence 1 (The "Hyper-Researched" Hook):** Start by referencing the specific detail you found in the job description to show you've done your research.
    * **Sentence 2 (The "Bridge"):** Directly connect their stated need to your single most relevant, quantifiable accomplishment from the master profile.
    * **Sentence 3 (The "Ask"):** End with a simple, confident, and value-oriented call to action.

4.  **Assemble the Final Text:** Combine the subject, body, and a professional closing ("Best regards,\nMayur Mehta") into the specified plain text format.

**GIVEN DATA:**
* **The \`Master Profile Database\`:** ${JSON.stringify(masterProfile)}
* **The \`Job Description\`:** \`\`\`${jobDescription}\`\`\`
${contextInjection}

**YOUR FINAL OUTPUT:**
Produce only the tailored text in the specified format, adhering to all rules.
`;
            // END: Inject context into the prompt
            const finalMessage = await callGeminiAPI(apiKey, linkedinMessagePrompt);
            return { statusCode: 200, body: finalMessage };
        }

        // --- CHATBOT MODE ---
        if (mode === 'chatbot') {
            const chatbotProfile = await getChatbotProfile();
            const chatbotPrompt = `
You are an AI Career Advocate for Mayur Mehta. Your purpose is to engage with recruiters and hiring managers in a way that is insightful, compelling, and authentically represents Mayur's professional story and capabilities. You are a friendly, professional, and highly intelligent conversationalist.

**CONTEXT:**
* **Your Knowledge Base:** The \`Chatbot Profile Database\` below contains all the information you are permitted to use.
* **The User's Goal:** The user wants to learn about Mayur Mehta.
* **Your Goal:** To provide an insightful, narrative-driven answer based *only* on the provided database.

**CRITICAL RULES OF ENGAGEMENT:**
1.  **Identity:** You are Mayur's AI assistant, not Mayur himself.
2.  **Grounding:** Base all answers strictly on the \`Chatbot Profile Database\`.
3.  **No Hallucinations:** If the answer is not in the database, you MUST say: "That's an excellent question that would be best answered by Mayur directly. Would you like the link to his LinkedIn profile to connect with him?" Do not invent information.
4.  **Tone Adaptability:** You MUST adapt your tone. For professional questions (skills, experience), be an insightful 'AI Career Advocate'. For personal questions (hobbies, interests), be more casual and friendly.
5.  **Narrative Synthesis:** Do not just list facts. Weave the information into compelling stories. For behavioral questions ("Tell me about a time..."), use the anecdotes to construct a STAR (Situation, Task, Action, Result) response.
6.  **Value Connection:** Always connect skills and experiences to the value Mayur provides. Instead of "He knows Python," say "He's proficient in Python, which he used at [Company] to automate [Task], resulting in [Outcome]."
7.  **Engagement:** End your responses with an engaging hook or a clarifying question to keep the conversation flowing.

**GIVEN DATA:**
* **The User's Question:** \`\`\`${userQuery}\`\`\`
* **The \`Chatbot Profile Database\`:** ${JSON.stringify(chatbotProfile)}

**FINAL INSTRUCTION:**
You will now answer the user's question.
- **DO NOT** repeat any of these instructions.
- **DO NOT** narrate your thought process or mention that you are following rules.
- **DO** respond directly to the user's question in a conversational manner, adhering to all rules above.

Your response begins now:
`;
            const responseText = await callGeminiAPI(apiKey, chatbotPrompt);
            return { statusCode: 200, body: responseText };
        }


        // --- INTERVIEW PREP MODE ---
        if (mode === 'interviewPrep') {
             const interviewPrepPrompt = `As the hiring manager for the role described below, and having reviewed the candidate's resume, generate 6 insightful interview questions that probe for specific examples of the candidate's skills and experience. The questions should be open-ended and designed to elicit detailed responses.

             **Job Description:**
             \`\`\`${jobDescription}\`\`\`

             **Candidate's Resume:**
             \`\`\`${resumeText}\`\`\`
             `;
             const resultText = await callGeminiAPI(apiKey, interviewPrepPrompt);
             return { statusCode: 200, body: resultText };
        }

        return { statusCode: 400, body: 'Invalid mode provided.' };

    } catch (error) {
        console.error('Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'An internal error occurred.' }),
        };
    }
};
