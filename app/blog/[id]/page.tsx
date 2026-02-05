import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogLayout } from "@/components/BlogLayout";
import { NotionRenderer } from "@/components/notion-renderer";
import { getAllBlocks, getVisiblePostPageByUniqueIdNumber } from "@/lib/post-detail";
import { getTitle, getSelectName, getCreatedTime, getLastEditedTime, getFilesFirstUrl } from "@/lib/notion-props";
import { extractDescriptionFromBlocks } from "@/lib/seo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://notion-blog-theta-tawny.vercel.app";

function formatDate(iso?: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

// ✅ 동적 메타데이터 (검색/공유 핵심)
export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
    const { id } = await params;
    const idNumber = Number(id);
    if (!Number.isFinite(idNumber)) return {};

    const page = await getVisiblePostPageByUniqueIdNumber(idNumber);
    if (!page) return { title: "Not Found" };

    const title = getTitle(page, "title") || `Post ${idNumber}`;
    const category = getSelectName(page, "category");
    const thumb = getFilesFirstUrl(page, "thumbnail"); // files&media
    const blocks = await getAllBlocks(page.id);
    const description = extractDescriptionFromBlocks(blocks, 160);

    const url = `${siteUrl}/blog/${idNumber}`;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            type: "article",
            url,
            title,
            description,
            siteName: "Tech Notes",
            locale: "ko_KR",
            images: thumb ? [{ url: thumb }] : undefined,
            tags: category ? [category] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: thumb ? [thumb] : undefined,
        },
    };
}

export default async function BlogDetailPage({
                                                 params,
                                             }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const idNumber = Number(id);
    if (!Number.isFinite(idNumber)) return notFound();

    const page = await getVisiblePostPageByUniqueIdNumber(idNumber);
    if (!page) return notFound();

    const blocks = await getAllBlocks(page.id);

    const title = getTitle(page, "title");
    const category = getSelectName(page, "category");
    const created = getCreatedTime(page, "creation_date");
    const updated = getLastEditedTime(page, "update_date");

    return (
        <BlogLayout title="Tech Notes">
            <article className="rounded-2xl border border-border bg-white/80 p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-text-muted">
                        {category ? (
                            <span className="mr-2 rounded-full bg-white px-2 py-1 text-text-sub ring-1 ring-border">
                {category}
              </span>
                        ) : null}
                        <span>작성 {formatDate(created)}</span>
                        {updated ? <span className="ml-2">· 수정 {formatDate(updated)}</span> : null}
                    </div>
                </div>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-main">{title}</h1>

                <div className="mt-8">
                    <NotionRenderer blocks={blocks} />
                </div>
            </article>
        </BlogLayout>
    );
}