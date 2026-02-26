import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("pdf-metadata-remover");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
