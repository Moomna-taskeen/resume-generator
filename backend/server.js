const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Groq = require("groq-sdk");

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function extractJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  const jsonString = match ? match[0] : text;

  try {
    return JSON.parse(jsonString);
  } catch {
    const repaired = jsonString.replace(/([a-zA-Z])'([a-zA-Z])/g, "$1\\'$2");
    return JSON.parse(repaired);
  }
}

app.post("/api/generate", async (req, res) => {
  try {
    const {
      type,
      name,
      email,
      phone,
      location,
      targetRole,
      companyName,
      recipientName,
      companyAddress,
      skills,
      experience,
      education,
      projects,
    } = req.body;

    if (!type || !name || !targetRole) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let prompt;

    if (type === "resume") {
      prompt = `You are a professional resume writer. Based on the information below, generate a resume.

Name: ${name}
Target role: ${targetRole}
Skills: ${skills || "not provided"}
Experience: ${experience || "not provided"}
Education: ${education || "not provided"}
Projects: ${projects || "not provided"}

Respond with ONLY valid JSON, no markdown formatting, no code fences. Do not use apostrophes or contractions (write "I am" instead of "I'm") to avoid breaking JSON string formatting. Match exactly this schema:
{
  "title": "a short 3-part tagline like 'Full-Stack Developer · AI Enthusiast · CS Undergraduate', inferred from the role and background",
  "summary": "2-3 sentence professional summary",
  "skills": ["skill1", "skill2", "..."],
  "experience": [{"title": "", "company": "", "dates": "", "bullets": ["achievement 1", "achievement 2"]}],
  "education": [{"degree": "", "institution": "", "dates": ""}],
  "projects": [{"name": "", "stack": "short comma-separated tech list", "description": ""}],
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"]
}

Only include entries that can be reasonably inferred from the provided information. Do not invent false experience. Keep bullets achievement-focused and concise.`;
    } else if (type === "cover-letter") {
      prompt = `You are a professional cover letter writer. Based on the information below, generate a formal business cover letter.

Applicant name: ${name}
Target role: ${targetRole}
Company: ${companyName || "not specified"}
Recipient: ${recipientName || "Hiring Manager"}
Skills: ${skills || "not provided"}
Experience: ${experience || "not provided"}

Respond with ONLY valid JSON, no markdown formatting, no code fences. Do not use apostrophes or contractions (write "I am" instead of "I'm") to avoid breaking JSON string formatting. Match exactly this schema:
{
  "greeting": "e.g. Dear Hiring Manager,",
  "paragraphs": ["opening paragraph stating the role and a hook", "body paragraph connecting skills/experience to the role", "closing paragraph with a call to action"],
  "signoff": "e.g. Sincerely,"
}

Do not invent false experience. Keep it professional, 3-4 paragraphs total, tailored specifically to the target role and company if provided.`;
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.4,
    });

    const raw = completion.choices[0].message.content;
    const parsed = extractJson(raw);

    res.json({
      type,
      contact: { name, email, phone, location },
      targetRole,
      companyName,
      recipientName,
      companyAddress,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      ...parsed,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
