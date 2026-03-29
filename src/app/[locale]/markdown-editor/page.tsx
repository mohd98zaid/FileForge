"use client";

import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Copy, Code, Eye, FileDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// We'll use the existing ReactMarkdown installed in package.json and the newly added remarkGfm
export default function MarkdownEditorTool() {
    const [markdownText, setMarkdownText] = useState(`# Welcome to the Markdown Editor

This is a **live-preview** markdown editor. Type on the left, and see the formatted output on the right.

## Features Supported:
- **Bold**, *Italics*, and \`Code\`
- [Links to websites](https://example.com)
- > Blockquotes and callouts

### Code Blocks
\`\`\`javascript
function helloWorld() {
  console.log("Hello, FileForge!");
}
\`\`\`

### GitHub Flavored Markdown (GFM)
Remark-GFM enables advanced tables and task lists:

| Feature | Support |
| :--- | :---: |
| Tables | ✅ |
| Strikethrough | ~~Yes~~ |

- [x] Complete this task
- [ ] Read the documentation`);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(markdownText);
    };

    const downloadMarkdown = () => {
        const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "document.md";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <ToolLayout
            title="Markdown Editor"
            description="Write, format, and visualize GitHub-Flavored Markdown (GFM) with a real-time side-by-side preview."
           
        >
            <div className="max-w-7xl mx-auto flex flex-col space-y-4">
                
                {/* Toolbar */}
                <div className="flex items-center justify-between glass-card px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center space-x-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <Code className="w-5 h-5 text-indigo-500" />
                        <span>Live GFM Editor</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="secondary" size="sm" onClick={copyToClipboard} className="flex items-center">
                            <Copy className="w-4 h-4 mr-2" />
                            Copy MD
                        </Button>
                        <Button variant="primary" size="sm" onClick={downloadMarkdown} className="flex items-center bg-indigo-600 hover:bg-indigo-700 border-none">
                            <FileDown className="w-4 h-4 mr-2" />
                            Download .md
                        </Button>
                    </div>
                </div>

                {/* Editor Split Pane */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[700px]">
                    
                    {/* Left Pane - Input */}
                    <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm relative focus-within:ring-2 focus-within:ring-indigo-500/50 transition-shadow">
                        <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 flex items-center border-b border-slate-200 dark:border-slate-700">
                            <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Markdown Input</span>
                        </div>
                        <textarea
                            value={markdownText}
                            onChange={(e) => setMarkdownText(e.target.value)}
                            className="flex-1 w-full bg-transparent p-6 font-mono text-sm leading-relaxed outline-none resize-none text-slate-800 dark:text-slate-200 placeholder-slate-400"
                            placeholder="Type markdown here..."
                            spellCheck={false}
                        />
                    </div>

                    {/* Right Pane - Preview */}
                    <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 flex items-center border-b border-indigo-100 dark:border-indigo-500/20">
                            <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
                            <span className="text-xs font-bold tracking-wider text-indigo-800 dark:text-indigo-300 uppercase">HTML Preview</span>
                        </div>
                        
                        {/* 
                            We rely on Tailwind Typography natively. 
                            If \`prose\` is missing from tailwind config, we would install @tailwindcss/typography. 
                            However, we can build custom prose styles inline for now.
                        */}
                        <div className="flex-1 w-full overflow-y-auto p-8 
                            prose prose-slate dark:prose-invert max-w-none 
                            prose-headings:font-bold prose-headings:text-slate-800 dark:prose-headings:text-slate-100
                            prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                            prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
                            prose-pre:bg-slate-900 prose-pre:text-slate-50 prose-pre:border prose-pre:border-slate-800
                            prose-blockquote:border-l-indigo-500 prose-blockquote:bg-indigo-50 dark:prose-blockquote:bg-indigo-500/10 prose-blockquote:py-1 prose-blockquote:pl-4
                        ">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {markdownText}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>

            </div>
        </ToolLayout>
    );
}
