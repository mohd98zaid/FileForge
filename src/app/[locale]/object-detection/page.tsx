"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

// We load TFJS dynamically to prevent SSR issues and heavy bundle loading on initial page render.
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const faqs = [
    { question: "Is my image or video sent to a server?", questionHi: "क्या मेरी छवि या वीडियो सर्वर पर भेजा जाता है?", answer: "No. All object detection processing happens locally inside your browser using TensorFlow.js. Your data never leaves your device.", answerHi: "नहीं। सभी ऑब्जेक्ट डिटेक्शन प्रोसेसिंग TensorFlow.js का उपयोग करके आपके ब्राउज़र के अंदर स्थानीय रूप से होती है। आपका डेटा कभी भी आपके डिवाइस से बाहर नहीं जाता है।" },
    { question: "Why is the first run slow?", questionHi: "पहली बार चलने में धीमी गति क्यों है?", answer: "The browser must download the COCO-SSD Artificial Intelligence model (~30MB) the very first time. Subsequent runs will be instantly loaded from your browser cache.", answerHi: "ब्राउज़र को पहली बार COCO-SSD आर्टिफिशियल इंटेलिजेंस मॉडल (~30MB) डाउनलोड करना होगा। बाद के रन आपके ब्राउज़र कैश से तुरंत लोड हो जाएंगे।" },
    { question: "What objects can it detect?", questionHi: "यह किन वस्तुओं का पता लगा सकता है?", answer: "The underlying COCO-SSD model can detect 80 common objects, including people, animals, vehicles, and everyday furniture.", answerHi: "अंतर्निहित COCO-SSD मॉडल 80 सामान्य वस्तुओं का पता लगा सकता है, जिनमें लोग, जानवर, वाहन और रोजमर्रा के फर्नीचर शामिल हैं।" }
];

export default function ObjectDetectionPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
    const [isLoadingModel, setIsLoadingModel] = useState(false);
    
    // Image Mode
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    
    // Webcam Mode
    const [isWebcamActive, setIsWebcamActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const requestRef = useRef<number>();
    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [predictions, setPredictions] = useState<cocoSsd.DetectedObject[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mode, setMode] = useState<"image" | "webcam">("image");

    useEffect(() => {
        // Init TFJS backend
        tf.setBackend('webgl').then(() => {
            // Backend initialized
        });
        
        return () => {
             if (requestRef.current) cancelAnimationFrame(requestRef.current);
             stopWebcam();
        };
    }, []);

    const loadModel = async () => {
        if (model) return model;
        setIsLoadingModel(true);
        try {
            const loadedModel = await cocoSsd.load({ base: "lite_mobilenet_v2" });
            setModel(loadedModel);
            return loadedModel;
        } catch (err) {
            console.error("Failed to load model", err);
            alert(isHi ? "एआई मॉडल लोड करने में विफल रहा।" : "Failed to load the AI model.");
            return null;
        } finally {
            setIsLoadingModel(false);
        }
    };

    // --- Image Handling ---

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            setSelectedImage(event.target?.result as string);
            setPredictions([]);
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d");
                ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
        };
        reader.readAsDataURL(file);
    };

    const detectImage = async () => {
        if (!imageRef.current) return;
        
        setIsProcessing(true);
        const m = await loadModel();
        if (!m) { setIsProcessing(false); return; }

        try {
            const preds = await m.detect(imageRef.current);
            setPredictions(preds);
            drawPredictions(preds, imageRef.current.width, imageRef.current.height);
        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    // --- Webcam Handling ---

    const startWebcam = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert(isHi ? "इस ब्राउज़र में वेबकैम समर्थित नहीं है।" : "Webcam not supported in this browser.");
            return;
        }
        
        const m = await loadModel();
        if (!m) return;
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current!.play();
                    setIsWebcamActive(true);
                    detectWebcamFrame(m);
                };
            }
        } catch (err) {
            console.error(err);
            alert(isHi ? "वेबकैम की अनुमति नहीं है।" : "Webcam permission denied.");
        }
    };

    const stopWebcam = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsWebcamActive(false);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        setPredictions([]);
        
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    const detectWebcamFrame = async (m: cocoSsd.ObjectDetection) => {
        if (!videoRef.current || videoRef.current.readyState !== 4) {
            requestRef.current = requestAnimationFrame(() => detectWebcamFrame(m));
            return;
        }

        const preds = await m.detect(videoRef.current);
        setPredictions(preds);
        
        // Use video element's natural dims
        drawPredictions(preds, videoRef.current.videoWidth, videoRef.current.videoHeight);
        
        requestRef.current = requestAnimationFrame(() => detectWebcamFrame(m));
    };


    // --- Canvas Drawing ---

    const drawPredictions = (preds: cocoSsd.DetectedObject[], width: number, height: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Match canvas intrinsic resolution to the source element (img or video)
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);

        // Styling
        ctx.lineWidth = 4;
        ctx.font = "bold 20px Inter, sans-serif";

        preds.forEach((prediction) => {
            const [x, y, w, h] = prediction.bbox;
            const text = `${prediction.class} (${Math.round(prediction.score * 100)}%)`;

            // Pick a color based on class length for pseudo-randomness
            const colors = ['#10b981', '#6366f1', '#f43f5e', '#f59e0b', '#0ea5e9'];
            ctx.strokeStyle = colors[prediction.class.length % colors.length];
            ctx.fillStyle = ctx.strokeStyle;

            // Box
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.stroke();

            // Label bg
            const textWidth = ctx.measureText(text).width;
            ctx.fillRect(x, y - 30, textWidth + 16, 30);
            
            // Label text
            ctx.fillStyle = "#ffffff";
            ctx.fillText(text, x + 8, y - 8);
        });
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    {isHi ? "एज एआई विजन" : "Edge AI Vision"}
                </div>
                <h1 className="section-title">{isHi ? "🔍 ऑब्जेक्ट डिटेक्शन" : "🔍 Object Detection"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "ब्राउज़र में सीधे 80 विभिन्न प्रकार की वस्तुओं का पता लगाएं" : "Detect 80 different types of objects directly in the browser completely offline"}</p>
            </div>

            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Mode Selector */}
                <div className="flex justify-center mb-8">
                    <div className="bg-slate-900 border border-slate-700 p-1 rounded-xl inline-flex">
                        <button 
                            onClick={() => { setMode("image"); stopWebcam(); }}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${mode === "image" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                        >
                            {isHi ? "फोटो अपलोड" : "Image Upload"}
                        </button>
                        <button 
                            onClick={() => { setMode("webcam"); setSelectedImage(null); }}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${mode === "webcam" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                        >
                            {isHi ? "लाइव वेबकैम" : "Live Webcam"}
                        </button>
                    </div>
                </div>

                <div className="glass-card p-6 flex flex-col items-center">
                    
                    {/* Media Container */}
                    <div className="relative w-full max-w-3xl aspect-[4/3] sm:aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-700/50 flex items-center justify-center">
                        
                        {/* Image Mode */}
                        {mode === "image" && (
                            <>
                                {selectedImage ? (
                                    // Use unoptimized standard HTML img for exact TFJS pixel access
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img 
                                        ref={imageRef}
                                        src={selectedImage} 
                                        alt="Upload" 
                                        onLoad={() => {
                                            if (model) detectImage();
                                        }}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏷️</div>
                                        <p className="text-slate-400">{isHi ? "एक छवि चुनें" : "Select an image to detect objects"}</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Webcam Mode */}
                        {mode === "webcam" && (
                            <div className="w-full h-full relative bg-black flex items-center justify-center">
                                {!isWebcamActive && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                                        <button onClick={startWebcam} className="btn-primary flex items-center gap-2">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                            {isHi ? "कैमरा शुरू करें" : "Start Camera"}
                                        </button>
                                    </div>
                                )}
                                <video 
                                    ref={videoRef}
                                    className="max-w-full max-h-full object-contain"
                                    playsInline
                                    muted
                                />
                            </div>
                        )}

                        {/* Unified Canvas Overlay */}
                        <canvas 
                            ref={canvasRef}
                            className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none z-10"
                        />

                        {/* Loading Overlays */}
                        {isLoadingModel && (
                            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                                <p className="text-white font-medium">{isHi ? "AI मॉडल डाउनलोड हो रहा है..." : "Downloading Edge AI Model (~32MB)..."}</p>
                                <p className="text-slate-400 text-sm mt-1">{isHi ? "यह केवल पहली बार होगा" : "This only happens on the first run"}</p>
                            </div>
                        )}
                        {isProcessing && !isLoadingModel && mode === "image" && (
                             <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-30">
                                <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    {/* Controls Footer */}
                    <div className="mt-8 flex flex-wrap gap-4 justify-center w-full">
                        {mode === "image" && (
                            <>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    id="upload-image-od"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                <label htmlFor="upload-image-od" className="btn-secondary cursor-pointer">
                                    {isHi ? "छवि अपलोड करें" : "Upload Image"}
                                </label>
                                
                                <button 
                                    onClick={detectImage}
                                    disabled={!selectedImage || isLoadingModel || isProcessing}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    {isHi ? "विश्लेषण करें" : "Detect Objects"}
                                </button>
                            </>
                        )}
                        
                        {mode === "webcam" && isWebcamActive && (
                            <button onClick={stopWebcam} className="btn-secondary text-red-400 hover:text-red-300 border-red-900/50 hover:border-red-500 hover:bg-red-500/10">
                                {isHi ? "कैमरा बंद करें" : "Stop Camera"}
                            </button>
                        )}
                    </div>
                </div>

                {/* Results Table */}
                {predictions.length > 0 && (
                    <div className="glass-card p-6 border-t-4 border-t-emerald-500 animate-fade-in">
                        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                            {isHi ? `पता लगाए गए ऑब्जेक्ट (${predictions.length})` : `Detected Objects (${predictions.length})`}
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {predictions.map((p, idx) => (
                                <div key={idx} className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 flex justify-between items-center group hover:border-indigo-500/50 transition-colors">
                                    <span className="font-semibold text-slate-200 capitalize">{p.class}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-emerald-500"
                                                style={{ width: `${p.score * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-mono text-slate-400">
                                            {Math.round(p.score * 100)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/object-detection" tools={ALL_TOOLS} />
        </div>
    );
}
