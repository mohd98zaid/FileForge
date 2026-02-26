import { getToolMetadata, getToolSchema } from "@/lib/seo";

export const metadata = getToolMetadata("edit-pdf");

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = getToolSchema("edit-pdf");
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
