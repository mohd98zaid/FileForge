import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("statistics-calculator");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
