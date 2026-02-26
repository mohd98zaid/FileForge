import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("heic-to-jpg");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
