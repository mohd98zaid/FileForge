import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("pdf-redaction");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
