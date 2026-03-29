import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("burn-subtitles");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
