import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("gif-maker");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
