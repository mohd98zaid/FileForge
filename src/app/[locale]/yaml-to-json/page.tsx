"use client";

import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Copy, FileJson, ArrowRightLeft, AlertTriangle } from "lucide-react";
import yaml from "js-yaml";

export default function YamlToJsonTool() {
    const [yamlText, setYamlText] = useState("name: FileForge\nversion: 1.0.0\ndescription: The ultimate array of browser-tools\nfeatures:\n  - yaml_to_json\n  - offline_processing\nsettings:\n  theme: dark\n  autosave: true");
    const [jsonText, setJsonText] = useState("");
    const [error, setError] = useState("");
    const [direction, setDirection] = useState<"Y2J" | "J2Y">("Y2J"); // default YAML to JSON
    const [copiedSource, setCopiedSource] = useState<"LEFT" | "RIGHT" | null>(null);

    // Live conversion effect
    useEffect(() => {
        setError("");
        if (direction === "Y2J") {
            try {
                if (!yamlText.trim()) {
                    setJsonText("");
                    return;
                }
                const doc = yaml.load(yamlText);
                setJsonText(JSON.stringify(doc, null, 2));
            } catch (e: any) {
                setError(`YAML Parsing Error: ${e.message}`);
                // Don't modify JSON on error, let the user fix it
            }
        } else {
            try {
                if (!jsonText.trim()) {
                    setYamlText("");
                    return;
                }
                const doc = JSON.parse(jsonText);
                setYamlText(yaml.dump(doc, { indent: 2 }));
            } catch (e: any) {
                setError(`JSON Parsing Error: ${e.message}`);
            }
        }
    }, [yamlText, jsonText, direction]);

    const handleYamlChange = (val: string) => {
        if (direction !== "Y2J") setDirection("Y2J");
        setYamlText(val);
    };

    const handleJsonChange = (val: string) => {
        if (direction !== "J2Y") setDirection("J2Y");
        setJsonText(val);
    };

    const copyToClipboard = (text: string, type: "LEFT" | "RIGHT") => {
        navigator.clipboard.writeText(text);
        setCopiedSource(type);
        setTimeout(() => setCopiedSource(null), 2000);
    };

    return (
        <ToolLayout
            title="YAML ↔ JSON Converter"
            description="Two-way live format converter. Type in either box to dynamically convert between YAML and JSON syntax."
           
        >
            <div className="max-w-7xl mx-auto flex flex-col space-y-6">
                
                {/* Status Bar */}
                <div className="flex items-center justify-between glass-card px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center space-x-6">
                        <div className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase transition-colors ${direction === "Y2J" ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                            YAML
                        </div>
                        <ArrowRightLeft className={`w-5 h-5 transition-transform ${direction === "J2Y" ? 'rotate-180 text-blue-500' : 'text-orange-500'}`} />
                        <div className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase transition-colors ${direction === "J2Y" ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                            JSON
                        </div>
                    </div>
                    {error && (
                        <div className="flex items-center text-sm font-medium text-red-600 dark:text-red-400">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            {error}
                        </div>
                    )}
                </div>

                {/* Editor Split Pane */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
                    
                    {/* Left Pane - YAML */}
                    <div className={`flex flex-col bg-slate-50 dark:bg-slate-900 border-2 rounded-xl overflow-hidden shadow-sm relative transition-colors ${direction === "Y2J" ? 'border-orange-500/50' : 'border-slate-200 dark:border-slate-800'}`}>
                        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                            <span className="text-xs font-bold tracking-wider text-orange-600 dark:text-orange-500 uppercase">YAML Array / Object</span>
                            <button
                                onClick={() => copyToClipboard(yamlText, "LEFT")}
                                className="text-xs font-semibold text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 flex items-center"
                            >
                                {copiedSource === "LEFT" ? 'Copied!' : 'Copy'}
                                <Copy className="w-3 h-3 ml-1" />
                            </button>
                        </div>
                        <textarea
                            value={yamlText}
                            onChange={(e) => handleYamlChange(e.target.value)}
                            className="flex-1 w-full bg-transparent p-6 font-mono text-sm leading-relaxed outline-none resize-none text-slate-800 dark:text-slate-200"
                            placeholder="Type YAML here to auto-convert to JSON ->"
                            spellCheck={false}
                        />
                    </div>

                    {/* Right Pane - JSON */}
                    <div className={`flex flex-col bg-slate-50 dark:bg-slate-900 border-2 rounded-xl overflow-hidden shadow-sm relative transition-colors ${direction === "J2Y" ? 'border-blue-500/50' : 'border-slate-200 dark:border-slate-800'}`}>
                        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center">
                                <FileJson className="w-4 h-4 text-blue-500 mr-2" />
                                <span className="text-xs font-bold tracking-wider text-blue-600 dark:text-blue-500 uppercase">JSON Structure</span>
                            </div>
                            <button
                                onClick={() => copyToClipboard(jsonText, "RIGHT")}
                                className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center"
                            >
                                {copiedSource === "RIGHT" ? 'Copied!' : 'Copy'}
                                <Copy className="w-3 h-3 ml-1" />
                            </button>
                        </div>
                        <textarea
                            value={jsonText}
                            onChange={(e) => handleJsonChange(e.target.value)}
                            className="flex-1 w-full bg-transparent p-6 font-mono text-sm leading-relaxed outline-none resize-none text-blue-900 dark:text-blue-300"
                            placeholder="<- Type JSON here to auto-convert to YAML"
                            spellCheck={false}
                        />
                    </div>
                </div>

            </div>
        </ToolLayout>
    );
}
