import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("time-tracker");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
