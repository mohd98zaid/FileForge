import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("compound-interest");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
