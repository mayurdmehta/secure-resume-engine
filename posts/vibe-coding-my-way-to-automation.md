# Vibe Coding My Way to Automation — A Workflow for Email Follow-Ups and Beyond

## The Backstory

I wanted to see if I could actually ship something useful without being a hands-on coder, so I dove into **vibe coding** with my own little experiment.

I was buried in snoozed Gmail conversations, trying to remember who I’d emailed, who replied, and when I needed to follow up. It felt like the perfect thing to automate.

Even with a computer science degree, I’ve always been more about the strategic side: teaming up with developers, translating between business and tech, and making sure everyone’s aligned to deliver real value. For me, vibe coding was about taking initiative, collaborating with AI, and figuring it out through plenty of trial and error.

## The Problem

I was too lazy to juggle Gmail snoozes and then write every follow-up from scratch. I needed a system that:

- Detects when I send an initial outreach email  
- Waits 7 days  
- Checks if the recipient replied  
- If not, drafts a personalized follow-up in Gmail  
- Logs everything so I never double-follow-up

## The Vision

I wanted **automation** that:

- Reads my sent mail in real time  
- Classifies emails as **INITIAL** or **REPLY** using AI  
- Pulls the full thread for context  
- Writes a follow-up in **my tone**  
- Creates a Gmail draft for review (never auto-sends)  
- Keeps a record in Google Sheets

## The Stack

- **n8n** — the automation engine  
- **Gmail API** — watch sent messages and create drafts  
- **OpenAI** — classification + follow-up generation  
- **Google Sheets** — logging + dedupe  
- **JavaScript (Code Nodes)** — glue logic

## The Build

1. **Gmail Trigger** — watches for sent mail  
2. **OpenAI Classifier** — decides if an email is initial outreach or a reply  
3. **Code Node** — extracts recipient, thread ID, date, calculates age  
4. **IF Node** — passes only initial outreach older than 7 days with no reply  
5. **OpenAI Follow-Up Writer** — generates a personalized draft  
6. **Gmail Draft Node** — saves the follow-up as a draft  
7. **Google Sheets Append** — logs each initial outreach to prevent duplicates  
8. **One-Time Backfill** — pulled older outreach emails into the system

## The Challenges

- **Backfill:** Gmail’s trigger only works going forward, so I ran a historical search for older emails.  
- **Data Shapes:** Understanding `$json` in n8n without prior experience.  
- **AI Consistency:** Enforcing strict JSON responses from the classifier.  
- **Undefineds:** Defensive checks for missing fields removed most “undefined” errors.

## The Wins

- **No more mental load:** Every follow-up is on time.  
- **Fully personalized:** Drafts include context from the original conversation.  
- **Time savings:** ~10 minutes saved per outreach.  
- **Skill boost:** Enough JavaScript to debug and customize.

## Beyond Email Follow-Ups

The same pattern adapts well to:

- Customer support ticket follow-ups  
- Incident management escalations  
- Sales pipeline nudges  
- Internal project reminders

If a workflow can read a trigger, assess context, and draft a response, this approach can be customized for it.

## Key Takeaways for Non-Developers

- You can build powerful, code-heavy workflows without being a hands-on coder.  
- AI can bridge the gap between idea and execution.  
- Visual tools like **n8n** become far more capable with a touch of scripting.

I started out trying to automate reminders. I ended up building an AI-powered email assistant, [read more about it on my projects page.](https://www.mayur-mehta.com/#projects/automated-followup-assistant)
If I can vibe-code my way into this, you can too.
