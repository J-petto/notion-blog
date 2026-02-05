import type { MetadataRoute } from "next";
import { getVisiblePosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://notion-blog-theta-tawny.vercel.app";

    const posts = await getVisiblePosts();

    const items: MetadataRoute.Sitemap = [
        { url: `${siteUrl}/`, lastModified: new Date() },
    ];

    for (const p of posts) {
        items.push({
            url: `${siteUrl}/blog/${p.idNumber}`,
            lastModified: p.update_date ? new Date(p.update_date) : new Date(),
        });
    }

    return items;
}