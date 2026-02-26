import { getToolMetadata, getToolSchema } from "@/lib/seo";

export const metadata = getToolMetadata("pdf-to-word");

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = getToolSchema("pdf-to-word");
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
