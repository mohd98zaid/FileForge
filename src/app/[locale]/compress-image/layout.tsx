import { getToolMetadata, getToolSchema } from "@/lib/seo";

export const metadata = getToolMetadata("compress-image");

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = getToolSchema("compress-image");
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
