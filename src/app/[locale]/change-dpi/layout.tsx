import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("change-dpi");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
