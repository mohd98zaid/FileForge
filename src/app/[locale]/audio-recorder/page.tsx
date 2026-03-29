"use client";

import React, { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Mic, Square, Download, Play, RefreshCcw } from "lucide-react";

export default function AudioRecorderTool() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setAudioUrl(null);
            setRecordingTime(0);

            timerIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Error accessing microphone", err);
            alert("Could not access microphone. Please ensure permissions are granted.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        }
    };

    const resetRecording = () => {
        setAudioUrl(null);
        setRecordingTime(0);
        audioChunksRef.current = [];
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    return (
        <ToolLayout
            title="Audio & Voice Recorder"
            description="Record high-quality audio directly from your browser. 100% private and secure."
           
        >
            <div className="max-w-2xl mx-auto flex flex-col items-center space-y-8 mt-8">
                <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-red-100 dark:bg-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.5)]' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    <Mic className={`w-20 h-20 transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                </div>
                
                <div className="text-4xl font-mono font-bold text-slate-800 dark:text-slate-200">
                    {formatTime(recordingTime)}
                </div>

                {!isRecording && !audioUrl ? (
                    <Button 
                        onClick={startRecording}
                        className="py-4 px-12 text-lg bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-red-500/30 transition-all font-bold tracking-wider"
                    >
                        START RECORDING
                    </Button>
                ) : isRecording ? (
                    <Button 
                        onClick={stopRecording}
                        className="py-4 px-12 text-lg bg-slate-800 hover:bg-slate-900 border-2 border-red-500 text-red-500 hover:text-red-400 rounded-full shadow-lg transition-all font-bold flex items-center gap-2"
                    >
                        <Square className="w-5 h-5 fill-current" /> STOP RECORDING
                    </Button>
                ) : null}

                {audioUrl && (
                    <div className="flex flex-col items-center w-full space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="w-full bg-slate-50 dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                            <audio src={audioUrl} controls className="w-full mb-6" />
                            <div className="flex gap-4">
                                <Button onClick={resetRecording} variant="secondary" className="gap-2">
                                    <RefreshCcw className="w-4 h-4" /> Record Again
                                </Button>
                                <a 
                                    href={audioUrl} 
                                    download={`VoiceRecording_${new Date().toISOString().replace(/[:.]/g, "-")}.webm`}
                                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-all"
                                >
                                    <Download className="w-4 h-4" /> Download Audio
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
