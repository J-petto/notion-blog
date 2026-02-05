import type {
    BlockObjectResponse,
    PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { notion, NOTION_DATA_SOURCE_ID } from "./notion";

/** Notion results 타입 가드 */
function isPageObject(x: unknown): x is PageObjectResponse {
    return typeof x === "object" && x !== null && "properties" in x;
}

function isBlockObject(x: unknown): x is BlockObjectResponse {
    return typeof x === "object" && x !== null && "type" in x;
}

/** unique_id(number)로 show=true인 페이지 1개 조회 */
export async function getVisiblePostPageByUniqueIdNumber(idNumber: number) {
    const res = await notion.dataSources.query({
        data_source_id: NOTION_DATA_SOURCE_ID,
        filter: {
            and: [
                { property: "show", checkbox: { equals: true } },
                { property: "id", unique_id: { equals: idNumber } },
            ],
        },
        page_size: 1,
    });

    const page = res.results.find(isPageObject);
    return page ?? null;
}

/** 블록 리스트 페이지네이션 */
async function listBlockChildren(blockId: string): Promise<BlockObjectResponse[]> {
    const out: BlockObjectResponse[] = [];
    let cursor: string | undefined = undefined;

    while (true) {
        const resp = await notion.blocks.children.list({
            block_id: blockId,
            start_cursor: cursor,
            page_size: 100,
        });

        out.push(...resp.results.filter(isBlockObject));
        if (!resp.has_more) break;
        cursor = resp.next_cursor ?? undefined;
    }

    return out;
}

/** 블록 트리를 재귀적으로 붙여서 반환 */
export async function getAllBlocks(pageId: string): Promise<BlockObjectResponse[]> {
    const blocks = await listBlockChildren(pageId);

    // children이 있는 블록은 재귀적으로 붙임
    const withChildren = await Promise.all(
        blocks.map(async (b) => {
            if ("has_children" in b && b.has_children) {
                const children = await getAllBlocks(b.id);
                return Object.assign(b, { __children: children });
            }
            return b;
        }),
    );

    return withChildren;
}