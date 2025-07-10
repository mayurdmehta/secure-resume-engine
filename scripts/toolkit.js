import { callBackend } from './api.js';

export function initToolkit() {
    document.body.addEventListener('click', async (event) => {
        const toolkitPage = document.getElementById('toolkit');
        if (!toolkitPage || toolkitPage.classList.contains('hidden')) {
            return;
        }

        const targetId = event.target.id;
        // Updated to include coverLetterBtn as a primary action
        if (['generateBtn', 'coverLetterBtn', 'interviewPrepBtn'].includes(targetId)) {
            // The 'analyzeBtn' case is removed as the button no longer exists.
            const mode = targetId.replace('Btn', '');
            await handleApiCall(mode);
        } else if (targetId === 'copyBtn') {
            copyToClipboard();
        }
    });
}

async function handleApiCall(mode) {
    const jobDescription = document.getElementById('jobDescription').value;
    if (!jobDescription.trim()) {
        showError("Please paste a job description.");
        return;
    }

    let resumeTextForFeatures = "";
    // This block now only handles interviewPrep, which still depends on generated resume text.
    if (mode === 'interviewPrep') {
        resumeTextForFeatures = document.getElementById('resumeOutput').innerText;
        if (!resumeTextForFeatures.trim() || !resumeTextForFeatures.includes('Professional Experience')) { // Check if it looks like a resume
            showError("Please generate a resume first to provide context for interview prep.");
            return;
        }
        openModal("✨ Interview Prep Questions");
    } else {
        // All primary actions (resume, cover letter) now use the main loader.
        setLoading(true);
    }

    try {
        const resultText = await callBackend(mode, jobDescription, resumeTextForFeatures);

        if (mode === 'interviewPrep') {
            document.getElementById('modalBody').innerHTML = formatForDisplay(resultText);
            document.getElementById('modalLoader').classList.add('hidden');
        } else {
            // Both resume and cover letter results are shown in the main output.
            document.getElementById('resumeOutput').innerHTML = formatForDisplay(resultText);
            document.getElementById('copyBtn').classList.remove('hidden');
            
            // Only show the "Next Steps" for interview prep if a resume was generated.
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
        } catch(e) { /* Ignore parsing errors */ }

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
    const generateBtn = document.getElementById('generateBtn');
    const coverLetterBtn = document.getElementById('coverLetterBtn');
    const resumeOutput = document.getElementById('resumeOutput');
    const loader = document.getElementById('loader');
    const errorMessageDiv = document.getElementById('error-message');
    const nextSteps = document.getElementById('nextSteps');

    if(generateBtn) generateBtn.disabled = isLoading;
    if(coverLetterBtn) coverLetterBtn.disabled = isLoading;

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
    let html = text
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
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