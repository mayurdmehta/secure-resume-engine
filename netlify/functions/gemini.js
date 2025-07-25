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
    // FIX: Updated the model name to 'gemini-2.0-flash'.
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
        // Provide more detailed error logging if the response structure is unexpected
        console.error("Unexpected Gemini API response structure:", JSON.stringify(result, null, 2));
        throw new Error('The Gemini model returned an invalid response structure.');
    }
}
// --- HELPER FUNCTION TO CALL THE OPENAI API ---
async function callChatGPTAPI(apiKey, prompt) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const payload = {
        model: "gpt-4o",
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
        
        const contextInjection = additionalContext ? `\n\n**Additional User-Provided Context to Emphasize:**\n\`\`\`${additionalContext}\`\`\`` : '';
        
        let prompt;
        
        switch (mode) {
            case 'generate':
                const masterProfileForResume = await getMasterProfile();
                prompt = `You are a world-class resume writer and an elite Career Strategist. Your speciality is to create FAANG-caliber mirror resumes. 

Your mission is to leverage the provided Job Description to extract core requirements, then mine the Master Profile JSON to craft a tailored, human-friendly resume that:
- Mirrors the role’s keywords, tone, and cultural traits.
- Selects the most impactful stories and quantifiable results.
- **Critically MUST** structure each bullet in the "Accomplished [X] by [Y] as measured by [Z]" format.
- Keeps bullets to two lines maximum.
- Includes a concise FAANG-style summary.
- Bypasses ATS filters with rich keyword usage.

---
### PROCESS
---

#### Part 1: JD Analysis & Strategy
First, analyze the inputs and produce a strategy report. Present this as a Markdown block titled **JD Analysis & Strategy**.

- **Job Title:** Extract the exact title.
- **High-Value Keywords:** List all technical terms & business nouns, separated by commas.
- **Cultural & Personality Traits:** List all relevant traits, separated by commas (e.g., “collaborative,” “innovative”).
- **Tone & Style:** Describe the tone (e.g., Formal, conversational) and seniority level.
- **Key Action Verbs:** List the key verbs highlighted in the job responsibilities, separated by commas.

#### Part 2: Narrative Synthesis (The Resume)
After your analysis, you will write the complete resume based on the following rules.

- **Header & Contact:** Copy verbatim from the `Master Profile`.
- **Summary (3–4 sentences):**
    - Mirror the JD tone, weaving in the Job Title and Company.
    - Highlight the top 2–3 achievements with quantified outcomes.
    - Avoid buzzwords, clichés, and subjective terms (e.g., "results-driven"). Show, don't tell.
- **Experience (for each role in JSON):**
    - **Relevance Filter:** Prioritize stories from the `Master Profile` that are most aligned with the JD.
    - **Bullet Structure:** "Accomplished [X] by [Y] as measured by [Z]".
    - **Bullet Rules:** Each bullet must be 2 lines or less. Use up to 6 bullets per company. You may create multiple bullets from a single project if it is highly relevant.
    - **Technical Depth & Keywords:** Integrate relevant skills and jargon naturally.
- **Education & Skills:**
    - Emphasize degrees and certifications that match the JD.
    - List skills in the order of importance inferred from the JD.

---
### OUTPUT FORMAT
---

First, output the complete **JD Analysis & Strategy** block.
Then, output a `---` separator on its own line.
Finally, output the complete, final resume in Markdown, starting from the candidate's name and contact information down to their education and skills.

**Inputs:**
- Master Profile Database: \`${JSON.stringify(masterProfileForResume)}\`
- Job Description:
  \`\`\`${jobDescription}\`\`\`
- Context Injection: \`${contextInjection}\`
`;
                break;
            case 'coverLetter':
                const masterProfileForCL = await getMasterProfile();
                prompt = `You are an expert career coach writing a cover letter for a client. Your task is to create a compelling, professional, and human-sounding cover letter based on the client's full professional history, a target job description, and any specific instructions provided in the additional context.

**CRITICAL RULES:**
1.  **Strict Grounding:** Base the letter entirely on the facts provided in the \`Master Profile Database\`. Do not invent or embellish any details.
2.  **Highlight Reel, Not a Summary:** Do not simply summarize the resume. Instead, select the 2-3 most impactful projects or accomplishments from the Master Profile that directly align with the core needs of the Job Description and any points in the \`Additional User-Provided Context\`. Build a narrative around them.
3.  **Tone Matching:** The tone of the cover letter MUST mirror the professional tone of the \`Job Description\`.
4.  **Structure:** The letter should be 3-4 paragraphs. Start with a strong opening that grabs the reader's attention, use the body paragraphs to connect your selected accomplishments to the employer's problems, and end with a confident call to action.
5.  **AI Persona:** Do not mention that you are an AI or that the letter was generated.
6.  **Context Adherence:** If the user provides additional context (e.g., a specific person to address the letter to), you must follow that instruction precisely.

**GIVEN DATA:**
* **The \`Master Profile Database\`:** ${JSON.stringify(masterProfileForCL)}
* **The \`Job Description\`:** \`\`\`${jobDescription}\`\`\`
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
* **The \`Master Profile Database\`:** ${JSON.stringify(masterProfileForLI)}
* **The \`Job Description\`:** \`\`\`${jobDescription}\`\`\`
${contextInjection}

**YOUR FINAL OUTPUT:**
Produce only the tailored text in the specified format, adhering to all rules.`;
                break;
            case 'chatbot':
                const chatbotProfile = await getChatbotProfile();
                prompt = `You are an AI Career Advocate for Mayur Mehta. Your purpose is to engage with recruiters and hiring managers in a way that is insightful, compelling, and authentically represents Mayur's professional story and capabilities. You are a friendly, professional, and highly intelligent conversationalist.

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

Your response begins now:`;
                break;
            case 'interviewPrep':
                prompt = `As the hiring manager for the role described below, and having reviewed the candidate's resume, generate 6 insightful interview questions that probe for specific examples of the candidate's skills and experience. The questions should be open-ended and designed to elicit detailed responses.

             **Job Description:**
             \`\`\`${jobDescription}\`\`\`

             **Candidate's Resume:**
             \`\`\`${resumeText}\`\`\`
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
