import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("video-compressor");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
