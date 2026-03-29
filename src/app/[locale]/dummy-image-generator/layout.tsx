import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("dummy-image-generator");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
