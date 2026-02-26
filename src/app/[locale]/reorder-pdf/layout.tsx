import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("reorder-pdf");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
