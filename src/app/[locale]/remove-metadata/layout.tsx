import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("remove-metadata");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
