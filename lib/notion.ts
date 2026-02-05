import { Client } from "@notionhq/client";

export const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

export const NOTION_DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID!;