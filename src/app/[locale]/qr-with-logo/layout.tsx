import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("qr-with-logo");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
