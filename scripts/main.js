import { initNavigation } from './navigation.js';
import { initToolkit } from './toolkit.js';
import { initChatbot } from './chatbot.js';
import { initProjects } from './projects.js';

// The HTML content for all pages is stored in this template literal.
// The static <header> has been removed as it lives permanently in index.html.
const pageTemplates = `
<div id="pages-container">
    <div id="home" class="page">
        <section class="py-16 md:py-20">
            <div class="container mx-auto px-4">
                <div class="grid md:grid-cols-3 gap-8 md:gap-12 items-center">
                    <div class="md:col-span-1 flex justify-center md:justify-start">
                        <img src="https://placehold.co/400x400/1f2937/9ca3af?text=Mayur" alt="Mayur Mehta Headshot" class="rounded-full w-56 h-56 md:w-72 md:h-72 object-cover border-4 border-gray-700 shadow-lg">
                    </div>
                    <div class="md:col-span-2 text-center md:text-left">
                        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">From Vision to Value: Building What's Next</h1>
                        <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto md:mx-0 mb-8">
                            I’m Mayur, a product-driven technologist and co-founder who thrives on turning complex challenges into scalable solutions. Whether it's leading a global data governance program or building an AI-powered startup from the ground up, I bridge the gap between ambitious ideas and tangible results.
                        </p>
                    </div>
                </div>
                <div class="mt-16 md:mt-20 text-center">
                    <blockquote class="text-2xl md:text-3xl italic text-gray-300 max-w-3xl mx-auto border-l-4 border-brand-primary pl-6">
                        "The only way to do great work is to love what you do."
                    </blockquote>
                    <cite class="block text-gray-500 mt-4 text-lg">- Steve Jobs</cite>
                </div>
            </div>
        </section>
        <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-16">
            <div class="lg:col-span-3">
                <section id="philosophy" class="pt-8">
				  <h2 class="text-3xl font-bold text-white mb-8">How I Deliver Impact</h2>
				  <div class="space-y-8">
					<div class="flex items-start gap-4">
					  <div class="text-3xl text-brand-primary">🔑</div>
					  <div>
						<h3 class="text-xl font-semibold text-white mb-1">Own the Outcome</h3>
						<p class="text-gray-400">I take full responsibility for program delivery, from discovery through adoption, ensuring stakeholders get the results they need, on time and at scale.</p>
					  </div>
					</div>
					<div class="flex items-start gap-4">
					  <div class="text-3xl text-brand-primary">💡</div>
					  <div>
						<h3 class="text-xl font-semibold text-white mb-1">Drive Meaningful Innovation</h3>
						<p class="text-gray-400">I use the latest technology, AI, automation, and analytics, not for buzzwords, but to unlock real value and measurable impact.</p>
					  </div>
					</div>
					<div class="flex items-start gap-4">
					  <div class="text-3xl text-brand-primary">🤝</div>
					  <div>
						<h3 class="text-xl font-semibold text-white mb-1">Collaborate Across Boundaries</h3>
						<p class="text-gray-400">The best solutions happen when diverse teams align. I thrive at the intersection of business, tech, and analytics, translating complex needs into unified action.</p>
					  </div>
					</div>
					<div class="flex items-start gap-4">
					  <div class="text-3xl text-brand-primary">📊</div>
					  <div>
						<h3 class="text-xl font-semibold text-white mb-1">Prioritize Clarity, Data, and Action</h3>
						<p class="text-gray-400">I turn ambiguity into structure and use data to drive decisions, transforming chaos into actionable roadmaps that deliver real results.</p>
					  </div>
					</div>
					<div class="flex items-start gap-4">
					  <div class="text-3xl text-brand-primary">🌱</div>
					  <div>
						<h3 class="text-xl font-semibold text-white mb-1">Learn, Coach, and Elevate Others</h3>
						<p class="text-gray-400">I share what I know and create systems for teams to succeed, mentoring and enabling others along the way.</p>
					  </div>
					</div>
				  </div>
				</section>
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
            <div class="lg:col-span-2">
                <section id="contact" class="sticky top-24">
                    <div class="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
                        <h2 class="text-2xl font-bold text-white text-center mb-6">Get In Touch</h2>
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
                        <div class="flex items-center text-center my-4">
                            <div class="flex-grow border-t border-gray-700"></div>
                            <span class="flex-shrink mx-4 text-gray-500">OR</span>
                            <div class="flex-grow border-t border-gray-700"></div>
                        </div>
                        <div class="space-y-4">
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
                    </div>
                    <div class="text-center mt-8">
                         <a href="#" data-action="open-chatbot" class="text-brand-primary hover:text-blue-400 font-semibold transition-colors">
                           Or, want the full story? Ask my AI assistant &rarr;
                         </a>
                    </div>
                </section>
            </div>
        </div>
    </div>

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
    <div id="blogs" class="page hidden">
        <div class="text-center py-20">
            <h1 class="text-5xl font-bold text-white mb-4">My Blog</h1>
            <p class="text-xl text-gray-400">Coming soon! A collection of my thoughts on technology, product management, and more.</p>
        </div>
    </div>

    <div id="toolkit" class="page hidden">
        <header class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">My Solution to a Tedious Problem</h1>
            <div class="max-w-3xl mx-auto text-lg text-gray-400 space-y-4">
                <p>Like any job seeker, I found the process of manually tailoring my resume for every application to be repetitive and inefficient. As a technologist who loves to build, I saw an opportunity to solve my own problem.</p>
                <p>This toolkit is the result. It's a living application that I designed and architected from the ground up, using AI to automate the process. It's a direct reflection of how I approach challenges: identify a pain point, architect a solution, and build a tool that delivers tangible value.</p>
                <p class="font-semibold text-gray-300">What you see below is not just a demo; it's the actual tool I use.</p>
            </div>
        </header>
        <main class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-gray-700 backdrop-blur-sm">
                <div class="flex items-center mb-4">
                    <div class="bg-brand-primary/20 text-brand-primary p-2 rounded-lg mr-3"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
                    <h2 class="text-2xl font-semibold text-white">Job Description</h2>
                </div>
                <textarea id="jobDescription" class="w-full h-64 p-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200" placeholder="Paste the full job description here..."></textarea>
                
                <div class="mt-4">
                    <div class="flex items-center mb-2">
                         <div class="bg-purple-500/20 text-purple-400 p-2 rounded-lg mr-3"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V4a2 2 0 012-2h8a2 2 0 012 2v4z" /></svg></div>
                        <h2 class="text-xl font-semibold text-white">Additional Context (Optional)</h2>
                    </div>
                    <textarea id="additionalContext" class="w-full h-32 p-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200" placeholder="e.g., Mention my passion for data visualization, address the cover letter to Jane Doe, or highlight my startup experience..."></textarea>
                </div>

                <div class="flex space-x-4 mt-4">
                    <button id="generateBtn" class="flex-1 bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-primary transition-all duration-200 flex items-center justify-center disabled:from-gray-600 disabled:to-gray-700 disabled:shadow-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                        Generate Resume
                    </button>
                    <button id="coverLetterBtn" class="flex-1 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-all duration-200 flex items-center justify-center disabled:bg-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        Generate Cover Letter
                    </button>
                    <button id="generateLinkedinBtn" class="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200 flex items-center justify-center disabled:bg-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        LinkedIn Message
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
                    <p class="text-gray-500">Your tailored content will appear here...</p>
                </div>
                <div id="nextSteps" class="hidden mt-4 p-4 bg-brand-primary/10 rounded-lg border border-brand-primary/30">
                    <h3 class="text-xl font-semibold text-brand-primary mb-3">Next Steps ✨</h3>
                    <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
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

    // Get the content from the parsed template
    const pagesContainer = doc.getElementById('pages-container');
    const modalsContainer = doc.getElementById('modals-container');
    const chatbotContent = doc.getElementById('chatbot-container');

    // Inject the content into the correct placeholders in index.html
    if (pagesContainer) {
        pageContent.innerHTML = pagesContainer.innerHTML;
    }
    if (modalsContainer) {
        modalContainer.innerHTML = modalsContainer.innerHTML;
    }
    if (chatbotContent) {
        chatbotContainer.innerHTML = chatbotContent.innerHTML;
    }
}
