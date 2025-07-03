import { initNavigation } from './navigation.js';
import { initToolkit } from './toolkit.js';
import { initChatbot } from './chatbot.js';
import { initProjects } from './projects.js';

// The HTML content is now stored securely inside a JavaScript template literal.
const pageTemplates = `
<div id="pages-container">
    <!-- HOME PAGE -->
    <div id="home" class="page">
        <div class="text-center py-20">
            <h1 class="text-6xl font-bold text-white mb-4">Welcome</h1>
            <p class="text-xl text-gray-400 mb-10">This is my personal portfolio. Explore my projects, read my blog, or use the Career Toolkit AI to see how my experience fits your needs.</p>
            <div class="flex justify-center items-center space-x-6">
                 <a href="mailto:mayurdmehta@gmail.com" class="flex items-center text-gray-300 hover:text-brand-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    mayurdmehta@gmail.com
                </a>
                <a href="#" class="flex items-center text-gray-300 hover:text-brand-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                    LinkedIn Profile
                </a>
            </div>
        </div>
    </div>
    <!-- PROJECTS PAGE -->
    <div id="projects" class="page hidden">
        <header class="text-center mb-12">
            <h1 class="text-5xl font-bold text-white mb-4">My Projects</h1>
            <p class="text-xl text-gray-400">A showcase of my passion for building and problem-solving.</p>
        </header>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div class="project-card bg-gray-800/50 p-6 rounded-xl border border-gray-700 cursor-pointer" data-modal-target="project1-modal">
                <h3 class="text-2xl font-bold text-brand-primary mb-2">This Portfolio Website</h3>
                <p class="text-gray-400 mb-4">A meta-project on building a personal portfolio through an iterative, AI-assisted development process with Gemini.</p>
                <div class="flex flex-wrap gap-2">
                    <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">AI-Assisted Development</span>
                    <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Prompt Engineering</span>
                </div>
            </div>
            <div class="project-card bg-gray-800/50 p-6 rounded-xl border border-gray-700 cursor-pointer" data-modal-target="project2-modal">
                <h3 class="text-2xl font-bold text-brand-primary mb-2">Career Toolkit AI</h3>
                <p class="text-gray-400 mb-4">The engine powering this site. An AI tool that analyzes job descriptions and generates tailored career assets.</p>
                <div class="flex flex-wrap gap-2">
                    <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Process Automation</span>
                     <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">AI Implementation</span>
                </div>
            </div>
        </div>
    </div>
    <!-- BLOGS PAGE -->
    <div id="blogs" class="page hidden">
        <div class="text-center py-20">
            <h1 class="text-5xl font-bold text-white mb-4">My Blog</h1>
            <p class="text-xl text-gray-400">Coming soon! A collection of my thoughts on technology, product management, and more.</p>
        </div>
    </div>
    <!-- CAREER TOOLKIT AI PAGE -->
    <div id="toolkit" class="page hidden">
        <header class="text-center mb-10">
            <h1 class="text-5xl font-bold text-brand-primary mb-4">Career Toolkit AI</h1>
            <p class="text-lg text-gray-400 max-w-3xl mx-auto">
                This tool was born from a personal project to automate the tedious process of tailoring a resume for each job application. It uses a custom-built AI engine, powered by Gemini, to analyze a job description and intelligently rewrite my career story to highlight the most relevant skills and experiences. It's a demonstration of my passion for process automation, AI implementation, and creating efficient, user-centric solutions.
            </p>
        </header>
        <main class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-gray-700 backdrop-blur-sm">
                <div class="flex items-center mb-4">
                    <div class="bg-brand-primary/20 text-brand-primary p-2 rounded-lg mr-3"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
                    <h2 class="text-2xl font-semibold text-white">Job Description</h2>
                </div>
                <textarea id="jobDescription" class="w-full h-96 p-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200" placeholder="Paste the full job description here..."></textarea>
                <div class="flex space-x-4 mt-4">
                    <button id="analyzeBtn" class="w-1/2 bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-400 transition-all duration-200 flex items-center justify-center disabled:bg-gray-700 disabled:text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Analyze Job
                    </button>
                    <button id="generateBtn" class="w-1/2 bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-primary transition-all duration-200 flex items-center justify-center disabled:from-gray-600 disabled:to-gray-700 disabled:shadow-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                        Generate Resume
                    </button>
                </div>
            </div>
            <div class="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-gray-700 backdrop-blur-sm flex flex-col">
                <div class="flex justify-between items-center mb-4">
                     <div class="flex items-center">
                        <div class="bg-green-500/20 text-green-400 p-2 rounded-lg mr-3"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                        <h2 class="text-2xl font-semibold text-white">Generated Content</h2>
                    </div>
                    <button id="copyBtn" class="bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition duration-200 hidden">Copy</button>
                </div>
                <div id="loader" class="hidden flex justify-center items-center h-full"><div class="loader"></div></div>
                <div id="resumeOutput" class="prose prose-dark max-w-none flex-grow overflow-y-auto p-4 bg-gray-900/70 border border-gray-700 rounded-lg">
                    <p class="text-gray-500">Your tailored resume and career tools will appear here...</p>
                </div>
                <div id="nextSteps" class="hidden mt-4 p-4 bg-brand-primary/10 rounded-lg border border-brand-primary/30">
                    <h3 class="text-xl font-semibold text-brand-primary mb-3">Next Steps ✨</h3>
                    <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <button id="coverLetterBtn" class="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-500 transition duration-200">Draft Cover Letter</button>
                        <button id="interviewPrepBtn" class="flex-1 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-500 transition duration-200">Interview Prep</button>
                    </div>
                </div>
                <div id="error-message" class="hidden mt-4 p-4 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg"></div>
            </div>
        </main>
    </div>
</div>

<div id="modals-container">
    <div id="project1-modal" class="modal-backdrop hidden">
        <div class="modal-content">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-semibold text-white">This Portfolio Website</h2>
                <button class="close-modal-btn text-gray-400 hover:text-white text-3xl">&times;</button>
            </div>
            <div class="prose prose-dark max-w-none">
                <h3>The Challenge</h3>
                <p>How can a single person with a vision build a complete, modern, and interactive web application quickly and efficiently, without writing every line of code by hand?</p>
                <h3>My Role & Approach</h3>
                <p>I acted as the Product Manager and AI Director for this project. My role was to guide my AI partner, Gemini, through an iterative development process. I provided the high-level vision, detailed requirements for each feature, and continuous feedback to refine the output. This involved:</p>
                <ul>
                    <li>**Prompt Engineering:** Crafting precise instructions to generate code for the UI, application logic, and backend functions.</li>
                    <li>**Architectural Decisions:** Making key decisions, such as separating the frontend from the backend, securing API keys with a serverless function, and designing a holistic database structure.</li>
                    <li>**Debugging & Iteration:** Collaboratively debugging issues related to API calls, data structures, and UI behavior.</li>
                </ul>
                <h3>The Outcome</h3>
                <p>This entire portfolio website, with over 500 lines of code across multiple files, was built through a collaborative human-AI process. It serves as a live demonstration of a modern workflow, rapid prototyping, and the ability to leverage AI as a powerful productivity multiplier to bring a complex idea to life.</p>
            </div>
        </div>
    </div>
    <div id="project2-modal" class="modal-backdrop hidden">
        <div class="modal-content">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-semibold text-white">Career Toolkit AI</h2>
                <button class="close-modal-btn text-gray-400 hover:text-white text-3xl">&times;</button>
            </div>
             <div class="prose prose-dark max-w-none">
                <h3>The Challenge</h3>
                <p>The process of tailoring a resume for each individual job application is time-consuming, repetitive, and often inefficient. The goal was to automate this process to create highly-targeted career assets instantly.</p>
                <h3>My Role & Approach</h3>
                <p>I designed and built the end-to-end system. The core of the project was architecting a "source of truth" database of my career accomplishments and then developing a sophisticated AI prompt engine. This engine instructs Gemini to:</p>
                <ul>
                    <li>Analyze a job description for key skills, tone, and cultural fit.</li>
                    <li>Intelligently select the most relevant projects from my database.</li>
                    <li>Rewrite my accomplishments into new, concise bullet points that directly address the needs of the role.</li>
                </ul>
                 <h3>Tech Stack</h3>
                <p>HTML, Tailwind CSS, JavaScript, Netlify Serverless Functions, and the Google Gemini API.</p>
                <h3>The Outcome</h3>
                <p>A fully functional web application that automates resume tailoring, drafts cover letters, and provides interview prep. It's a real-world example of my passion for process automation and building useful, AI-powered products.</p>
            </div>
        </div>
    </div>
    <div id="toolkit-modal" class="modal-backdrop hidden">
        <div class="modal-content">
            <div class="flex justify-between items-center mb-4">
                <h2 id="modalTitle" class="text-2xl font-semibold text-white"></h2>
                <button class="close-modal-btn text-gray-400 hover:text-white text-3xl">&times;</button>
            </div>
            <div id="modalLoader" class="hidden flex justify-center items-center py-16"><div class="loader"></div></div>
            <div id="modalBody" class="prose prose-dark max-w-none"></div>
        </div>
    </div>
</div>

<div id="chatbot-container">
    <div id="chatbot-fab" class="cursor-pointer">
        <button class="bg-brand-primary text-white rounded-full p-4 shadow-lg hover:bg-blue-500 transition-transform hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        </button>
    </div>
    <div id="chatbot-window" class="hidden bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl flex flex-col scale-95 opacity-0">
        <div class="p-4 border-b border-gray-700">
            <h3 class="text-lg font-semibold text-white text-center">Get to Know Mayur</h3>
        </div>
        <div id="chat-messages" class="flex-1 p-4 space-y-4 overflow-y-auto">
             <div class="flex justify-start">
                <div class="bg-brand-primary text-white p-3 rounded-lg max-w-xs">
                    <p>Hi! I'm an AI assistant. Ask me anything to get to know Mayur better.</p>
                </div>
            </div>
        </div>
        <div class="p-4 border-t border-gray-700">
            <div class="flex space-x-2">
                <input type="text" id="chat-input" placeholder="Ask a question..." class="flex-1 bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary">
                <button id="chat-send-btn" class="bg-brand-primary text-white p-3 rounded-lg hover:bg-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                </button>
            </div>
        </div>
    </div>
</div>
`;

document.addEventListener('DOMContentLoaded', () => {
    loadPageContent();
    initNavigation();
    initToolkit();
    initChatbot();
    initProjects();
});

function loadPageContent() {
    const pageContent = document.getElementById('page-content');
    const modalContainer = document.getElementById('modal-container');
    const chatbotContainer = document.getElementById('chatbot-container');

    const parser = new DOMParser();
    const doc = parser.parseFromString(pageTemplates, 'text/html');
    
    pageContent.innerHTML = doc.getElementById('pages-container').innerHTML;
    modalContainer.innerHTML = doc.getElementById('modals-container').innerHTML;
    chatbotContainer.innerHTML = doc.getElementById('chatbot-container').innerHTML;
}