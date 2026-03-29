"use client";

import { useLocale } from "next-intl";
import { useState, useRef } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "How does the Resume Builder work?", questionHi: "रेज़्यूमे बिल्डर कैसे काम करता है?", answer: "It allows you to fill out your professional details step-by-step. As you type, a live A4-sized preview is generated. Once finished, you can print or export it directly to PDF.", answerHi: "यह आपको अपने पेशेवर विवरण को चरण-दर-चरण भरने की अनुमति देता है। जैसे ही आप टाइप करते हैं, एक लाइव A4-आकार का पूर्वावलोकन उत्पन्न होता है। एक बार समाप्त होने के बाद, आप इसे सीधे पीडीएफ में प्रिंट या निर्यात कर सकते हैं।" },
    { question: "Is my data stored securely?", questionHi: "क्या मेरा डेटा सुरक्षित रूप से संग्रहीत है?", answer: "Yes, 100% of the data remains in your browser. We do not use any databases or servers to store your resume.", answerHi: "हाँ, 100% डेटा आपके ब्राउज़र में रहता है। हम आपके रेज़्यूमे को संग्रहीत करने के लिए किसी डेटाबेस या सर्वर का उपयोग नहीं करते हैं।" },
    { question: "How do I save it as a PDF?", questionHi: "मैं इसे पीडीएफ के रूप में कैसे सेट करूं?", answer: "Click 'Print / Save PDF'. Your browser's print dialog will open. Change the destination printer to 'Save as PDF' and ensure 'Background graphics' is enabled if colors are missing.", answerHi: "प्रिंट / सेव पीडीएफ पर क्लिक करें। आपके ब्राउज़र का प्रिंट डायलॉग खुल जाएगा। गंतव्य प्रिंटर को 'पीडीएफ के रूप में सहेजें' में बदलें और सुनिश्चित करें कि यदि रंग गायब हैं तो 'पृष्ठभूमि ग्राफिक्स' सक्षम है।" }
];

export default function ResumeBuilderPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    // --- Form State ---
    const [personal, setPersonal] = useState({
        name: "Alex Doe",
        email: "alex.doe@example.com",
        phone: "+91 98765 43210",
        location: "Mumbai, India",
        linkedin: "linkedin.com/in/alexdoe",
        summary: "Results-driven Software Engineer with 4 years of experience building scalable web applications. Passionate about clean code, user experience, and modern web technologies."
    });

    const [experience, setExperience] = useState([
        { id: 1, company: "Tech Solutions Pvt Ltd", role: "Frontend Developer", date: "Jan 2021 - Present", desc: "Led the development of the core React dashboard. Improved load times by 40% and mentored junior developers." },
        { id: 2, company: "Webify Agency", role: "Junior Web Developer", date: "Jun 2019 - Dec 2020", desc: "Built responsive client websites using HTML, CSS, and JS. Worked closely with the design team to implement pixel-perfect UI." }
    ]);

    const [education, setEducation] = useState([
        { id: 1, school: "University of Technology", degree: "B.Tech in Computer Science", date: "2015 - 2019", score: "CGPA: 8.5" }
    ]);

    const [skills, setSkills] = useState("JavaScript, TypeScript, React, Next.js, Node.js, Tailwind CSS, Git, Agile Methodology");

    // --- State Handlers ---
    const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPersonal({ ...personal, [e.target.name]: e.target.value });
    };

    const addExp = () => setExperience([...experience, { id: Date.now(), company: "", role: "", date: "", desc: "" }]);
    const updateExp = (id: number, field: string, value: string) => {
        setExperience(experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
    };
    const removeExp = (id: number) => setExperience(experience.filter(exp => exp.id !== id));

    const addEdu = () => setEducation([...education, { id: Date.now(), school: "", degree: "", date: "", score: "" }]);
    const updateEdu = (id: number, field: string, value: string) => {
        setEducation(education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
    };
    const removeEdu = (id: number) => setEducation(education.filter(edu => edu.id !== id));

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="animate-fade-in space-y-8 print:my-0 print:space-y-0">
            {/* Header - Hidden on Print */}
            <div className="text-center print:hidden">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {isHi ? "करियर टूल" : "Career Tools"}
                </div>
                <h1 className="section-title">{isHi ? "📄 रेज़्यूमे बिल्डर" : "📄 Resume Builder"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "मिनटों में एक पेशेवर, एटीएस-अनुकूल रेज़्यूमे बनाएं और इसे सीधे पीडीएफ में निर्यात करें।" : "Create a professional, ATS-friendly resume in minutes and export it directly to PDF."}</p>
            </div>

            <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8 items-start print:grid-cols-1 print:gap-0 print:max-w-none">
                
                {/* EDITOR PANEL - Hidden on Print */}
                <div className="glass-card p-6 h-[800px] overflow-y-auto custom-scrollbar border-t-4 border-t-emerald-500 print:hidden space-y-8">
                    <div className="flex justify-between items-center sticky top-0 bg-slate-900/90 backdrop-blur-md py-4 z-10 border-b border-slate-800 -mt-6 -mx-6 px-6 mb-6">
                        <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            {isHi ? "रेज़्यूमे संपादक" : "Resume Editor"}
                        </h2>
                        <button onClick={handlePrint} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                            {isHi ? "प्रिंट / सेव पीडीएफ" : "Print / PDF"}
                        </button>
                    </div>

                    {/* Personal Details */}
                    <section>
                        <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mb-4 text-emerald-300">{isHi ? "व्यक्तिगत विवरण" : "Personal Details"}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="text-xs text-slate-400">Full Name</label><input type="text" name="name" value={personal.name} onChange={handlePersonalChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-colors" /></div>
                            <div><label className="text-xs text-slate-400">Email</label><input type="email" name="email" value={personal.email} onChange={handlePersonalChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-colors" /></div>
                            <div><label className="text-xs text-slate-400">Phone</label><input type="text" name="phone" value={personal.phone} onChange={handlePersonalChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-colors" /></div>
                            <div><label className="text-xs text-slate-400">Location</label><input type="text" name="location" value={personal.location} onChange={handlePersonalChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-colors" /></div>
                            <div className="md:col-span-2"><label className="text-xs text-slate-400">LinkedIn / Portfolio URL</label><input type="text" name="linkedin" value={personal.linkedin} onChange={handlePersonalChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-colors" /></div>
                            <div className="md:col-span-2"><label className="text-xs text-slate-400">Professional Summary</label>
                                <textarea name="summary" value={personal.summary} onChange={handlePersonalChange} rows={3} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-colors resize-none"></textarea>
                            </div>
                        </div>
                    </section>

                    {/* Experience */}
                    <section>
                        <div className="flex justify-between items-end border-b border-slate-700 pb-2 mb-4">
                            <h3 className="text-lg font-semibold text-emerald-300">{isHi ? "कार्य अनुभव" : "Experience"}</h3>
                            <button onClick={addExp} className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded hover:bg-emerald-500/30 transition-colors">+ Add</button>
                        </div>
                        <div className="space-y-6">
                            {experience.map((exp, index) => (
                                <div key={exp.id} className="relative bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                    <button onClick={() => removeExp(exp.id)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                        <div><label className="text-[10px] uppercase tracking-wider text-slate-500">Job Title</label><input type="text" value={exp.role} onChange={e => updateExp(exp.id, 'role', e.target.value)} className="w-full bg-transparent border-b border-slate-700 px-1 py-1 text-sm text-slate-200 outline-none focus:border-emerald-500" placeholder="e.g. Software Engineer" /></div>
                                        <div><label className="text-[10px] uppercase tracking-wider text-slate-500">Company</label><input type="text" value={exp.company} onChange={e => updateExp(exp.id, 'company', e.target.value)} className="w-full bg-transparent border-b border-slate-700 px-1 py-1 text-sm text-slate-200 outline-none focus:border-emerald-500" placeholder="e.g. Google" /></div>
                                        <div className="md:col-span-2"><label className="text-[10px] uppercase tracking-wider text-slate-500">Date Range</label><input type="text" value={exp.date} onChange={e => updateExp(exp.id, 'date', e.target.value)} className="w-full bg-transparent border-b border-slate-700 px-1 py-1 text-sm text-slate-200 outline-none focus:border-emerald-500" placeholder="e.g. Jan 2020 - Present" /></div>
                                    </div>
                                    <label className="text-[10px] uppercase tracking-wider text-slate-500">Description / Achievements</label>
                                    <textarea value={exp.desc} onChange={e => updateExp(exp.id, 'desc', e.target.value)} rows={3} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500 mt-1 resize-none"></textarea>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    <section>
                        <div className="flex justify-between items-end border-b border-slate-700 pb-2 mb-4">
                            <h3 className="text-lg font-semibold text-emerald-300">{isHi ? "शिक्षा" : "Education"}</h3>
                            <button onClick={addEdu} className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded hover:bg-emerald-500/30 transition-colors">+ Add</button>
                        </div>
                        <div className="space-y-4">
                            {education.map((edu, index) => (
                                <div key={edu.id} className="relative bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <button onClick={() => removeEdu(edu.id)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                                    <div><label className="text-[10px] uppercase tracking-wider text-slate-500">Degree</label><input type="text" value={edu.degree} onChange={e => updateEdu(edu.id, 'degree', e.target.value)} className="w-full bg-transparent border-b border-slate-700 px-1 py-1 text-sm text-slate-200 outline-none focus:border-emerald-500" /></div>
                                    <div><label className="text-[10px] uppercase tracking-wider text-slate-500">Institution</label><input type="text" value={edu.school} onChange={e => updateEdu(edu.id, 'school', e.target.value)} className="w-full bg-transparent border-b border-slate-700 px-1 py-1 text-sm text-slate-200 outline-none focus:border-emerald-500" /></div>
                                    <div><label className="text-[10px] uppercase tracking-wider text-slate-500">Date Range</label><input type="text" value={edu.date} onChange={e => updateEdu(edu.id, 'date', e.target.value)} className="w-full bg-transparent border-b border-slate-700 px-1 py-1 text-sm text-slate-200 outline-none focus:border-emerald-500" /></div>
                                    <div><label className="text-[10px] uppercase tracking-wider text-slate-500">Grade / Score</label><input type="text" value={edu.score} onChange={e => updateEdu(edu.id, 'score', e.target.value)} className="w-full bg-transparent border-b border-slate-700 px-1 py-1 text-sm text-slate-200 outline-none focus:border-emerald-500" /></div>
                                </div>
                            ))}
                        </div>
                    </section>
                    
                    {/* Skills */}
                    <section>
                         <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mb-4 text-emerald-300">{isHi ? "कौशल" : "Skills"}</h3>
                         <textarea value={skills} onChange={e => setSkills(e.target.value)} rows={3} placeholder="Comma separated skills..." className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-colors resize-none"></textarea>
                    </section>

                </div>

                {/* LIVE PREVIEW A4 PAPER */}
                <div className="flex justify-center print:block print:w-full">
                    {/* A4 Paper Dimensions: ~210x297mm. At 96 DPI, that's roughly 794x1123 pixels. We'll use aspect ratio + max width for screen, and exact A4 for print. */}
                    <div className="bg-white w-full max-w-[794px] aspect-[1/1.414] shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none print:aspect-auto text-slate-900 border-t-[16px] border-emerald-600 print:border-emerald-600 flex flex-col p-10 print:p-0 text-sm font-sans transform scale-[0.6] sm:scale-75 md:scale-90 xl:scale-100 origin-top">
                        
                        {/* Header Section */}
                        <header className="mb-8 border-b-2 border-emerald-100 pb-6 print:pb-4">
                            <h1 className="text-4xl font-bold text-slate-800 uppercase tracking-wide mb-2">{personal.name || "Your Name"}</h1>
                            <div className="flex flex-wrap text-emerald-700 gap-y-1 gap-x-4 text-xs font-semibold uppercase tracking-wider">
                                {personal.email && <span>{personal.email}</span>}
                                {personal.phone && <span>• {personal.phone}</span>}
                                {personal.location && <span>• {personal.location}</span>}
                                {personal.linkedin && <span>• {personal.linkedin}</span>}
                            </div>
                        </header>

                        <div className="flex-1 space-y-8 print:space-y-6">
                            
                            {/* Summary Section */}
                            {personal.summary && (
                                <section>
                                    <h2 className="text-lg font-bold text-emerald-700 uppercase tracking-widest mb-3 border-b border-emerald-100 pb-1">Professional Summary</h2>
                                    <p className="text-slate-700 leading-relaxed text-[13px]">{personal.summary}</p>
                                </section>
                            )}

                            {/* Experience Section */}
                            {experience.length > 0 && (
                                <section>
                                    <h2 className="text-lg font-bold text-emerald-700 uppercase tracking-widest mb-4 border-b border-emerald-100 pb-1">Experience</h2>
                                    <div className="space-y-5 print:space-y-4">
                                        {experience.map(exp => (
                                            <div key={exp.id}>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="font-bold text-slate-800 text-[15px]">{exp.role} <span className="text-emerald-600 font-semibold text-[13px]">@ {exp.company}</span></h3>
                                                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">{exp.date}</span>
                                                </div>
                                                <p className="text-slate-600 leading-relaxed text-[13px] whitespace-pre-line">{exp.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Education Section */}
                            {education.length > 0 && (
                                <section>
                                    <h2 className="text-lg font-bold text-emerald-700 uppercase tracking-widest mb-4 border-b border-emerald-100 pb-1">Education</h2>
                                    <div className="space-y-4">
                                        {education.map(edu => (
                                            <div key={edu.id} className="flex justify-between items-baseline">
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-[15px]">{edu.degree}</h3>
                                                    <div className="text-emerald-700 font-medium text-[13px]">{edu.school} {edu.score && <span className="text-slate-500 ml-2">| {edu.score}</span>}</div>
                                                </div>
                                                <span className="text-xs font-semibold text-slate-500">{edu.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Skills Section */}
                            {skills && (
                                <section>
                                    <h2 className="text-lg font-bold text-emerald-700 uppercase tracking-widest mb-4 border-b border-emerald-100 pb-1">Skills</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.split(',').map((skill, i) => skill.trim() && (
                                            <span key={i} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded text-xs font-semibold tracking-wide">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                        </div>
                    </div>
                </div>

            </div>

            <div className="print:hidden">
                 <FAQSection items={faqs} />
                 <ToolLinks current="/resume-builder" tools={ALL_TOOLS} />
            </div>

            {/* Print Styles Injection */}
            <style jsx global>{`
                @media print {
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    nav, footer, .sidebar, .print\\:hidden {
                        display: none !important;
                    }
                    /* Reset Next.js layout constraints for printing */
                    main, .min-h-screen, .container {
                        margin: 0 !important;
                        padding: 0 !important;
                        max-width: none !important;
                        width: 100% !important;
                    }
                   @page {
                        size: A4;
                        margin: 1cm;
                    }
                }
            `}</style>
        </div>
    );
}
