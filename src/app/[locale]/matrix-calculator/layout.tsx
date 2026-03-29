import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("matrix-calculator");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
