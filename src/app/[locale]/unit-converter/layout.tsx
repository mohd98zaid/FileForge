import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("unit-converter");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
