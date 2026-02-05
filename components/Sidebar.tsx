import Link from "next/link";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
    return (
        <div className="h-full p-4">
            <div className="text-sm font-semibold text-text-main">Categories</div>

            <nav className="mt-3 flex flex-col gap-1 text-sm">
                {[
                    { label: "All", href: "/" },
                    { label: "Frontend", href: "/?cat=frontend" },
                    { label: "Backend", href: "/?cat=backend" },
                    { label: "DevOps", href: "/?cat=devops" },
                ].map((x) => (
                    <Link
                        key={x.href}
                        href={x.href}
                        onClick={onNavigate}
                        className="rounded-lg px-3 py-2 text-text-sub hover:bg-white/70 hover:text-text-main"
                    >
                        {x.label}
                    </Link>
                ))}
            </nav>

            <div className="mt-6 rounded-xl border border-border bg-white/70 p-3 text-xs text-text-muted">
                Sidebar 영역 (추후 태그/프로필/검색 추가)
            </div>
        </div>
    );
}