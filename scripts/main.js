import { initNavigation } from './navigation.js';
import { initToolkit } from './toolkit.js';
import { initChatbot } from './chatbot.js';
import { initProjects } from './projects.js';

// The HTML content for all pages is stored in this template literal.
// The #home page has been updated to use a more dynamic, two-column "dashboard" layout.
const pageTemplates = `
<div id="pages-container">
    <!-- HOME PAGE (UPDATED WITH DASHBOARD LAYOUT) -->
    <div id="home" class="page">
        <!-- Hero Section -->
        <section class="py-16 md:py-20">
            <div class="container mx-auto px-4">
                <div class="grid md:grid-cols-3 gap-8 md:gap-12 items-center">
                    <!-- Headshot -->
                    <div class="md:col-span-1 flex justify-center">
                        <img src="https://placehold.co/400x400/1f2937/9ca3af?text=Mayur" alt="Mayur Mehta Headshot" class="rounded-full w-48 h-48 md:w-64 md:h-64 object-cover border-4 border-gray-700 shadow-lg">
                    </div>
                    <!-- Hero Text -->
                    <div class="md:col-span-2 text-center md:text-left">
                        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">From Vision to Value: Building What's Next</h1>
                        <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto md:mx-0 mb-8">
                            I’m Mayur, a product-driven technologist and co-founder who thrives on turning complex challenges into scalable solutions. Whether it's leading a global data governance program or building an AI-powered startup from the ground up, I bridge the gap between ambitious ideas and tangible results.
                        </p>
                    </div>
                </div>
                <!-- Favorite Quote -->
                <div class="mt-16 md:mt-20 text-center">
                    <blockquote class="text-2xl md:text-3xl italic text-gray-300 max-w-3xl mx-auto border-l-4 border-brand-primary pl-6">
                        "The only way to do great work is to love what you do."
                    </blockquote>
                    <cite class="block text-gray-500 mt-4 text-lg">- Steve Jobs</cite>
                </div>
            </div>
        </section>

        <!-- Main Dashboard Layout -->
        <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-16">
            
            <!-- Left Column: The Narrative -->
            <div class="lg:col-span-3">
                
                <!-- Philosophy Section -->
                <section id="philosophy" class="pt-8">
                    <h2 class="text-3xl font-bold text-white mb-8">My Guiding Principles</h2>
                    <div class="space-y-8">
                        <div class="flex items-start gap-4">
                            <div class="text-3xl text-brand-primary mt-1">★</div>
                            <div>
                                <h3 class="text-xl font-semibold text-white mb-1">Lead from the Front</h3>
                                <p class="text-gray-400">I believe in taking complete ownership, end-to-end. From owning the migration of a critical SSO system for 200+ users to single-handedly driving the configuration of enterprise-wide financial platforms, I am the accountable driver who ensures projects cross the finish line successfully and without disruption.</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-4">
                            <div class="text-3xl text-brand-primary mt-1">🚀</div>
                            <div>
                                <h3 class="text-xl font-semibold text-white mb-1">Innovate with Purpose</h3>
                                <p class="text-gray-400">Technology is a tool to solve human problems. I have a passion for integrating advanced solutions—from co-developing NLP models for call intelligence to integrating GenAI recommendation systems—to automate processes, unlock new efficiencies, and deliver a smarter user experience.</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-4">
                            <div class="text-3xl text-brand-primary mt-1">🏛️</div>
                            <div>
                                <h3 class="text-xl font-semibold text-white mb-1">Build for the Future</h3>
                                <p class="text-gray-400">True value lies in creating systems that last. I focus on establishing robust frameworks, whether it's designing a formal analytics engagement model from scratch or implementing a full Agile methodology for a startup. The goal is always to increase efficiency and build a foundation for scalable growth.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Core Traits Section -->
                <section id="core-traits" class="pt-16">
                    <h2 class="text-3xl font-bold text-white mb-8">Core Traits</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-gray-800/20 p-6 rounded-lg border border-gray-700/50">
                            <h3 class="text-lg font-bold text-brand-primary mb-2">Systems Thinker</h3>
                            <p class="text-gray-400 text-sm">I see beyond the immediate task to understand the entire ecosystem, connecting disparate parts into a cohesive, high-functioning whole.</p>
                        </div>
                        <div class="bg-gray-800/20 p-6 rounded-lg border border-gray-700/50">
                            <h3 class="text-lg font-bold text-brand-primary mb-2">Proactive Owner</h3>
                            <p class="text-gray-400 text-sm">I don't wait for instructions; I take the initiative and own the outcome from conception to completion.</p>
                        </div>
                        <div class="bg-gray-800/20 p-6 rounded-lg border border-gray-700/50">
                            <h3 class="text-lg font-bold text-brand-primary mb-2">The Translator</h3>
                            <p class="text-gray-400 text-sm">I thrive at the intersection of business and technology, translating complex needs into flawless technical requirements.</p>
                        </div>
                        <div class="bg-gray-800/20 p-6 rounded-lg border border-gray-700/50">
                            <h3 class="text-lg font-bold text-brand-primary mb-2">Data-Driven Pragmatist</h3>
                            <p class="text-gray-400 text-sm">Opinions are good, but data is better. I leverage data to transform chaotic backlogs into prioritized, strategic roadmaps.</p>
                        </div>
                         <div class="bg-gray-800/20 p-6 rounded-lg border border-gray-700/50 md:col-span-2">
                            <h3 class="text-lg font-bold text-brand-primary mb-2">The Problem Solver</h3>
                            <p class="text-gray-400 text-sm">At my core, I am driven to solve complex puzzles. I enjoy dissecting ambiguous problems and architecting robust, scalable solutions that create lasting clarity and value.</p>
                        </div>
                    </div>
                </section>

                <!-- AI-Built Project Section -->
                <section id="ai-built" class="pt-16">
                    <div class="bg-gray-800/20 rounded-xl p-8 text-center border border-gray-700/50">
                        <div class="text-4xl mb-4">🤖</div>
                        <h2 class="text-2xl font-bold text-white mb-3">A Note on How This Site Was Built</h2>
                        <p class="text-gray-400">
                            This entire portfolio is a passion project, built from scratch to explore the advanced coding capabilities of AI platforms like Google's Gemini. I acted as the product manager and architect, guiding the AI to generate the code for the UI, application logic, and backend functions. It's a living testament to my belief in leveraging new technologies to accelerate development and bring ambitious ideas to life.
                        </p>
                    </div>
                </section>

            </div>

            <!-- Right Column: The Action -->
            <div class="lg:col-span-2">
                
                <!-- Contact Section -->
                <section id="contact" class="sticky top-24">
                    <div class="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
                        <h2 class="text-2xl font-bold text-white text-center mb-6">Get In Touch</h2>
                        
                        <!-- Expanded Contact Details -->
                        <div class="space-y-4 mb-6">
                            <a href="mailto:mayurdmehta@gmail.com" class="flex items-center text-gray-300 hover:text-brand-primary transition-colors p-2 rounded-lg hover:bg-gray-700/50">
                                <svg class="w-6 h-6 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                <span>mayurdmehta@gmail.com</span>
                            </a>
                            <a href="https://www.linkedin.com/in/mehta-mayur" target="_blank" rel="noopener noreferrer" class="flex items-center text-gray-300 hover:text-brand-primary transition-colors p-2 rounded-lg hover:bg-gray-700/50">
                                <svg class="w-6 h-6 mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                <span>LinkedIn Profile</span>
                            </a>
                             <a href="tel:+15715287448" class="flex items-center text-gray-300 hover:text-brand-primary transition-colors p-2 rounded-lg hover:bg-gray-700/50">
                                <svg class="w-6 h-6 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                <span>+1 (571) 528-7448</span>
                            </a>
                        </div>

                        <div class="border-t border-gray-700 pt-6">
                            <form name="contact" method="POST" data-netlify="true" class="space-y-4">
                                <input type="hidden" name="form-name" value="contact">
                                <div>
                                    <label for="name" class="sr-only">Your Name</label>
                                    <input type="text" name="name" id="name" required placeholder="Your Name" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition">
                                </div>
                                <div>
                                    <label for="email" class="sr-only">Your Email</label>
                                    <input type="email" name="email" id="email" required placeholder="Your Email" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition">
                                </div>
                                <div>
                                    <label for="message" class="sr-only">Message</label>
                                    <textarea name="message" id="message" rows="4" required placeholder="Your Message" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"></textarea>
                                </div>
                                <div>
                                    <button type="submit" class="w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-primary transition-all duration-300">
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <!-- Chatbot Teaser Section -->
                    <div class="text-center mt-8">
                         <a href="#" data-page="chatbot" class="text-brand-primary hover:text-blue-400 font-semibold transition-colors nav-link">
                           Or, want the full story? Ask my AI assistant &rarr;
                         </a>
                    </div>
                </section>

            </div>
        </div>
    </div>

    <!-- PROJECTS PAGE (Unchanged) -->
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
    <!-- BLOGS PAGE (Unchanged) -->
    <div id="blogs" class="page hidden">
        <div class="text-center py-20">
            <h1 class="text-5xl font-bold text-white mb-4">My Blog</h1>
            <p class="text-xl text-gray-400">Coming soon! A collection of my thoughts on technology, product management, and more.</p>
        </div>
    </div>
    <!-- CAREER TOOLKIT AI PAGE (Unchanged) -->
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

/**
 * Main application entry point.
 * Initializes all modules after the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    loadPageContent();
    initNavigation();
    initToolkit();
    initChatbot();
    initProjects();
});

/**
 * Injects the page templates into the main containers in index.html.
 */
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
