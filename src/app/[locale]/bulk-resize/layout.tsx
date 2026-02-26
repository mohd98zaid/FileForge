import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("bulk-resize");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
