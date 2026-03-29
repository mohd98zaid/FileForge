import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("json-to-excel");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
