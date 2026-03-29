import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("video-green-screen");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
