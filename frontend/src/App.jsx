import { useState } from "react";

const API_URL = "https://resume-generator-backend-5eo5.onrender.com/api/generate";

export default function App() {
  const [type, setType] = useState("resume");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [projects, setProjects] = useState("");

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setDoc(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setDoc(data);
    } catch {
      setError("Could not reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0b0f] text-[#ededf2]">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#7c5cfc]/20 blur-3xl print:hidden" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-[#7c5cfc]/10 blur-3xl print:hidden" />

      <header className="relative px-6 pt-10 text-center print:hidden">
        <p className="text-xs font-medium tracking-widest text-[#7c5cfc]">
          AI DOCUMENT GENERATOR
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Resume & Cover Letter, Instantly
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#8a8a99]">
          Fill in your details once, generate a polished document in seconds.
        </p>
      </header>

      <main className="relative mx-auto mt-10 grid max-w-6xl gap-6 px-6 pb-16 lg:grid-cols-2">
        {/* Form panel */}
        <div className="rounded-2xl border border-[#26262f] bg-[#16161d]/80 p-6 backdrop-blur print:hidden">
          <div className="relative mb-6 flex rounded-full border border-[#26262f] bg-[#0b0b0f] p-1 text-sm">
            <div
              className={`absolute top-1 h-[calc(100%-8px)] w-1/2 rounded-full bg-[#7c5cfc] transition-all duration-300 ${
                type === "cover-letter" ? "left-1/2" : "left-1"
              }`}
            />
            <button
              type="button"
              onClick={() => setType("resume")}
              className={`relative z-10 flex-1 rounded-full py-2 font-medium transition-colors ${
                type === "resume" ? "text-white" : "text-[#8a8a99]"
              }`}
            >
              Resume
            </button>
            <button
              type="button"
              onClick={() => setType("cover-letter")}
              className={`relative z-10 flex-1 rounded-full py-2 font-medium transition-colors ${
                type === "cover-letter" ? "text-white" : "text-[#8a8a99]"
              }`}
            >
              Cover Letter
            </button>
          </div>

          <form onSubmit={handleGenerate} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <FloatingInput label="Your Name" value={name} onChange={setName} />
              <FloatingInput label="Target Role" value={targetRole} onChange={setTargetRole} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FloatingInput label="Email" value={email} onChange={setEmail} />
              <FloatingInput label="Phone" value={phone} onChange={setPhone} />
            </div>

            {type === "resume" && (
              <FloatingInput label="Location" value={location} onChange={setLocation} />
            )}

            {type === "cover-letter" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <FloatingInput label="Company Name" value={companyName} onChange={setCompanyName} />
                  <FloatingInput
                    label="Recipient (optional)"
                    value={recipientName}
                    onChange={setRecipientName}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FloatingInput label="Your Location" value={location} onChange={setLocation} />
                  <FloatingInput
                    label="Company Address (optional)"
                    value={companyAddress}
                    onChange={setCompanyAddress}
                  />
                </div>
              </>
            )}

            <FloatingTextarea label="Skills (comma separated)" value={skills} onChange={setSkills} rows={2} />
            <FloatingTextarea label="Experience" value={experience} onChange={setExperience} rows={4} />

            {type === "resume" && (
              <>
                <FloatingTextarea label="Education" value={education} onChange={setEducation} rows={2} />
                <FloatingTextarea label="Projects" value={projects} onChange={setProjects} rows={3} />
              </>
            )}

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#7c5cfc] py-3 text-sm font-medium text-white transition-all hover:bg-[#8f6fff] disabled:opacity-60"
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {loading ? "Generating..." : `Generate ${type === "resume" ? "Resume" : "Cover Letter"}`}
            </button>
          </form>
        </div>

        {/* Preview panel */}
        <div className="relative rounded-2xl border border-[#26262f] bg-[#16161d]/80 p-6 backdrop-blur print:border-0 print:bg-transparent print:p-0">
          <div className="flex items-center justify-between print:hidden">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#8a8a99]">
              Preview
            </h2>
            {doc && (
              <button
                onClick={handlePrint}
                className="rounded-lg border border-[#7c5cfc]/40 bg-[#7c5cfc]/10 px-3 py-1.5 text-xs font-medium text-[#7c5cfc] transition-colors hover:bg-[#7c5cfc]/20"
              >
                Download as PDF
              </button>
            )}
          </div>

          <div className="mt-4 min-h-[500px] overflow-hidden rounded-xl shadow-2xl print:min-h-0 print:rounded-none print:shadow-none">
            {loading ? (
              <div className="flex h-full flex-col gap-3 bg-white p-8 animate-pulse">
                <div className="h-5 w-1/2 rounded bg-black/10" />
                <div className="h-3 w-full rounded bg-black/10" />
                <div className="h-3 w-full rounded bg-black/10" />
                <div className="h-3 w-3/4 rounded bg-black/10" />
              </div>
            ) : doc ? (
              type === "resume" ? (
                <ResumeDocument doc={doc} />
              ) : (
                <CoverLetterDocument doc={doc} />
              )
            ) : (
              <p className="flex h-[500px] items-center justify-center bg-white text-center text-sm text-black/40">
                Your generated document will appear here
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function ResumeDocument({ doc }) {
  return (
    <div
      style={{ fontFamily: "Georgia, serif" }}
      className="grid grid-cols-[1fr_2fr] text-sm print:grid-cols-[1fr_2fr]"
    >
      <div
        className="bg-[#4c3a8f] p-6 text-white"
        style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
      >
        <SidebarSection title="Contact">
          {doc.contact?.email && <p className="text-xs">{doc.contact.email}</p>}
          {doc.contact?.phone && <p className="mt-1 text-xs">{doc.contact.phone}</p>}
          {doc.contact?.location && <p className="mt-1 text-xs">{doc.contact.location}</p>}
        </SidebarSection>

        {doc.education?.length > 0 && (
          <SidebarSection title="Education">
            {doc.education.map((ed, i) => (
              <div key={i} className="mb-2 text-xs">
                <p className="font-semibold">{ed.degree}</p>
                {ed.institution && <p className="opacity-80">{ed.institution}</p>}
                {ed.dates && <p className="opacity-60">{ed.dates}</p>}
              </div>
            ))}
          </SidebarSection>
        )}

        {doc.skills?.length > 0 && (
          <SidebarSection title="Skills">
            <ul className="text-xs leading-relaxed">
              {doc.skills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </SidebarSection>
        )}
      </div>

      <div className="bg-white p-8 text-[#1a1a1a]">
        <h1 className="text-3xl font-bold">{doc.contact?.name}</h1>
        {doc.title && <p className="mt-1 text-sm text-[#4c3a8f]">{doc.title}</p>}

        {doc.summary && (
          <MainSection title="Profile">
            <p className="text-sm leading-relaxed">{doc.summary}</p>
          </MainSection>
        )}

        {doc.experience?.length > 0 && (
          <MainSection title="Experience">
            {doc.experience.map((job, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-sm font-semibold">
                  <span>
                    {job.title}
                    {job.company && ` — ${job.company}`}
                  </span>
                  <span className="text-xs font-normal text-black/50">{job.dates}</span>
                </div>
                <ul className="mt-1 list-disc pl-5 text-sm">
                  {job.bullets?.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </MainSection>
        )}

        {doc.projects?.length > 0 && (
          <MainSection title="Projects">
            {doc.projects.map((p, i) => (
              <div key={i} className="mb-2 text-sm">
                <span className="font-semibold">{p.name}</span>
                {p.stack && <span className="text-xs text-[#4c3a8f]"> · {p.stack}</span>}
                {p.description && <p className="text-xs text-black/70">{p.description}</p>}
              </div>
            ))}
          </MainSection>
        )}

        {doc.strengths?.length > 0 && (
          <MainSection title="Strengths">
            <ul className="list-disc pl-5 text-sm">
              {doc.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </MainSection>
        )}
      </div>
    </div>
  );
}

function CoverLetterDocument({ doc }) {
  return (
    <div style={{ fontFamily: "Georgia, serif" }} className="bg-white p-10 text-sm leading-relaxed text-[#1a1a1a]">
      {/* Sender block */}
      <div>
        <p className="font-semibold">{doc.contact?.name}</p>
        {doc.contact?.location && <p className="text-xs text-black/70">{doc.contact.location}</p>}
        {doc.contact?.email && <p className="text-xs text-black/70">{doc.contact.email}</p>}
        {doc.contact?.phone && <p className="text-xs text-black/70">{doc.contact.phone}</p>}
      </div>

      {/* Date */}
      <p className="mt-6 text-xs text-black/70">{doc.date}</p>

      {/* Recipient block */}
      <div className="mt-6">
        <p className="text-sm">{doc.recipientName || "Hiring Manager"}</p>
        {doc.companyName && <p className="text-sm">{doc.companyName}</p>}
        {doc.companyAddress && <p className="text-xs text-black/70">{doc.companyAddress}</p>}
      </div>

      {/* Body */}
      <p className="mt-8">{doc.greeting}</p>
      {doc.paragraphs?.map((p, i) => (
        <p key={i} className="mt-4">
          {p}
        </p>
      ))}
      <p className="mt-6">{doc.signoff}</p>
      <p className="mt-8 font-semibold">{doc.contact?.name}</p>
    </div>
  );
}

function SidebarSection({ title, children }) {
  return (
    <div className="mb-5">
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider opacity-90">{title}</h2>
      {children}
    </div>
  );
}

function MainSection({ title, children }) {
  return (
    <div className="mt-5">
      <h2 className="mb-1 border-b border-[#4c3a8f]/30 pb-1 text-xs font-bold uppercase tracking-wider text-[#4c3a8f]">
        {title}
      </h2>
      {children}
    </div>
  );
}

function FloatingInput({ label, value, onChange }) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="peer w-full rounded-lg border border-[#26262f] bg-[#0b0b0f] px-3 pt-5 pb-2 text-sm text-[#ededf2] outline-none focus:border-[#7c5cfc]"
      />
      <label className="pointer-events-none absolute left-3 top-2 text-xs text-[#8a8a99] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#7c5cfc]">
        {label}
      </label>
    </div>
  );
}

function FloatingTextarea({ label, value, onChange, rows }) {
  return (
    <div className="relative">
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="peer w-full resize-none rounded-lg border border-[#26262f] bg-[#0b0b0f] px-3 pt-5 pb-2 text-sm text-[#ededf2] outline-none focus:border-[#7c5cfc]"
      />
      <label className="pointer-events-none absolute left-3 top-2 text-xs text-[#8a8a99] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#7c5cfc]">
        {label}
      </label>
    </div>
  );
}