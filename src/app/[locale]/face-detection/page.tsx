"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

// Import FaceDetection and FilesetResolver dynamically via Next.js next/dynamic or just in-component logic
import { FaceDetector, FilesetResolver, Detection } from "@mediapipe/tasks-vision";

const faqs = [
    { question: "Is my image or video sent to a server?", questionHi: "क्या मेरी छवि या वीडियो सर्वर पर भेजा जाता है?", answer: "No. All face detection processing happens locally inside your browser using Google MediaPipe. Your data never leaves your device.", answerHi: "नहीं। सभी फेस डिटेक्शन प्रोसेसिंग गूगल मीडियापाइप का उपयोग करके आपके ब्राउज़र के अंदर स्थानीय रूप से होती है। आपका डेटा कभी भी आपके डिवाइस से बाहर नहीं जाता है।" },
    { question: "Can it detect multiple faces?", questionHi: "क्या यह कई चेहरों का पता लगा सकता है?", answer: "Yes, the AI model is capable of detecting and bounding multiple faces simultaneously in the same frame.", answerHi: "हां, एआई मॉडल एक ही फ्रेम में एक साथ कई चेहरों का पता लगाने में सक्षम है।" },
    { question: "What does the Blur function do?", questionHi: "ब्लर फंक्शन क्या करता है?", answer: "It applies a localized Gaussian blur filter strictly over the bounding boxes where faces are detected, useful for anonymizing photos instantly.", answerHi: "यह उन क्षेत्रों पर कड़ाई से एक गॉसियन ब्लर फ़िल्टर लागू करता है जहाँ चेहरों का पता लगाया जाता है, जो फ़ोटो को तुरंत गुमनाम करने के लिए उपयोगी है।" }
];

export default function FaceDetectionPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [faceDetector, setFaceDetector] = useState<FaceDetector | null>(null);
    const [isLoadingModel, setIsLoadingModel] = useState(false);
    
    // Image Mode
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    
    // Webcam Mode
    const [isWebcamActive, setIsWebcamActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const requestRef = useRef<number>();
    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [predictions, setPredictions] = useState<Detection[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mode, setMode] = useState<"image" | "webcam">("image");
    
    const [isBlurred, setIsBlurred] = useState(false);

    useEffect(() => {
        let detector: FaceDetector | null = null;
        
        const initModel = async () => {
            setIsLoadingModel(true);
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );
                detector = await FaceDetector.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
                        delegate: "GPU" // Attempt GPU acceleration
                    },
                    runningMode: "IMAGE"
                });
                setFaceDetector(detector);
            } catch (err) {
                console.error("Failed to load MediaPipe Face Detector:", err);
            } finally {
                setIsLoadingModel(false);
            }
        };

        initModel();

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            stopWebcam();
            if (detector) {
                detector.close();
            }
        };
    }, []);

    // --- Image Handling ---

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setIsBlurred(false);
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
        if (!imageRef.current || !faceDetector) return;
        setIsBlurred(false);
        
        // FaceDetector requires the running mode to be set properly. 
        // We set it to IMAGE during init.
        await faceDetector.setOptions({ runningMode: "IMAGE" });

        setIsProcessing(true);
        try {
            const detections = faceDetector.detect(imageRef.current);
            setPredictions(detections.detections);
            drawPredictions(detections.detections, imageRef.current.width, imageRef.current.height, false);
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
        
        if (!faceDetector) return;
        
        try {
            // Re-configure detector for video streams
            await faceDetector.setOptions({ runningMode: "VIDEO" });

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" }, // User-facing for face tools
                audio: false,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current!.play();
                    setIsWebcamActive(true);
                    detectWebcamFrame();
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
        
        // Reset detector mode back to image for future uploads
        if (faceDetector) {
            faceDetector.setOptions({ runningMode: "IMAGE" }).catch(e => console.error(e));
        }
    };

    const detectWebcamFrame = async () => {
        if (!videoRef.current || videoRef.current.readyState !== 4 || !faceDetector) {
            requestRef.current = requestAnimationFrame(detectWebcamFrame);
            return;
        }

        const nowInMs = Date.now();
        const detections = faceDetector.detectForVideo(videoRef.current, nowInMs);
        setPredictions(detections.detections);
        
        drawPredictions(
            detections.detections, 
            videoRef.current.videoWidth, 
            videoRef.current.videoHeight, 
            isBlurred // use state (though in a closure loop, it acts as a snapshot. Easiest is to avoid blur toggle in webcam for simple ux, or use a ref)
        );
        
        requestRef.current = requestAnimationFrame(detectWebcamFrame);
    };


    // --- Canvas Drawing ---

    const drawPredictions = (preds: Detection[], width: number, height: number, applyBlur: boolean) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);

        if (applyBlur && (mode === "image" && imageRef.current)) {
            // Draw original image first
            ctx.drawImage(imageRef.current, 0, 0, width, height);

            // Apply blur
            preds.forEach((prediction) => {
                if (!prediction.boundingBox) return;
                const { originX, originY, width: w, height: h } = prediction.boundingBox;
                
                // Add some padding to the bounding box so the entire head is usually blurred
                const padX = w * 0.15;
                const padY = h * 0.15;
                const bx = Math.max(0, originX - padX);
                const by = Math.max(0, originY - padY);
                const bw = w + padX * 2;
                const bh = h + padY * 2;

                ctx.filter = 'blur(15px)';
                ctx.drawImage(
                    imageRef.current!, 
                    bx, by, bw, Math.min(bh, imageRef.current!.naturalHeight - by), // source
                    bx, by, bw, Math.min(bh, height - by) // dest
                );
                ctx.filter = 'none';
            });
            return; // Exit out, we don't draw boxes if blurred.
        }

        // Draw normal Bounding Boxes
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#0ea5e9"; // Sky blue

        preds.forEach((prediction) => {
            if (!prediction.boundingBox) return;
            const { originX, originY, width: w, height: h } = prediction.boundingBox;

            // Box
            ctx.beginPath();
            ctx.rect(originX, originY, w, h);
            ctx.stroke();

            // Keypoints (eyes, nose, mouth corners, ears)
            if (prediction.keypoints) {
                ctx.fillStyle = "#f59e0b"; // Amber
                prediction.keypoints.forEach(keypoint => {
                    ctx.beginPath();
                    ctx.arc(keypoint.x * width, keypoint.y * height, 3, 0, 2 * Math.PI);
                    ctx.fill();
                });
            }
        });
    };

    const toggleBlur = () => {
        const newBlurState = !isBlurred;
        setIsBlurred(newBlurState);
        if (mode === "image" && imageRef.current) {
            drawPredictions(predictions, imageRef.current.width, imageRef.current.height, newBlurState);
        }
    };

    // --- Output Download ---
    const downloadCanvas = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `face-detection-output.png`;
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
    };


    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    {isHi ? "एज एआई विजन" : "Edge AI Vision"}
                </div>
                <h1 className="section-title">{isHi ? "👤 फेस डिटेक्शन" : "👤 Face Detection"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "स्वचालित रूप से चेहरों का पता लगाएं और छवियों और वीडियो में गोपनीयता के लिए उन्हें धुंधला करें" : "Detect faces automatically and blur them for privacy entirely offline"}</p>
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
                                    <img 
                                        ref={imageRef}
                                        src={selectedImage} 
                                        alt="Upload" 
                                        onLoad={() => {
                                            if (faceDetector) detectImage();
                                        }}
                                        className={`max-w-full max-h-full object-contain ${isBlurred ? 'opacity-0' : 'opacity-100'}`} // Hide underlying image visually if blurred canvas is covering it fully
                                    />
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🙎‍♂️</div>
                                        <p className="text-slate-400">{isHi ? "एक छवि चुनें" : "Select an image to detect faces"}</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Webcam Mode */}
                        {mode === "webcam" && (
                            <div className="w-full h-full relative bg-black flex items-center justify-center">
                                {!isWebcamActive && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                                        <button onClick={startWebcam} disabled={isLoadingModel || !faceDetector} className="btn-primary flex items-center gap-2">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                            {isHi ? "कैमरा शुरू करें" : "Start Camera"}
                                        </button>
                                    </div>
                                )}
                                <video 
                                    ref={videoRef}
                                    className="max-w-full max-h-full object-contain transform -scale-x-100" // Mirror for better UX
                                    playsInline
                                    muted
                                />
                            </div>
                        )}

                        {/* Unified Canvas Overlay */}
                        <canvas 
                            ref={canvasRef}
                            className={`absolute top-0 left-0 w-full h-full object-contain pointer-events-none z-10 ${mode === "webcam" ? "transform -scale-x-100" : ""}`}
                        />

                        {/* Loading Overlays */}
                        {isLoadingModel && (
                            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                                <p className="text-white font-medium">{isHi ? "AI मॉडल डाउनलोड हो रहा है..." : "Downloading MediaPipe Vision Model..."}</p>
                                <p className="text-slate-400 text-sm mt-1">{isHi ? "यह केवल पहली बार होगा" : "This only happens on the first run"}</p>
                            </div>
                        )}
                        {isProcessing && !isLoadingModel && mode === "image" && (
                             <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-30">
                                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    {/* Controls Footer */}
                    <div className="mt-8 flex flex-wrap gap-4 justify-center items-center w-full">
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
                                    disabled={!selectedImage || isLoadingModel || isProcessing || !faceDetector}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    {isHi ? "विश्लेषण करें" : "Detect Faces"}
                                </button>
                                
                                {predictions.length > 0 && selectedImage && (
                                    <>
                                        <div className="w-px h-8 bg-slate-700 mx-2 hidden sm:block"></div>
                                        <button 
                                            onClick={toggleBlur}
                                            className="bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl px-4 py-2 text-slate-200 transition-colors flex items-center gap-2"
                                        >
                                            {isBlurred ? (isHi ? "चेहरे दिखाएं" : "Show Faces") : (isHi ? "चेहरे धुंधले करें" : "Blur Faces")}
                                        </button>
                                        
                                        {isBlurred && (
                                            <button 
                                                onClick={downloadCanvas}
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-4 py-2 font-medium transition-colors flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                                {isHi ? "डाउनलोड करें" : "Download"}
                                            </button>
                                        )}
                                    </>
                                )}
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
                    <div className="glass-card p-6 border-t-4 border-t-blue-500 animate-fade-in text-center flex flex-col items-center justify-center">
                        <div className="text-4xl mb-2">👥</div>
                        <h3 className="text-lg font-bold text-slate-200 mb-1">
                            {isHi ? "चेहरे पाए गए" : "Faces Detected"}
                        </h3>
                        <p className="text-3xl font-black text-blue-400">{predictions.length}</p>
                        <p className="text-sm text-slate-400 mt-2 max-w-sm">
                            {isHi ? "सभी छवियाँ केवल आपके डिवाइस पर संसाधित की जाती हैं।" : "For highest accuracy, ensure good lighting and clear visibility of the features."}
                        </p>
                    </div>
                )}

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/face-detection" tools={ALL_TOOLS} />
        </div>
    );
}
