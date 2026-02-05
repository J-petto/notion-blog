import Link from "next/link";
import { BlogLayout } from "@/components/BlogLayout";
import { getVisiblePosts } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(iso?: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

function PostCard({
                      href,
                      title,
                      date,
                      category,
                      thumbnail,
                  }: {
    href: string;
    title: string;
    date?: string;
    category?: string | null;
    thumbnail?: string | null;
}) {
    return (
        <Link
            href={href}
            className="overflow-hidden rounded-2xl border border-border bg-white/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
            {/* 썸네일 */}
            <div className="relative aspect-[16/9] w-full bg-bg-main">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={
                        thumbnail ??
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='100%25' height='100%25' fill='%23EEF2F7'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2364748B' font-size='28'%3Ethumbnail%3C/text%3E%3C/svg%3E"
                    }
                    alt=""
                    className="h-full w-full object-cover"
                />
            </div>

            {/* 카드 본문 */}
            <div className="flex h-full flex-col p-5">
                {/* 카테고리 */}
                {category ? (
                    <div className="mb-2">
            <span className="rounded-full bg-white px-2 py-1 text-xs text-text-sub ring-1 ring-border">
              {category}
            </span>
                    </div>
                ) : null}

                {/* 제목 */}
                <h2 className="line-clamp-2 text-lg font-semibold tracking-tight text-text-main">
                    {title}
                </h2>

                {/* 날짜 — 항상 맨 아래 */}
                <div className="mt-auto pt-4 text-right">
          <span className="text-xs text-text-muted">
            {formatDate(date)}
          </span>
                </div>
            </div>
        </Link>
    );
}

export default async function HomePage() {
    const posts = await getVisiblePosts();

    return (
        <BlogLayout title="Tech Notes">
            <section>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-text-main">Latest Posts</h1>
                    <p className="mt-1 text-sm text-text-sub">Notion CMS에서 가져온 글 목록</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((p) => (
                        <PostCard
                            key={p.notionPageId}
                            href={`/blog/${p.idNumber}`}
                            title={p.title}
                            date={p.creation_date ?? p.update_date}
                            category={p.category}
                            thumbnail={p.thumbnail}
                        />
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="mt-10 rounded-2xl border border-border bg-white/70 p-6 text-sm text-text-muted">
                        show가 체크된 글이 없습니다.
                    </div>
                )}
            </section>
        </BlogLayout>
    );
}