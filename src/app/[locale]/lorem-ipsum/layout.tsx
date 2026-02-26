import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("lorem-ipsum");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
