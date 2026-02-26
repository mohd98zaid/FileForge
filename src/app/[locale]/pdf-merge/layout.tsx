import { getToolMetadata, getToolSchema } from "@/lib/seo";

export const metadata = getToolMetadata("pdf-merge");

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = getToolSchema("pdf-merge");
    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            {children}
        </>
    );
}
