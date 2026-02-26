import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("video-to-audio");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
