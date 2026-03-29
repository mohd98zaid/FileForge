import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("audio-mixer");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
