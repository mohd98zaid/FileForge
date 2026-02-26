import { getToolMetadata, getToolSchema } from "@/lib/seo";

export const metadata = getToolMetadata("passport-photo-maker");

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = getToolSchema("passport-photo-maker");
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
