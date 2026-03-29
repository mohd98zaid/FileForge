import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("ics-generator");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
