import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("graphing-calculator");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
