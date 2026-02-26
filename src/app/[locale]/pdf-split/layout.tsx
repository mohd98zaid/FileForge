import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("pdf-split");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
