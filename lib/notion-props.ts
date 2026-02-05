import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export function getTitle(page: PageObjectResponse, propName: string): string {
    const p = page.properties[propName];
    if (!p || p.type !== "title") return "";
    return p.title.map((t) => t.plain_text).join("");
}

export function getSelectName(page: PageObjectResponse, propName: string): string | null {
    const p = page.properties[propName];
    if (!p || p.type !== "select") return null;
    return p.select?.name ?? null;
}

export function getCheckbox(page: PageObjectResponse, propName: string): boolean {
    const p = page.properties[propName];
    if (!p || p.type !== "checkbox") return false;
    return p.checkbox;
}

export function getUniqueIdNumber(page: PageObjectResponse, propName: string): number | null {
    const p = page.properties[propName];
    if (!p || p.type !== "unique_id") return null;
    return p.unique_id.number ?? null;
}

export function getCreatedTime(page: PageObjectResponse, propName: string): string | undefined {
    const p = page.properties[propName];
    if (!p || p.type !== "created_time") return undefined;
    return p.created_time;
}

export function getLastEditedTime(page: PageObjectResponse, propName: string): string | undefined {
    const p = page.properties[propName];
    if (!p || p.type !== "last_edited_time") return undefined;
    return p.last_edited_time;
}

/** files&media에서 첫 번째 파일 URL 추출 (external/file 모두 지원) */
export function getFilesFirstUrl(page: PageObjectResponse, propName: string): string | null {
    const p = page.properties[propName];
    if (!p || p.type !== "files") return null;

    const first = p.files[0];
    if (!first) return null;

    if (first.type === "external") return first.external.url;
    return first.file.url; // Notion hosted (시간 제한 URL일 수 있음)
}