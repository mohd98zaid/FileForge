import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("simple-paint");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
