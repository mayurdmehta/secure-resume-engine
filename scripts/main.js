import { initNavigation } from './navigation.js';
import { initToolkit } from './toolkit.js';
import { initChatbot } from './chatbot.js';
import { initProjects } from './projects.js';

// ======================================================================= //
// ADDITIONS FOR THE BLOG FEATURE                                          //
// ======================================================================= //

// Data structure to hold blog post content.
const blogPosts = [
    {
        slug: 'vibe-coding-my-way-to-automation',
        title: 'Vibe Coding My Way to Automation - A Workflow for Email Follow-Ups and Beyond',
        date: 'August 9, 2025',
        summary: 'How a non-developer built an AI-powered email follow-up assistant using no-code tools, a little scripting, and a lot of trial and error.',
        content: `
# Vibe Coding My Way to Automation - A Workflow for Email Follow-Ups and Beyond

## The Backstory
I send a lot of professional outreach emails - whether for job opportunities, networking, or collaborations. The hardest part? Sifting through too many snoozed conversations in my Gmail inbox, trying to remember who I’ve contacted, who replied, and when I should follow up. So, I decided to fix it. The twist? I’m not a developer. I dove into what’s now a trending buzzword - **vibe coding** - eager to see if I could pull it off without ever being a hands-on coder. Even with a computer science degree, my strengths have always been at the strategic level: partnering with developers, translating between business and technical teams, and aligning everyone to deliver real value. Vibe coding, in this sense, means creating something complex through initiative, AI collaboration, and a lot of trial and error.

---

## The Problem
Honestly, I was too lazy to keep juggling Gmail snoozes for follow-ups and then spend time writing each one from scratch. I needed a system that:
* Detects when I send an initial outreach email.
* Waits 7 days.
* Checks if the recipient replied.
* If not, drafts a personalized follow-up in my Gmail.
* Logs everything so I never send two follow-ups to the same person.

---

## The Vision
I didn’t want just reminders - I wanted automation that:
* Reads my sent mail in real time.
* Classifies emails as **INITIAL** or **REPLY** using AI.
* Pulls the full thread for context.
* Writes a follow-up in my tone.
* Creates a Gmail draft for review.
* Keeps a record in Google Sheets.

---

## The Stack
* **n8n** - The automation engine.
* **Gmail API** - To watch sent messages and create drafts.
* **OpenAI** - For classification and follow-up generation.
* **Google Sheets** - To log and deduplicate outreach.
* **JavaScript (Code Nodes)** - To tie the logic together.

---

## The Build
* **Gmail Trigger** - Watches for sent mail.
* **OpenAI Classifier** - Decides if an email is an initial outreach or a reply.
* **Code Node** - Extracts recipient, thread ID, date, and calculates email age.
* **IF Node** - Filters for initial outreach older than 7 days with no reply.
* **OpenAI Follow-Up Writer** - Generates a personalized draft.
* **Gmail Draft Node** - Saves the follow-up as a draft.
* **Google Sheets Append** - Logs every initial outreach to prevent duplicates.
* **One-Time Backfill** - Pulled older outreach emails into the system.

---

## The Challenges
* **Backfill**: Gmail’s trigger only works going forward, so I had to run a historical search for older emails.
* **Data Structure Learning Curve**: Figuring out $json in n8n without prior experience took time.
* **AI Output Consistency**: Ensuring AI responses were valid JSON.
* **Undefined Errors**: Fixed by adding checks for missing fields.

---

## The Wins
* **No More Mental Load**: Every follow-up is on time.
* **Fully Personalized**: AI drafts include details from the original conversation.
* **Time Savings**: About 10 minutes saved per outreach.
* **Skill Boost**: Learned enough JavaScript to debug and customize automation.

---

## Beyond Email Follow-Ups
While this project focused on professional email follow-ups, the same framework can easily be adapted for:
* Customer support ticket follow-ups.
* Incident management escalations.
* Sales pipeline check-ins.
* Internal project reminders, and more.
If the workflow can read a trigger, assess the context, and draft a response - it can be customized for it.

---

## Key Takeaways for Non-Developers
* You can build powerful, code-heavy workflows without being a coder.
* AI can bridge the gap between idea and execution.
* Visual automation tools like n8n become far more capable with a touch of scripting.

I started this thinking I’d just automate reminders. I ended up building an AI-powered email assistant. If I can vibe code my way into this, you can too.
        `,
    },
    {
        slug: 'a-future-post',
        title: 'A Future Post',
        date: 'Coming Soon',
        summary: 'A look ahead at future topics, including AI-driven workflows, automation pipelines, and advanced prompt engineering.',
        content: '',
    },
];

// Function to render a single blog post from its data.
function renderBlogPost(slug) {
    const post = blogPosts.find(p => p.slug === slug);
    if (!post) {
        return `<div class="text-center py-20"><h1 class="text-3xl font-bold text-white mb-4">Post not found.</h1><p class="text-gray-400">Please check the URL or return to the blog list.</p></div>`;
    }

    // Use a library to convert Markdown content to HTML
    const formattedContent = marked.parse(post.content || '');

    return `
        <div class="max-w-4xl mx-auto px-4 py-8">
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-2">${post.title}</h1>
            <p class="text-gray-500 mb-6">${post.date}</p>
            <div class="prose prose-dark max-w-none">
                ${formattedContent}
            </div>
        </div>
    `;
}

// ======================================================================= //
// END: ADDITIONS FOR THE BLOG FEATURE                                     //
// ======================================================================= //


// The HTML content for all pages is stored in this template literal.
const pageTemplates = `
<style>
    /* This style block provides the visual feedback for the active engine selector button. */
    .engine-selector-btn.active {
        background-color: #4F46E5; /* A brand-aligned blue color */
        color: #FFFFFF;
        font-weight: 600;
    }
</style>
<div id="pages-container">
    <div id="home" class="page">
        <section class="py-16 md:py-20">
            <div class="container mx-auto px-4">
                <div class="grid md:grid-cols-3 gap-8 md:gap-12 items-center">
                    <div class="md:col-span-1 flex justify-center md:justify-start">
                        <img src="https://mayur-mehta-portfolio.netlify.app/portfolio_profile.jpg" alt="Mayur Mehta Headshot" class="rounded-full w-56 h-56 md:w-72 md:h-72 object-cover border-4 border-gray-700 shadow-lg">
                    </div>
                    <div class="md:col-span-2 text-center md:text-left">
                        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Delivering Scalable Solutions in AI, Automation and Business Systems </h1>
                        <p class="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto md:mx-0 mb-8">
                            Hi, I'm Mayur—a technical program manager and builder passionate about turning ambitious ideas into scalable reality. From delivering automation solutions impacting $1B in annual transactions at the enterprise level to building AI-powered solutions from the ground up, I specialize in bridging business vision with technical execution. I lead cross-functional teams to design, launch, and continuously improve high-impact programs across analytics, AI, enterprise applications, and operations.
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

    <div class="project-card bg-gray-800/50 p-6 rounded-xl border border-gray-700 cursor-pointer" data-modal-target="project3-modal">
      <h3 class="text-2xl font-bold text-brand-primary mb-2">Automated Follow-Up Assistant</h3>
      <p class="text-gray-400 mb-4">
        Classifies sent outreach, checks for no-reply after 7 days, drafts a context-aware follow-up, and creates a review-ready Gmail draft.
      </p>
      <div class="flex flex-wrap gap-2">
        <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Process Automation</span>
        <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">n8n</span>
        <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">OpenAI</span>
        <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Gmail API</span>
      </div>
    </div>
  </div>
</div>
    <div id="blogs" class="page hidden">
        <div class="text-center py-20">
            <h1 class="text-5xl font-bold text-white mb-4">My Blog</h1>
            <p class="text-xl text-gray-400 mb-12">A collection of my thoughts on technology, product management, and more.</p>
        </div>
        <div id="blog-list-container" class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${blogPosts.map(post => `
                <a href="#blogs/${post.slug}" class="blog-card block bg-gray-800/50 p-6 rounded-xl border border-gray-700 transition-transform hover:scale-[1.02] hover:bg-gray-800/70">
                    <h3 class="text-xl font-bold text-brand-primary mb-2">${post.title}</h3>
                    <p class="text-gray-400 text-sm mb-4">${post.summary}</p>
                    <p class="text-gray-500 text-sm">${post.date}</p>
                </a>
            `).join('')}
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

                <div class="mt-6">
                    <label class="block text-lg font-semibold text-white mb-3 text-center">Select AI Engine</label>
                    <div id="engine-selector" class="flex w-full bg-gray-900 border border-gray-700 rounded-lg p-1">
                        <button class="engine-selector-btn flex-1 p-2 rounded-md transition-colors duration-300 active" data-engine="gemini">Gemini</button>
                        <button class="engine-selector-btn flex-1 p-2 rounded-md transition-colors duration-300" data-engine="chatgpt">ChatGPT</button>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mt-6">
                    <button id="generateResumeBtn" class="col-span-2 bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-primary transition-all duration-200 flex items-center justify-center disabled:bg-gray-600 disabled:opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                        Generate Resume
                    </button>
                    <button id="coverLetterBtn" class="bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-all duration-200 flex items-center justify-center disabled:bg-gray-600 disabled:opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        Generate Cover Letter
                    </button>
                    <button id="generateLinkedinBtn" class="bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 transition-all duration-200 flex items-center justify-center disabled:bg-gray-600 disabled:opacity-50">
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
                    <li><strong>Prompt Engineering: Crafting precise instructions to generate code for the UI, application logic, and backend functions.</strong></li>
                    <li><strong>Architectural Decisions: Making key decisions, such as separating the frontend from the backend, securing API keys with a serverless function, and designing a holistic database structure.</strong></li>
                    <li><strong>Debugging & Iteration: Collaboratively debugging issues related to API calls, data structures, and UI behavior.</strong></li>
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
	<div id="project3-modal" class="modal-backdrop hidden">
  <div class="modal-content">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold text-white">Automated Follow-Up Assistant</h2>
      <button class="close-modal-btn text-gray-400 hover:text-white text-3xl">&times;</button>
    </div>

    <div class="prose prose-dark max-w-none">
      <h3>The Solution</h3>
      <p>
        An end-to-end follow-up engine that watches my sent outreach, detects when 7+ days pass with no reply,
        drafts a context-aware nudge with the full thread, and leaves a review-ready Gmail draft—no manual reminders required.
      </p>

      <h3>My Role &amp; Approach</h3>
      <ul>
        <li>Deterministic LLM classification (INITIAL vs REPLY) with JSON-only output</li>
        <li>Full-thread fetch + context builder (ageDays, reply detection, recipient extraction)</li>
        <li>Eligibility gate: ≥7 days old and no recipient reply (OOO ignored)</li>
        <li>LLM-generated follow-up, saved as a Gmail <em>Draft</em> (never auto-send)</li>
        <li>Optional logging + dedupe (Sheets or static index)</li>
      </ul>

      <h3>Tech Stack</h3>
      <p>n8n, Gmail API, OpenAI GPT-4o, JavaScript Code nodes, Google Sheets (optional)</p>

      <h3>Flow Highlights</h3>
      <ol>
        <li>Gmail Trigger → AI Classify (INITIAL/REPLY)</li>
        <li>Merge → Filter INITIAL → Fetch Thread → Build Thread (ageDays, toHeader, reply detection)</li>
        <li>IF Eligible (≥7 days, no reply) → AI Draft → Gmail Create Draft</li>
        <li>Optional: Append to Sheet + dedupe</li>
      </ol>

      <div class="mt-6 flex items-center gap-3">
        <button
          class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800 transition"
          data-modal-target="project3-workflow-modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 10l4.553-2.276A2 2 0 0122 9.618V14.5a2 2 0 01-1.106 1.789L15 18M5 8h5M5 12h8M5 16h8" />
          </svg>
          View workflow
        </button>

        </div>

      <h3 class="mt-8">The Outcome</h3>
      <p>Hands-off, review-ready follow-ups with consistent tone. Increased reply reliability and time saved each week.</p>
    </div>
  </div>
</div>
<div id="project3-workflow-modal" class="modal-backdrop hidden">
  <div class="modal-content !max-w-[90vw] !w-[90vw] !h-[90vh] flex flex-col">
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-xl font-semibold text-white">Workflow Diagram</h2>
      <button class="close-modal-btn text-gray-400 hover:text-white text-3xl">&times;</button>
    </div>

    <div class="flex items-center gap-3 mb-3 text-sm text-gray-300">
      <span>Tip: scroll to zoom, drag to pan</span>
    </div>

    <div class="relative flex-1 overflow-auto rounded-lg border border-gray-700 bg-black/50">
      <img
        src="/workflow.png"
        alt="n8n follow-up workflow"
        class="block mx-auto select-none"
        style="max-width: none; width: 1800px; height: auto;"
        draggable="false"
      />
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
    const parser = new DOMParser();
    const doc = parser.parseFromString(pageTemplates, 'text/html');

    // Find the style tag within the parsed template
    const styleTag = doc.querySelector('style');
    if (styleTag) {
        // Move the styles to the document's head, which also removes it from the parsed doc's body
        document.head.appendChild(styleTag);
    }

    // Find the page content container in the main document.
    const pageContentContainer = document.querySelector('#page-content');
    
    // Check for a specific blog post route
    const hash = window.location.hash;
    const blogMatch = hash.match(/^#blogs\/(.+)$/);
    if (blogMatch) {
        const slug = blogMatch[1];
        pageContentContainer.innerHTML = renderBlogPost(slug);
    } else {
        // If it's not a blog post, append all the pages normally.
        const templateBody = doc.body;
        while (templateBody.firstChild) {
            document.body.appendChild(templateBody.firstChild);
        }
    }
}