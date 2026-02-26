import { getToolMetadata, getToolSchema } from "@/lib/seo";

export const metadata = getToolMetadata("exam-photo");

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = getToolSchema("exam-photo");
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
