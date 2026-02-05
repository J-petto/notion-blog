import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export function extractDescriptionFromBlocks(blocks: BlockObjectResponse[], maxLen = 160): string {
    const texts: string[] = [];

    for (const b of blocks) {
        if (b.type === "paragraph") {
            const rt = b.paragraph.rich_text ?? [];
            const line = rt.map((t: any) => t.plain_text).join("").trim();
            if (line) texts.push(line);
        }
        if (texts.join(" ").length >= maxLen) break;
    }

    const merged = texts.join(" ").replace(/\s+/g, " ").trim();
    if (!merged) return "기술 블로그 글입니다.";
    return merged.length > maxLen ? merged.slice(0, maxLen - 1) + "…" : merged;
}