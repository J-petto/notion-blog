import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

function renderRichText(rt: Array<{ plain_text: string; href: string | null; annotations?: any }>) {
    return rt.map((t, i) => {
        const text = t.plain_text;
        const href = t.href;
        if (href) {
            return (
                <a
                    key={i}
                    href={href}
                    className="text-primary underline underline-offset-4"
                    target="_blank"
                    rel="noreferrer"
                >
                    {text}
                </a>
            );
        }
        return <span key={i}>{text}</span>;
    });
}

function getChildren(block: BlockObjectResponse): BlockObjectResponse[] {
    return (block as any).__children ?? [];
}

export function NotionRenderer({ blocks }: { blocks: BlockObjectResponse[] }) {
    return (
        <div className="space-y-4">
            {blocks.map((b) => (
                <Block key={b.id} block={b} />
            ))}
        </div>
    );
}

function Block({ block }: { block: BlockObjectResponse }) {
    const children = getChildren(block);

    switch (block.type) {
        case "heading_1": {
            const v = block.heading_1;
            return (
                <>
                    <h1 className="mt-8 text-3xl font-bold tracking-tight text-text-main">
                        {renderRichText(v.rich_text as any)}
                    </h1>
                    {children.length > 0 && <NotionRenderer blocks={children} />}
                </>
            );
        }

        case "heading_2": {
            const v = block.heading_2;
            return (
                <>
                    <h2 className="mt-7 text-2xl font-bold tracking-tight text-text-main">
                        {renderRichText(v.rich_text as any)}
                    </h2>
                    {children.length > 0 && <NotionRenderer blocks={children} />}
                </>
            );
        }

        case "heading_3": {
            const v = block.heading_3;
            return (
                <>
                    <h3 className="mt-6 text-xl font-semibold tracking-tight text-text-main">
                        {renderRichText(v.rich_text as any)}
                    </h3>
                    {children.length > 0 && <NotionRenderer blocks={children} />}
                </>
            );
        }

        case "paragraph": {
            const v = block.paragraph;
            if (!v.rich_text?.length) return <div className="h-2" />;
            return (
                <>
                    <p className="leading-7 text-text-sub">{renderRichText(v.rich_text as any)}</p>
                    {children.length > 0 && <NotionRenderer blocks={children} />}
                </>
            );
        }

        case "bulleted_list_item": {
            const v = block.bulleted_list_item;
            return (
                <ul className="list-disc pl-6 text-text-sub">
                    <li className="leading-7">
                        {renderRichText(v.rich_text as any)}
                        {children.length > 0 ? <div className="mt-2"><NotionRenderer blocks={children} /></div> : null}
                    </li>
                </ul>
            );
        }

        case "numbered_list_item": {
            const v = block.numbered_list_item;
            return (
                <ol className="list-decimal pl-6 text-text-sub">
                    <li className="leading-7">
                        {renderRichText(v.rich_text as any)}
                        {children.length > 0 ? <div className="mt-2"><NotionRenderer blocks={children} /></div> : null}
                    </li>
                </ol>
            );
        }

        case "quote": {
            const v = block.quote;
            return (
                <>
                    <blockquote className="border-l-4 border-border bg-white/60 px-4 py-3 text-text-sub">
                        {renderRichText(v.rich_text as any)}
                    </blockquote>
                    {children.length > 0 && <NotionRenderer blocks={children} />}
                </>
            );
        }

        case "code": {
            const v = block.code;
            const codeText = (v.rich_text ?? []).map((t: any) => t.plain_text).join("");
            return (
                <pre className="overflow-x-auto rounded-2xl bg-code-bg p-4 text-sm text-code-text">
          <code>{codeText}</code>
        </pre>
            );
        }

        case "image": {
            const v = block.image;
            const url =
                v.type === "external" ? v.external.url : v.file.url;
            return (
                <figure className="rounded-2xl border border-border bg-white/70 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full rounded-xl object-cover" />
                </figure>
            );
        }

        case "divider":
            return <hr className="my-8 border-border" />;

        default:
            // 필요하면 점진적으로 블록 지원 확장
            return null;
    }
}