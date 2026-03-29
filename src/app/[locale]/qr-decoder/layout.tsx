import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("qr-decoder");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
