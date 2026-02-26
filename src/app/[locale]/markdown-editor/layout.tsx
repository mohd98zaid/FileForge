import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("markdown-editor");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
