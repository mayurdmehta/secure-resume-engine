// This function fetches the master profile from a public URL at runtime.
async function getMasterProfile() {
    // The URL points to the master profile JSON file on the live site.
    const profileUrl = `https://mayur-mehta-portfolio.netlify.app/master_profile.json`;
    try {
        const response = await fetch(profileUrl);
        if (!response.ok) {
            // Handle cases where the profile can't be fetched.
            throw new Error(`Failed to fetch master profile with status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching master profile:", error);
        // This error will be caught by the main handler and sent to the client.
        throw new Error("Could not load the master profile data.");
    }
}

// This function fetches the chatbot profile from a public URL at runtime.
async function getChatbotProfile() {
    // The URL points to the chatbot profile JSON file on the live site.
    const profileUrl = `https://mayur-mehta-portfolio.netlify.app/chatbot_profile.json`;
    try {
        const response = await fetch(profileUrl);
        if (!response.ok) {
            // Handle cases where the profile can't be fetched.
            throw new Error(`Failed to fetch chatbot profile with status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching chatbot profile:", error);
        // This error will be caught by the main handler and sent to the client.
        throw new Error("Could not load the chatbot profile data.");
    }
}


// --- HELPER FUNCTION TO CALL THE GEMINI API ---
// This centralized function handles all communication with the Google Gemini API.
async function callGeminiAPI(apiKey, prompt) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        // Safety settings are configured to be non-restrictive for this use case.
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

    // Safely access the response text to prevent errors.
    if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts) {
        return result.candidates[0].content.parts[0].text;
    } else {
        console.error("API Response did not contain valid candidates:", JSON.stringify(result, null, 2));
        throw new Error('The AI model returned an empty or invalid response.');
    }
}

// --- SERVERLESS FUNCTION HANDLER ---
// This is the main entry point for the Netlify serverless function.
exports.handler = async function (event, context) {
    // Only allow POST requests.
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // Parse the request body to get the mode and other data.
        const { mode, jobDescription, resumeText, userQuery } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("API key is not configured.");
        }

        // --- RESUME GENERATION MODE ---
        if (mode === 'generate') {
            const masterProfile = await getMasterProfile();
            const resumeGenerationPrompt = `
You are an elite AI career strategist and resume writer, acting as a world-class recruiter. Your task is to create a perfectly tailored resume by performing a deep, relational analysis of a candidate's full professional history against a target job description.

**CRITICAL RULES:**
1.  **Strict Grounding:** You MUST NOT invent, embellish, or infer any facts, figures, or details that are not explicitly present in the \`Master Profile Database\`. All output must be 100% traceable to the provided source data.
2.  **No Hallucinations:** Do not add any information that is not in the master profile. This is especially true for the "Core Competencies" section.
3.  **Tone Matching:** The tone, pattern, and specific lingo of the generated resume MUST mirror the style of the \`Job Description\`.
4.  **Writing Style:** Use clear, professional, and human-friendly language. Avoid overly complex technical jargon unless it is present in the Job Description.
5.  **AI Persona:** Do not, under any circumstances, mention that you are an AI or that the resume was generated by an AI.
6.  **Narrative Bullet Point Framework:** Every bullet point in the experience section must be a concise, single sentence that naturally weaves together a quantifiable result, the action taken, and the business outcome. **DO NOT** use '->' or other visual separators; the sentence must flow as a professional, human-written accomplishment.
7.  **Formatting & Structure:**
    * The final output must be a complete resume, starting with the candidate's name and contact info.
    * A "Core Competencies" section MUST be included below the professional summary. The skills in this section must be grouped into logical, professional categories (e.g., "Program & Product Management", "Data & Analytics", "Tools & Technologies").
    * Each bullet point MUST be no longer than two lines.
    * The entire experience section should contain a TOTAL of 12-15 bullet points. You must dynamically allocate these bullets to the most relevant jobs based on your analysis. Do not use a fixed number of bullets per job.

**Your "Chain of Thought" Process:**
1.  **Analyze the Job Description:** First, deeply comprehend the provided \`Job Description\`. Identify the core responsibilities, essential skills, key technologies, and the underlying business goals. Also, analyze the tone, pattern, and specific lingo used.
2.  **Analyze the Master Profile:** Next, review the candidate's entire \`Master Profile Database\`. Understand the narrative of their career and the impact of each project.
3.  **Create the Summary and Competencies:** Based on your analysis, write a 3-4 line professional summary that directly addresses the top requirements of the job. Then, to create the "Core Competencies" section, first identify all relevant skills from the Job Description. Cross-reference this list against the Master Profile. The final competencies listed MUST BE PRESENT in the Master Profile.
4.  **Synthesize, Select, and Allocate:** Strategically select the most relevant projects from the Master Profile. Then, dynamically allocate 12-15 bullet points across these experiences, prioritizing the most impactful and relevant accomplishments.
5.  **Rewrite and Tailor:** Generate the experience section. Rewrite the bullet points for the selected experiences to speak directly to the needs and language of the Job Description. Each bullet point must be a single, flowing sentence that adheres to the 'Narrative Bullet Point Framework' and all other critical rules.
6.  **Final Verification:** Before producing the final output, perform a final cross-check of the entire resume you have generated against the \`Master Profile Database\` and all critical rules. Ensure every detail is 100% accurate and correctly formatted.

**GIVEN DATA:**
* **The \`Master Profile Database\`:** ${JSON.stringify(masterProfile)}
* **The \`Job Description\`:** \`\`\`${jobDescription}\`\`\`

**YOUR FINAL OUTPUT:**
Produce only the complete, tailored resume in Markdown format, adhering to all critical rules and formatting requirements.
`;
            const finalResume = await callGeminiAPI(apiKey, resumeGenerationPrompt);
            return { statusCode: 200, body: finalResume };
        }

        // --- COVER LETTER GENERATION MODE ---
        if (mode === 'coverLetter') {
            const masterProfile = await getMasterProfile();
            const coverLetterPrompt = `
You are an expert career coach writing a cover letter for a client. Your task is to create a compelling, professional, and human-sounding cover letter based on the client's full professional history and a target job description.

**CRITICAL RULES:**
1.  **Strict Grounding:** Base the letter entirely on the facts provided in the \`Master Profile Database\`. Do not invent or embellish any details.
2.  **Highlight Reel, Not a Summary:** Do not simply summarize the resume. Instead, select the 2-3 most impactful projects or accomplishments from the Master Profile that directly align with the core needs of the Job Description and build a narrative around them.
3.  **Tone Matching:** The tone of the cover letter MUST mirror the professional tone of the \`Job Description\`.
4.  **Structure:** The letter should be 3-4 paragraphs. Start with a strong opening that grabs the reader's attention, use the body paragraphs to connect your selected accomplishments to the employer's problems, and end with a confident call to action.
5.  **AI Persona:** Do not mention that you are an AI or that the letter was generated.

**GIVEN DATA:**
* **The \`Master Profile Database\`:** ${JSON.stringify(masterProfile)}
* **The \`Job Description\`:** \`\`\`${jobDescription}\`\`\`

**YOUR FINAL OUTPUT:**
Produce only the complete, tailored cover letter.
`;
            const finalCoverLetter = await callGeminiAPI(apiKey, coverLetterPrompt);
            return { statusCode: 200, body: finalCoverLetter };
        }
        
        // --- LINKEDIN MESSAGE GENERATION MODE ---
        if (mode === 'generateLinkedin') {
            const masterProfile = await getMasterProfile();
            const linkedinMessagePrompt = `
You are a world-class career strategist and networking expert, ghostwriting a LinkedIn InMail message. Your goal is to create an exceptionally concise and impactful message, including a compelling subject line, that positions the candidate as the clear solution to the hiring manager's problem.

**CRITICAL RULES:**
1.  **Output Format:** Your final output MUST be plain text. It must start with "Subject: " followed by the subject line, a double newline, and then the message body.
    **Example Format:**
    Subject: Your generated subject line here

    Your generated message body here.
2.  **Subject Line Best Practices:**
    * **Clarity & Specificity:** It must mention the specific job title from the \`Job Description\`.
    * **Value Hint:** Briefly hint at a key qualification (e.g., "Experienced," "Results-driven").
    * **Brevity:** Keep it under 10 words.
3.  **Message Body Best Practices:**
    * **Extreme Brevity:** The body MUST be under 100 words and no more than 3-4 sentences. This is non-negotiable.
    * **Grounding:** The message must be 100% grounded in the facts from the \`Master Profile Database\`.
    * **The "Problem-Solution" Framework:**
        * **Sentence 1 (The Hook):** Express genuine, concise interest in the company's mission or a specific challenge from the \`Job Description\`.
        * **Sentence 2 (The Solution):** Identify the single most critical requirement from the \`Job Description\` and connect it directly to a single, quantifiable accomplishment from the \`Master Profile Database\`.
        * **Sentence 3 (The CTA):** Show genieune interest in the job listing and End with a simple, confident, and low-friction call to action.
4.  **Persona & Tone:** Write from the first-person ("I"). The tone should be professional, direct, and confident. Do not mention you are an AI.

**Your "Chain of Thought" Process:**
1.  **Analyze the Job Description:** Identify the #1 pain point and the exact job title.
2.  **Find the Silver Bullet:** Scan the \`Master Profile Database\` for the single most compelling, quantifiable result that proves you can solve that core problem.
3.  **Craft the Subject Line:** Following the rules, create a short, impactful subject line.
4.  **Craft the Message Body:** Write the body adhering strictly to the 3-sentence structure and word limit.
5.  **Assemble the Final Text:** Combine the subject and body into the specified text format.

**GIVEN DATA:**
* **The \`Master Profile Database\`:** ${JSON.stringify(masterProfile)}
* **The \`Job Description\`:** \`\`\`${jobDescription}\`\`\`

**YOUR FINAL OUTPUT:**
Produce only the tailored text in the specified "Subject: ..." format.
`;
            const finalMessage = await callGeminiAPI(apiKey, linkedinMessagePrompt);
            return { statusCode: 200, body: finalMessage };
        }

        // --- CHATBOT MODE ---
        if (mode === 'chatbot') {
            // Fetch the dynamic chatbot profile at runtime.
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
             // This prompt is static as it doesn't rely on a dynamic profile.
             const interviewPrepPrompt = `As the hiring manager for the role described below, and having reviewed the candidate's resume, generate 6 insightful interview questions that probe for specific examples of the candidate's skills and experience. The questions should be open-ended and designed to elicit detailed responses.

             **Job Description:**
             \`\`\`${jobDescription}\`\`\`

             **Candidate's Resume:**
             \`\`\`${resumeText}\`\`\`
             `;
             const resultText = await callGeminiAPI(apiKey, interviewPrepPrompt);
             return { statusCode: 200, body: resultText };
        }

        // If no valid mode is found, return an error.
        return { statusCode: 400, body: 'Invalid mode provided.' };

    } catch (error) {
        console.error('Function Error:', error);
        // Return a generic error message to the client.
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'An internal error occurred.' }),
        };
    }
};
