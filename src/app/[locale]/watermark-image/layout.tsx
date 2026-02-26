import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("watermark-image");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
