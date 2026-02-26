import { getToolMetadata, getToolSchema } from "@/lib/seo";

export const metadata = getToolMetadata("remove-bg");

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = getToolSchema("remove-bg");
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
