import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("audio-waveform-viewer");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
