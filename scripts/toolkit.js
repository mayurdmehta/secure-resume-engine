import { callBackend } from './api.js';

// This variable will hold the currently selected AI engine.
let selectedEngine = 'gemini'; // Default to Gemini

export function initToolkit() {
    // A single event listener manages all interactions within the toolkit.
    document.body.addEventListener('click', async (event) => {
        const toolkitPage = document.getElementById('toolkit');
        if (!toolkitPage || toolkitPage.classList.contains('hidden')) {
            return; // Only run if the toolkit page is active
        }

        const button = event.target.closest('button');
        if (!button) return;

        // --- Handle AI Engine Selector Clicks ---
        if (button.classList.contains('engine-selector-btn')) {
            selectedEngine = button.dataset.engine;
            
            // Update the UI to show which engine is active
            document.querySelectorAll('.engine-selector-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            return; // Exit after handling the selector change
        }

        // --- Handle Generation Button Clicks ---
        const generationModes = {
            'generateResumeBtn': 'generate',
            'coverLetterBtn': 'coverLetter',
            'generateLinkedinBtn': 'generateLinkedin',
            'interviewPrepBtn': 'interviewPrep'
        };

        const mode = generationModes[button.id];
        
        if (mode) {
            // Pass the determined mode to the central API handler
            await handleApiCall(mode); 
        } else if (button.id === 'copyBtn') {
            copyToClipboard();
        }
    });
}

/**
 * Handles all API calls by gathering data, setting loading states,
 * and passing the selected engine to the backend.
 * @param {string} mode - The type of content to generate (e.g., 'generate', 'coverLetter').
 */
async function handleApiCall(mode) {
    const jobDescription = document.getElementById('jobDescription').value;
    const additionalContext = document.getElementById('additionalContext').value;

    if (mode !== 'interviewPrep' && !jobDescription.trim()) {
        showError("Please paste a job description.");
        return;
    }

    let resumeTextForFeatures = "";
    if (mode === 'interviewPrep') {
        resumeTextForFeatures = document.getElementById('resumeOutput').innerText;
        if (!resumeTextForFeatures.trim() || !resumeTextForFeatures.includes('Summary')) {
            showError("Please generate a resume first to provide context for interview prep.");
            return;
        }
        openModal("✨ Interview Prep Questions");
    } else {
        setLoading(true);
    }

    try {
        // The selectedEngine is now passed to the backend call
        const resultText = await callBackend(mode, jobDescription, resumeTextForFeatures, '', additionalContext, selectedEngine);

        if (mode === 'interviewPrep') {
            document.getElementById('modalBody').innerHTML = formatForDisplay(resultText);
            document.getElementById('modalLoader').classList.add('hidden');
        } else {
            document.getElementById('resumeOutput').innerHTML = formatForDisplay(resultText);
            document.getElementById('copyBtn').classList.remove('hidden');
            
            if (mode === 'generate') {
                document.getElementById('nextSteps').classList.remove('hidden');
            } else {
                document.getElementById('nextSteps').classList.add('hidden');
            }
        }
    } catch (error) {
        console.error("Error in handleApiCall:", error);
        let errorMessage = "Sorry, an error occurred. Please try again.";
        try {
            const parsedError = JSON.parse(error.message);
            if(parsedError.error) errorMessage = parsedError.error;
        } catch(e) { 
            errorMessage = error.message;
        }

        if (mode === 'interviewPrep') {
             document.getElementById('modalBody').innerHTML = `<p class="text-red-400">${errorMessage}</p>`;
             document.getElementById('modalLoader').classList.add('hidden');
        } else {
            showError(errorMessage);
        }
    } finally {
        if (mode !== 'interviewPrep') {
            setLoading(false);
        }
    }
}

function setLoading(isLoading) {
    const allButtons = document.querySelectorAll('#toolkit button');
    const resumeOutput = document.getElementById('resumeOutput');
    const loader = document.getElementById('loader');
    const errorMessageDiv = document.getElementById('error-message');
    const nextSteps = document.getElementById('nextSteps');

    allButtons.forEach(button => {
        // Disable all buttons except the copy and engine selector buttons
        if(button.id !== 'copyBtn' && !button.classList.contains('engine-selector-btn')) {
            button.disabled = isLoading;
        }
    });

    if (isLoading) {
        if(resumeOutput) resumeOutput.classList.add('hidden');
        if(loader) loader.classList.remove('hidden');
        if(errorMessageDiv) errorMessageDiv.classList.add('hidden');
        if(nextSteps) nextSteps.classList.add('hidden');
    } else {
        if(resumeOutput) resumeOutput.classList.remove('hidden');
        if(loader) loader.classList.add('hidden');
    }
}

function showError(message) {
    const errorMessageDiv = document.getElementById('error-message');
    if(errorMessageDiv) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.classList.remove('hidden');
    }
}

function formatForDisplay(text) {
    let sanitizedText = text
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    if (sanitizedText.startsWith('Subject: ')) {
        const parts = sanitizedText.split(/\n\n/);
        const subjectLine = parts[0].replace('Subject: ', '');
        const body = parts.slice(1).join('<br><br>');
        return `<h3>${subjectLine}</h3><br>${body}`;
    }

    let html = sanitizedText
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/(\<br\>)?\s*\* (.*)/gim, (match, br, content) => `<ul><li>${content.trim()}</li></ul>`)
        .replace(/<\/ul>\s*<ul>/g, '');

    return html;
}

function openModal(title) {
    const toolkitModal = document.getElementById('toolkit-modal');
    const modalTitle = toolkitModal.querySelector('#modalTitle');
    const modalBody = toolkitModal.querySelector('#modalBody');
    const modalLoader = toolkitModal.querySelector('#modalLoader');

    if(toolkitModal) toolkitModal.classList.remove('hidden');
    if(modalTitle) modalTitle.textContent = title;
    if(modalBody) modalBody.innerHTML = '';
    if(modalLoader) modalLoader.classList.remove('hidden');
}

function copyToClipboard() {
    const resumeOutput = document.getElementById('resumeOutput');
    const textToCopy = resumeOutput.innerText;
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        document.getElementById('copyBtn').textContent = 'Copied!';
        setTimeout(() => { document.getElementById('copyBtn').textContent = 'Copy'; }, 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showError("Failed to copy text.");
    }
    document.body.removeChild(textArea);
}
