"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

// ─── Dynamic imports (client-only) ──────────────────────────────────────────
// @tensorflow-models/pose-detection MUST be loaded dynamically — top-level imports
// cause Turbopack to trace into @mediapipe/pose which has a broken ESM export.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let tf: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let poseDetection: any = null;

const loadDeps = async () => {
    if (!tf) tf = await import('@tensorflow/tfjs');
    if (!poseDetection) poseDetection = await import('@tensorflow-models/pose-detection');
    return { tf, poseDetection };
};

const faqs = [
    { question: "How does Pose Estimation work?", questionHi: "पोज़ एस्टीमेशन कैसे काम करता है?", answer: "It uses an AI model called MoveNet to pinpoint 17 specific keypoints on a human body (like shoulders, elbows, and knees) in real-time.", answerHi: "यह रीयल-टाइम में मानव शरीर पर 17 विशिष्ट प्रमुख बिंदुओं (जैसे कंधे, कोहनी और घुटनों) को इंगित करने के लिए MoveNet नामक एक AI मॉडल का उपयोग करता है।" },
    { question: "Is my image or video sent to a server?", questionHi: "क्या मेरी छवि या वीडियो सर्वर पर भेजा जाता है?", answer: "No. All processing happens locally inside your browser using TensorFlow.js. Your data never leaves your device.", answerHi: "नहीं। सभी प्रसंस्करण TensorFlow.js का उपयोग करके आपके ब्राउज़र के अंदर स्थानीय रूप से होता है। आपका डेटा कभी भी आपके डिवाइस से बाहर नहीं जाता है।" },
    { question: "Why is the first run slow?", questionHi: "पहली बार चलने में धीमी गति क्यों है?", answer: "The browser must download the MoveNet Lightning AI model the very first time. Subsequent runs load instantly from your browser cache.", answerHi: "ब्राउज़र को पहली बार MoveNet लाइटनिंग AI मॉडल डाउनलोड करना होगा। बाद के रन आपके ब्राउज़र कैश से तुरंत लोड हो जाएंगे।" }
];

const CONNECTIONS = [
    [0, 1], [0, 2], [1, 3], [2, 4],
    [5, 6], [5, 7], [7, 9], [6, 8], [8, 10],
    [11, 12], [5, 11], [6, 12],
    [11, 13], [13, 15], [12, 14], [14, 16]
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PoseDetector = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Pose = any;

export default function PoseEstimationClient() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [detector, setDetector] = useState<PoseDetector | null>(null);
    const [isLoadingModel, setIsLoadingModel] = useState(false);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const [isWebcamActive, setIsWebcamActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const requestRef = useRef<number>();

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [poses, setPoses] = useState<Pose[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mode, setMode] = useState<"image" | "webcam">("image");

    useEffect(() => {
        const init = async () => {
            const { tf } = await loadDeps();
            await tf.setBackend('webgl');
            await tf.ready();
        };
        init();
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            stopWebcam();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadDetector = async (): Promise<PoseDetector | null> => {
        if (detector) return detector;
        setIsLoadingModel(true);
        try {
            const { poseDetection: pd } = await loadDeps();
            if (!pd) throw new Error("failed to load poseDetection");
            const model = pd.SupportedModels.MoveNet;
            const detectorConfig = {
                modelType: pd.movenet.modelType.SINGLEPOSE_LIGHTNING,
                enableSmoothing: true
            };
            const loaded = await pd.createDetector(model, detectorConfig);
            setDetector(loaded);
            return loaded;
        } catch (err) {
            console.error("Failed to load Pose Detector model", err);
            alert(isHi ? "एआई मॉडल लोड करने में विफल रहा।" : "Failed to load the AI model.");
            return null;
        } finally {
            setIsLoadingModel(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            setSelectedImage(event.target?.result as string);
            setPoses([]);
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
        const m = await loadDetector();
        if (!m) { setIsProcessing(false); return; }
        try {
            const detectedPoses = await m.estimatePoses(imageRef.current);
            setPoses(detectedPoses);
            drawPoses(detectedPoses, imageRef.current.width, imageRef.current.height);
        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    const startWebcam = async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            alert(isHi ? "इस ब्राउज़र में वेबकैम समर्थित नहीं है।" : "Webcam not supported in this browser.");
            return;
        }
        const m = await loadDetector();
        if (!m) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current!.play();
                    setIsWebcamActive(true);
                    detectWebcamFrame(m);
                };
            }
        } catch {
            alert(isHi ? "वेबकैम की अनुमति नहीं है।" : "Webcam permission denied.");
        }
    };

    const stopWebcam = () => {
        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
            videoRef.current.srcObject = null;
        }
        setIsWebcamActive(false);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        setPoses([]);
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    const detectWebcamFrame = async (m: PoseDetector) => {
        if (!videoRef.current || videoRef.current.readyState !== 4) {
            requestRef.current = requestAnimationFrame(() => detectWebcamFrame(m));
            return;
        }
        try {
            const detectedPoses = await m.estimatePoses(videoRef.current);
            setPoses(detectedPoses);
            drawPoses(detectedPoses, videoRef.current.videoWidth, videoRef.current.videoHeight);
        } catch (e) { console.error(e); }
        requestRef.current = requestAnimationFrame(() => detectWebcamFrame(m));
    };

    const drawPoses = (detectedPoses: Pose[], width: number, height: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        const keypointColor = "#10b981";
        const skeletonColor = "#f43f5e";
        const threshold = 0.3;

        detectedPoses.forEach((pose) => {
            ctx.strokeStyle = skeletonColor;
            ctx.lineWidth = 4;
            CONNECTIONS.forEach(([i, j]) => {
                const kp1 = pose.keypoints[i];
                const kp2 = pose.keypoints[j];
                if (kp1 && kp2 && (kp1.score ?? 0) > threshold && (kp2.score ?? 0) > threshold) {
                    ctx.beginPath();
                    ctx.moveTo(kp1.x, kp1.y);
                    ctx.lineTo(kp2.x, kp2.y);
                    ctx.stroke();
                }
            });
            ctx.fillStyle = keypointColor;
            pose.keypoints.forEach((keypoint: any) => {
                if ((keypoint.score ?? 0) > threshold) {
                    ctx.beginPath();
                    ctx.arc(keypoint.x, keypoint.y, 6, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.fillStyle = "#ffffff";
                    ctx.beginPath();
                    ctx.arc(keypoint.x, keypoint.y, 2, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.fillStyle = keypointColor;
                }
            });
        });
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-sm font-medium mb-4">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    {isHi ? "एज एआई विजन" : "Edge AI Vision"}
                </div>
                <h1 className="section-title">{isHi ? "🏃‍♂️ पोज़ एस्टीमेशन" : "🏃‍♂️ Pose Estimation"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "मानव शरीर के अंगों का पता लगाएं और रीयल-टाइम में कंकाल के ओवरले बनाएं" : "Detect human body joints and draw a 17-keypoint skeleton overlay entirely offline"}</p>
            </div>

            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex justify-center mb-8">
                    <div className="bg-slate-900 border border-slate-700 p-1 rounded-xl inline-flex">
                        <button onClick={() => { setMode("image"); stopWebcam(); }} className={`px-6 py-2 rounded-lg font-medium transition-colors ${mode === "image" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}>
                            {isHi ? "फोटो अपलोड" : "Image Upload"}
                        </button>
                        <button onClick={() => { setMode("webcam"); setSelectedImage(null); }} className={`px-6 py-2 rounded-lg font-medium transition-colors ${mode === "webcam" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}>
                            {isHi ? "लाइव वेबकैम" : "Live Webcam"}
                        </button>
                    </div>
                </div>

                <div className="glass-card p-6 flex flex-col items-center">
                    <div className="relative w-full max-w-3xl aspect-[4/3] sm:aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-700/50 flex items-center justify-center">
                        {mode === "image" && (
                            <>
                                {selectedImage ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img ref={imageRef} src={selectedImage} alt="Upload" onLoad={() => { if (detector) detectImage(); }} className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="text-6xl mb-4">🧍‍♀️</div>
                                        <p className="text-slate-400">{isHi ? "एक छवि चुनें" : "Select an image with people to estimate poses"}</p>
                                    </div>
                                )}
                            </>
                        )}
                        {mode === "webcam" && (
                            <div className="w-full h-full relative bg-black flex items-center justify-center">
                                {!isWebcamActive && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                                        <button onClick={startWebcam} className="btn-primary flex items-center gap-2">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                            {isHi ? "कैमरा शुरू करें" : "Start Camera"}
                                        </button>
                                    </div>
                                )}
                                <video ref={videoRef} className="max-w-full max-h-full object-contain transform -scale-x-100" playsInline muted />
                            </div>
                        )}
                        <canvas ref={canvasRef} className={`absolute top-0 left-0 w-full h-full object-contain pointer-events-none z-10 ${mode === "webcam" ? "transform -scale-x-100" : ""}`} />
                        {isLoadingModel && (
                            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                                <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mb-4"></div>
                                <p className="text-white font-medium">{isHi ? "AI मॉडल डाउनलोड हो रहा है..." : "Downloading Edge AI Pose Model..."}</p>
                                <p className="text-slate-400 text-sm mt-1">{isHi ? "यह केवल पहली बार होगा" : "This only happens on the first run"}</p>
                            </div>
                        )}
                        {isProcessing && !isLoadingModel && mode === "image" && (
                            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-30">
                                <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4 justify-center w-full">
                        {mode === "image" && (
                            <>
                                <input type="file" accept="image/*" id="upload-pose" className="hidden" onChange={handleImageUpload} />
                                <label htmlFor="upload-pose" className="btn-secondary cursor-pointer">{isHi ? "छवि अपलोड करें" : "Upload Image"}</label>
                                <button onClick={detectImage} disabled={!selectedImage || isLoadingModel || isProcessing} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    {isHi ? "विश्लेषण करें" : "Detect Poses"}
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

                {poses.length > 0 && poses[0].keypoints && (
                    <div className="glass-card p-6 border-t-4 border-t-rose-500 animate-fade-in">
                        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                            {isHi ? "मुख्य बिंदु निर्देशांक" : "Keypoint Coordinates (Top Match)"}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {poses[0].keypoints.map((p: any, idx: number) => {
                                const confidence = Math.round((p.score ?? 0) * 100);
                                const isHighConfidence = confidence >= 30;
                                return (
                                    <div key={idx} className={`bg-slate-900/50 border rounded-xl p-3 flex flex-col justify-center items-center text-center transition-colors ${isHighConfidence ? 'border-slate-700 hover:border-emerald-500/50' : 'border-red-900/30 opacity-60'}`}>
                                        <span className="font-semibold text-slate-200 text-sm capitalize truncate w-full">{p.name || `Point ${idx}`}</span>
                                        <span className={`text-xs mt-1 font-mono ${isHighConfidence ? 'text-emerald-400' : 'text-red-400'}`}>{confidence}% Conf.</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/pose-estimation" tools={ALL_TOOLS} />
        </div>
    );
}
