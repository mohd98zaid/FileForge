import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("audio-recorder");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
