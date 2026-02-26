import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("convert-image");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
