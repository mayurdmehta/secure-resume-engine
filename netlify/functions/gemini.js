/*
=======================================================================
FILE: netlify/functions/gemini.js (Complete & Updated)
PURPOSE: This serverless function acts as a secure backend for the 
         entire application. It handles all interactions with the 
         Google Gemini API.
=======================================================================
*/

// Import necessary modules.
// 'GoogleGenerativeAI' is for interacting with the Gemini API.
// 'fs' (File System) and 'path' are Node.js modules for file handling.
import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import path from 'path';

// Retrieve the Gemini API key from environment variables for security.
const geminiApiKey = process.env.GEMINI_API_KEY;
// Initialize the Generative AI client.
const genAI = new GoogleGenerativeAI(geminiApiKey);

/**
 * Asynchronously reads and parses a JSON file from the project's root directory.
 * This is a helper function to keep our code DRY (Don't Repeat Yourself).
 * @param {string} fileName - The name of the JSON file to read (e.g., 'master_profile.json').
 * @returns {Promise<object>} A promise that resolves to the parsed JSON object.
 */
async function readJsonFile(fileName) {
    // Construct the absolute path to the file. `process.cwd()` returns the 
    // current working directory of the Node.js process, which in Netlify's
    // environment is the project root.
    const filePath = path.resolve(process.cwd(), fileName);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
}

/**
 * The main handler for the Netlify serverless function.
 * This function is triggered by any HTTP request to its endpoint.
 * @param {object} event - The incoming request object from Netlify.
 * @returns {Promise<object>} A promise that resolves to an HTTP response object.
 */
export async function handler(event) {
    // We only want to process POST requests.
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // Parse the incoming request body to get the necessary data.
        const { mode, jobDescription, resumeText, userQuery } = JSON.parse(event.body);
        
        // Load the JSON databases from the root directory.
        const masterProfile = await readJsonFile('master_profile.json');
        const chatbotProfile = await readJsonFile('chatbot_profile.json');

        let prompt;
        // Select the appropriate Gemini model.
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Use a switch statement to handle different modes of operation.
        switch (mode) {
            case 'generate':
                // Prompt for generating a tailored resume.
                prompt = `
                    As an expert resume writer, your task is to create a tailored resume for Mayur Mehta using his master profile.
                    Analyze the following job description and create a professional one-page resume.
                    - Start with the contact information.
                    - Write a compelling professional summary that aligns with the job description.
                    - Select and highlight the most relevant projects from his experience, rewriting bullet points to directly address the job's requirements.
                    - Include relevant education and certifications.
                    - The tone should be professional and confident.

                    Job Description:
                    ${jobDescription}

                    Mayur's Master Profile:
                    ${JSON.stringify(masterProfile, null, 2)}
                `;
                break;
            
            case 'coverLetter':
                // Prompt for generating a cover letter.
                prompt = `
                    As a professional career coach, write a compelling and concise cover letter for Mayur Mehta based on his master profile and the provided job description.
                    - The letter should be enthusiastic and professional.
                    - It must highlight 1-2 of his most relevant accomplishments that match the key requirements of the role.
                    - Keep it to three paragraphs.

                    Job Description:
                    ${jobDescription}

                    Mayur's Master Profile:
                    ${JSON.stringify(masterProfile, null, 2)}
                `;
                break;

            case 'interviewPrep':
                // Prompt for generating interview preparation questions.
                 prompt = `
                    You are an expert interview coach. Based on the provided job description and the tailored resume, generate a list of 5-7 potential interview questions. 
                    For each question, provide a concise, powerful answer that Mayur could use, drawing directly from his experience in the master profile.
                    
                    Job Description:
                    ${jobDescription}

                    Tailored Resume:
                    ${resumeText}

                    Mayur's Master Profile:
                    ${JSON.stringify(masterProfile, null, 2)}
                `;
                break;
            
            case 'chatbot':
                // Prompt for the chatbot interaction.
                prompt = `
                    You are Mayur Mehta's personal AI assistant. Your persona is friendly, knowledgeable, and slightly informal.
                    Answer the user's question based *only* on the information provided in the chatbot profile.
                    If the answer isn't in the profile, respond with "That's a great question! I don't have that information right now, but I can ask Mayur and get back to you."
                    Keep your answers conversational and concise.

                    User's Question: "${userQuery}"

                    Chatbot Profile (Your Knowledge Base):
                    ${JSON.stringify(chatbotProfile, null, 2)}
                `;
                break;

            default:
                // Handle invalid modes.
                throw new Error('Invalid mode specified');
        }

        // Send the generated prompt to the Gemini API.
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        // Return a successful response with the generated text.
        return {
            statusCode: 200,
            body: text
        };

    } catch (error) {
        // Handle any errors that occur during the process.
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred processing your request.' })
        };
    }
}
