"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

const faqs = [
    { question: "What is Image Classification?", questionHi: "इमेज क्लासिफिकेशन क्या है?", answer: "It is an Artificial Intelligence technique that analyzes an entire image and predicts what the main subject is (e.g., 'Golden Retriever', 'Coffee Mug', 'Sports Car').", answerHi: "यह एक आर्टिफिशियल इंटेलिजेंस तकनीक है जो पूरी छवि का विश्लेषण करती है और भविष्यवाणी करती है कि मुख्य विषय क्या है (उदा. 'गोल्डन रिट्रीवर', 'कॉफी मग', 'स्पोर्ट्स कार')।" },
    { question: "Is my image sent to a server?", questionHi: "क्या मेरी छवि सर्वर पर भेजी जाती है?", answer: "No. All processing happens locally inside your browser using TensorFlow.js. Your data never leaves your device.", answerHi: "नहीं। सभी प्रसंस्करण TensorFlow.js का उपयोग करके आपके ब्राउज़र के अंदर स्थानीय रूप से होता है। आपका डेटा कभी भी आपके डिवाइस से बाहर नहीं जाता है।" },
    { question: "How many things can it recognize?", questionHi: "यह कितनी चीजों को पहचान सकता है?", answer: "The underlying MobileNet model is trained on the ImageNet database and can recognize 1,000 distinct categories of objects, animals, and plants.", answerHi: "अंतर्निहित मोबाइलनेट मॉडल को इमेजनेट डेटाबेस पर प्रशिक्षित किया गया है और यह वस्तुओं, जानवरों और पौधों की 1,000 विशिष्ट श्रेणियों को पहचान सकता है।" }
];

export default function ImageClassifierPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
    const [isLoadingModel, setIsLoadingModel] = useState(false);
    
    // Image Mode
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const [predictions, setPredictions] = useState<{className: string, probability: number}[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const initTF = async () => {
            await tf.setBackend('webgl');
            await tf.ready();
        };
        initTF();
    }, []);

    const loadModel = async () => {
        if (model) return model;
        setIsLoadingModel(true);
        try {
            const loadedModel = await mobilenet.load({ version: 2, alpha: 1.0 });
            setModel(loadedModel);
            return loadedModel;
        } catch (err) {
            console.error("Failed to load MobileNet model", err);
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
            setPredictions([]);
        };
        reader.readAsDataURL(file);
    };

    const classifyImage = async () => {
        if (!imageRef.current) return;
        
        setIsProcessing(true);
        const m = await loadModel();
        if (!m) { setIsProcessing(false); return; }

        try {
             // Get top 5 predictions
             const preds = await m.classify(imageRef.current, 5);
             setPredictions(preds);
        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-sm font-medium mb-4">
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
                    {isHi ? "एज एआई विजन" : "Edge AI Vision"}
                </div>
                <h1 className="section-title">{isHi ? "🏷️ इमेज क्लासिफायर" : "🏷️ Image Classifier"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "1000+ श्रेणियों के विरुद्ध छवियों को पहचानें और वर्गीकृत करें" : "Identify and categorize the main subject of an image across 1000+ categories entirely offline"}</p>
            </div>

            <div className="max-w-5xl mx-auto space-y-6">

                <div className="glass-card p-6 flex flex-col items-center">
                    
                    {/* Media Container */}
                    <div className="relative w-full max-w-2xl aspect-[4/3] sm:aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-700/50 flex flex-col items-center justify-center">
                        
                        {selectedImage ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img 
                                ref={imageRef}
                                src={selectedImage} 
                                alt="Upload" 
                                onLoad={() => {
                                    if (model) classifyImage();
                                }}
                                className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${isProcessing ? 'opacity-50' : 'opacity-100'}`}
                            />
                        ) : (
                            <div className="text-center p-6 flex flex-col items-center">
                                <div className="text-6xl mb-4 text-violet-400">🪴</div>
                                <p className="text-slate-400 mb-6">{isHi ? "विश्लेषण करने के लिए एक छवि चुनें" : "Select an image to analyze its contents"}</p>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    id="upload-image-od-empty"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                <label htmlFor="upload-image-od-empty" className="btn-primary cursor-pointer hover:scale-105 transition-transform">
                                    {isHi ? "छवि ब्राउज़ करें" : "Browse Image"}
                                </label>
                            </div>
                        )}

                        {/* Loading Overlays */}
                        {isLoadingModel && (
                            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                                <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-4"></div>
                                <p className="text-white font-medium">{isHi ? "AI मॉडल डाउनलोड हो रहा है..." : "Downloading Edge AI MobileNet Model..."}</p>
                                <p className="text-slate-400 text-sm mt-1">{isHi ? "यह केवल पहली बार होगा" : "This only happens on the first run"}</p>
                            </div>
                        )}
                        {isProcessing && !isLoadingModel && (
                             <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-30">
                                <div className="bg-slate-900 border border-violet-500/50 text-violet-400 px-6 py-3 rounded-full flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
                                    <span className="font-medium animate-pulse">{isHi ? "विश्लेषण कर रहा है..." : "Analyzing Image..."}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Controls Footer */}
                    {selectedImage && (
                        <div className="mt-8 flex flex-wrap gap-4 justify-center w-full">
                            <input 
                                type="file" 
                                accept="image/*"
                                id="upload-image-od"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="upload-image-od" className="btn-secondary cursor-pointer">
                                {isHi ? "छवि बदलें" : "Change Image"}
                            </label>
                            
                            <button 
                                onClick={classifyImage}
                                disabled={!selectedImage || isLoadingModel || isProcessing}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                {isHi ? "वर्गीकरण करें" : "Classify"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Results List */}
                {predictions.length > 0 && (
                    <div className="glass-card p-6 border-t-4 border-t-violet-500 animate-fade-in max-w-2xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-violet-500"></span>
                                {isHi ? "AI भविष्यवाणियां" : "AI Predictions"}
                            </h3>
                            <span className="px-3 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full font-mono font-bold tracking-wider group relative cursor-help">
                                ImageNet 1K
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-2 bg-slate-800 text-slate-300 text-xs rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
                                    Classified against 1,000 distinct categories
                                </div>
                            </span>
                        </div>
                        
                        <div className="space-y-4">
                            {predictions.map((p, idx) => {
                                const confidence = Math.round(p.probability * 100);
                                const isTop = idx === 0;
                                
                                return (
                                    <div key={idx} className={`relative flex flex-col p-4 rounded-xl border ${isTop ? 'bg-violet-900/20 border-violet-500/50' : 'bg-slate-900 border-slate-800'}`}>
                                        <div className="flex justify-between items-center mb-2 relative z-10">
                                            <span className={`font-medium capitalize ${isTop ? 'text-violet-200 lg:text-lg' : 'text-slate-300'}`}>
                                                {p.className.split(',')[0]} {/* Many imagenet classes are comma separated lists of synonyms */}
                                            </span>
                                            <span className={`font-mono text-sm ${isTop ? 'text-violet-300 font-bold' : 'text-slate-500'}`}>
                                                {confidence}% match
                                            </span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative z-10">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ease-out ${isTop ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500' : 'bg-slate-600'}`}
                                                style={{ width: `${confidence}%` }}
                                            ></div>
                                        </div>
                                        
                                        {/* Background highlight for top result */}
                                        {isTop && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent rounded-xl pointer-events-none"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/image-classifier" tools={ALL_TOOLS} />
        </div>
    );
}
