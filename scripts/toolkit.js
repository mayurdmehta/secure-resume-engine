import { callBackend } from './api.js';

export function initToolkit() {
    document.body.addEventListener('click', async (event) => {
        const toolkitPage = document.getElementById('toolkit');
        if (!toolkitPage || toolkitPage.classList.contains('hidden')) {
            return;
        }

        const targetId = event.target.id;
        if (['generateBtn', 'analyzeBtn', 'coverLetterBtn', 'interviewPrepBtn'].includes(targetId)) {
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
    if (mode === 'coverLetter' || mode === 'interviewPrep') {
        resumeTextForFeatures = document.getElementById('resumeOutput').innerText;
        if (!resumeTextForFeatures.trim()) {
            showError("Please generate a resume first to provide context for this feature.");
            return;
        }
        openModal(mode === 'coverLetter' ? "✨ Cover Letter Draft" : "✨ Interview Prep Questions");
    } else {
        setLoading(true);
    }

    try {
        const resultText = await callBackend(mode, jobDescription, resumeTextForFeatures);

        if (mode === 'coverLetter' || mode === 'interviewPrep') {
            document.getElementById('modalBody').innerHTML = formatForDisplay(resultText);
            document.getElementById('modalLoader').classList.add('hidden');
        } else {
            document.getElementById('resumeOutput').innerHTML = formatForDisplay(resultText);
            document.getElementById('copyBtn').classList.remove('hidden');
            if (mode === 'resume') {
                document.getElementById('nextSteps').classList.remove('hidden');
            } else {
                document.getElementById('nextSteps').classList.add('hidden');
            }
        }
    } catch (error) {
        console.error("Error in handleApiCall:", error);
        // Attempt to parse a more specific error message from the backend
        let errorMessage = "Sorry, an error occurred. Please try again.";
        try {
            const parsedError = JSON.parse(error.message);
            if(parsedError.error) {
                errorMessage = parsedError.error;
            }
        } catch(e) {
            // Ignore if parsing fails, use the generic message
        }

        if (mode === 'coverLetter' || mode === 'interviewPrep') {
             document.getElementById('modalBody').innerHTML = `<p class="text-red-400">${errorMessage}</p>`;
             document.getElementById('modalLoader').classList.add('hidden');
        } else {
            showError(errorMessage);
        }
    } finally {
        if (mode !== 'coverLetter' && mode !== 'interviewPrep') {
            setLoading(false);
        }
    }
}

function setLoading(isLoading) {
    const generateBtn = document.getElementById('generateBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resumeOutput = document.getElementById('resumeOutput');
    const loader = document.getElementById('loader');
    const errorMessageDiv = document.getElementById('error-message');
    const nextSteps = document.getElementById('nextSteps');

    if(generateBtn) generateBtn.disabled = isLoading;
    if(analyzeBtn) analyzeBtn.disabled = isLoading;

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
    // This is a simple Markdown to HTML converter.
    // It's not exhaustive but handles headers, lists, and bold text.
    let html = text
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n\n/g, '<br><br>') // Handle paragraphs
        .replace(/\n/g, '<br>') // Handle single line breaks
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/(\<br\>)?\s*\* (.*)/gim, (match, br, content) => `<ul><li>${content.trim()}</li></ul>`)
        .replace(/<\/ul>\s*<ul>/g, ''); // Consolidate adjacent lists

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
