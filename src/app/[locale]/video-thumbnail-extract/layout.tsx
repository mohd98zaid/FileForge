import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("video-thumbnail-extract");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
