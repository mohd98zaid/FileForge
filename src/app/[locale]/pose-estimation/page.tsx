"use client";

import dynamic from 'next/dynamic';

// Load the entire client component dynamically with ssr: false.
// This prevents @tensorflow-models/pose-detection from importing @mediapipe/pose
// at build time, which crashes the Turbopack build due to a missing named export.
const PoseEstimationClient = dynamic(() => import('./PoseEstimationClient'), {
    ssr: false,
    loading: () => (
        <div className="animate-fade-in text-center py-40 text-slate-400 text-lg font-medium">
            Loading Pose Estimation Tool...
        </div>
    ),
});

export default function PoseEstimationPage() {
    return <PoseEstimationClient />;
}
