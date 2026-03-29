import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("bpm-counter");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
