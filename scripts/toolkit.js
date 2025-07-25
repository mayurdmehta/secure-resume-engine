import { callBackend } from './api.js';

// This variable will hold the currently selected AI engine.
let selectedEngine = 'gemini'; // Default to Gemini

export function initToolkit() {
    // A single event listener manages all interactions within the toolkit.
    document.body.addEventListener('click', async (event) => {
        const button = event.target.closest('button');
        if (!button) return;

        // --- Handle AI Engine Selector Clicks ---
        if (button.classList.contains('engine-selector-btn')) {
            // First, remove the 'active' class from all engine selector buttons
            document.querySelectorAll('.engine-selector-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            // Then, add the 'active' class to the specific button that was clicked
            button.classList.add('active');
            
            // Update the selected engine variable
            selectedEngine = button.dataset.engine;
            return; // Exit after handling the selector change
        }

        // --- Handle All Other Toolkit Buttons ONLY if the page is visible ---
        const toolkitPage = document.getElementById('toolkit');
        if (!toolkitPage || toolkitPage.classList.contains('hidden')) {
            return; // Only run the logic below if the toolkit page is active
        }

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

        let htmlContent;

        // The LinkedIn message has a special plain-text format, so we handle it separately.
        // For all other content, we parse the returned Markdown into HTML.
        if (mode === 'generateLinkedin' && resultText.startsWith('Subject: ')) {
            const parts = resultText.split(/\n\n/);
            const subjectLine = parts[0].replace('Subject: ', '').replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const body = parts.slice(1).join('<br><br>').replace(/</g, "&lt;").replace(/>/g, "&gt;");
            htmlContent = `<h3>${subjectLine}</h3><br>${body}`;
        } else {
            // Use the 'marked' library to parse the Markdown response into HTML.
            htmlContent = marked.parse(resultText);
        }

        if (mode === 'interviewPrep') {
            document.getElementById('modalBody').innerHTML = htmlContent;
            document.getElementById('modalLoader').classList.add('hidden');
        } else {
            document.getElementById('resumeOutput').innerHTML = htmlContent;
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
    // .innerText correctly gets the visible text, ignoring HTML tags, which is perfect for copying.
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
