import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("excel-to-json");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
