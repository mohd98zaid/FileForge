"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { SlidersHorizontal, Plus, Play, Pause, Trash2, Volume2, VolumeX } from "lucide-react";

interface Track {
    id: string;
    file: File;
    url: string;
    volume: number;
    muted: boolean;
    audioElement: HTMLAudioElement | null;
}

export default function AudioMixerTool() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [globalPlaying, setGlobalPlaying] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddTrack = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newTracks = files.filter(f => f.type.startsWith("audio/")).map(file => ({
            id: Math.random().toString(36).substring(7),
            file,
            url: URL.createObjectURL(file),
            volume: 1,
            muted: false,
            audioElement: null
        }));

        setTracks([...tracks, ...newTracks]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeTrack = (id: string) => {
        setTracks(tracks.filter(t => t.id !== id));
    };

    const toggleGlobalPlay = () => {
        if (globalPlaying) {
            tracks.forEach(t => t.audioElement?.pause());
        } else {
            tracks.forEach(t => t.audioElement?.play());
        }
        setGlobalPlaying(!globalPlaying);
    };

    const updateVolume = (id: string, vol: number) => {
        setTracks(tracks.map(t => {
            if (t.id === id) {
                if (t.audioElement) t.audioElement.volume = vol;
                return { ...t, volume: vol, muted: vol === 0 };
            }
            return t;
        }));
    };

    const toggleMute = (id: string) => {
        setTracks(tracks.map(t => {
            if (t.id === id) {
                const newMuted = !t.muted;
                if (t.audioElement) t.audioElement.muted = newMuted;
                return { ...t, muted: newMuted };
            }
            return t;
        }));
    };

    const bindAudioElement = (id: string, el: HTMLAudioElement | null) => {
        if (!el) return;
        setTracks(prev => prev.map(t => {
            if (t.id === id && !t.audioElement) {
                el.volume = t.volume;
                el.muted = t.muted;
                return { ...t, audioElement: el };
            }
            return t;
        }));
    };

    return (
        <ToolLayout
            title="Audio Mixer"
            description="A minimalist multi-track audio mixer. Play, mute, and balance volumes."
           
        >
            <div className="max-w-4xl mx-auto flex flex-col space-y-8">
                {/* Global Controls */}
                <div className="flex items-center justify-between p-6 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                    <div className="flex gap-4">
                        <Button 
                            onClick={toggleGlobalPlay} 
                            disabled={tracks.length === 0}
                            className={`w-14 h-14 rounded-full flex items-center justify-center ${globalPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'} text-white shadow-lg`}
                        >
                            {globalPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                        </Button>
                    </div>
                    <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="gap-2">
                        <Plus className="w-4 h-4" /> Add Track
                    </Button>
                    <input type="file" multiple accept="audio/*" ref={fileInputRef} onChange={handleAddTrack} className="hidden" />
                </div>

                {/* Mixing Board */}
                <div className="space-y-4">
                    {tracks.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-500">
                            <SlidersHorizontal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No tracks added yet. Add audio files to start mixing.</p>
                        </div>
                    ) : (
                        tracks.map(track => (
                            <div key={track.id} className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                                <audio 
                                    src={track.url} 
                                    ref={(el) => bindAudioElement(track.id, el)} 
                                    onEnded={() => setGlobalPlaying(false)}
                                    loop 
                                />
                                
                                <div className="flex-1 w-full min-w-0">
                                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{track.file.name}</h4>
                                    <p className="text-xs text-slate-500">{(track.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto flex-1">
                                    <button onClick={() => toggleMute(track.id)} className={`p-2 rounded-full ${track.muted ? 'bg-red-100 text-red-500 dark:bg-red-500/20' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                                        {track.muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                    </button>
                                    
                                    <input 
                                        type="range" 
                                        min="0" max="1" step="0.05"
                                        value={track.volume}
                                        onChange={(e) => updateVolume(track.id, parseFloat(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-emerald-500"
                                    />
                                    <span className="text-sm font-mono w-10 text-right">{Math.round(track.volume * 100)}%</span>
                                </div>

                                <Button variant="secondary" onClick={() => removeTrack(track.id)} className="shrink-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </ToolLayout>
    );
}
