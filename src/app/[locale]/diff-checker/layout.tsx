import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("diff-checker");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
