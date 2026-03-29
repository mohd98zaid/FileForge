import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("panchang");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
