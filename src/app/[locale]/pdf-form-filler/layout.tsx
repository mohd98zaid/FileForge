import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("pdf-form-filler");

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
