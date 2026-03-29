import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("video-watermark");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
