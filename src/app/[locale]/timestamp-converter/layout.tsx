import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("timestamp-converter");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
