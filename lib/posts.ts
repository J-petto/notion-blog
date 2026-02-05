import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion, NOTION_DATA_SOURCE_ID } from "./notion";
import {
    getTitle,
    getSelectName,
    getUniqueIdNumber,
    getFilesFirstUrl,
    getCreatedTime,
    getLastEditedTime,
} from "./notion-props";

export type PostListItem = {
    notionPageId: string;
    idNumber: number;
    title: string;
    category: string | null;
    thumbnail: string | null;
    creation_date?: string;
    update_date?: string;
};

function isPageObject(x: unknown): x is PageObjectResponse {
    return typeof x === "object" && x !== null && "properties" in x;
}

export async function getVisiblePosts(): Promise<PostListItem[]> {
    const res = await notion.dataSources.query({
        data_source_id: NOTION_DATA_SOURCE_ID,
        filter: { property: "show", checkbox: { equals: true } },
        // update_date가 last_edited_time이면 sorts 가능
        sorts: [{ property: "update_date", direction: "descending" }],
    });

    return res.results
        .filter(isPageObject)
        .map((page) => {
            const idNumber = getUniqueIdNumber(page, "id") ?? 0;

            return {
                notionPageId: page.id,
                idNumber,
                title: getTitle(page, "title"),
                category: getSelectName(page, "category"),
                thumbnail: getFilesFirstUrl(page, "thumbnail"),
                creation_date: getCreatedTime(page, "creation_date"),
                update_date: getLastEditedTime(page, "update_date"),
            };
        })
        .filter((p) => p.idNumber !== 0 && p.title);
}