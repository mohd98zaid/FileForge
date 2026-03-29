import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("style-transfer");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
