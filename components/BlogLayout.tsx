"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "./Sidebar";

export function BlogLayout({
                               children,
                               title = "Dev Blog",
                           }: {
    children: React.ReactNode;
    title?: string;
}) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="md:hidden rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50"
                            onClick={() => setOpen(true)}
                            aria-label="Open menu"
                        >
                            ☰
                        </button>
                        <Link href="/" className="text-base font-semibold tracking-tight">
                            {title}
                        </Link>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                        <input
                            className="w-56 rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
                            placeholder="Search (placeholder)"
                        />
                    </div>
                </div>
            </header>

            {/* Body */}
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
                {/* Desktop sidebar */}
                <aside className="hidden md:block">
                    <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-auto rounded-2xl border bg-white shadow-sm">
                        <Sidebar />
                    </div>
                </aside>

                {/* Main */}
                <main>{children}</main>
            </div>

            {/* Footer */}
            <footer className="border-t bg-white">
                <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-neutral-600">
                    Footer 영역 (추후 GitHub / Email / RSS 등)
                </div>
            </footer>

            {/* Mobile drawer */}
            {open && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/30"
                        onClick={() => setOpen(false)}
                        aria-label="Close overlay"
                    />
                    <div className="absolute left-0 top-0 h-full w-[82%] max-w-sm bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <div className="text-sm font-semibold">Menu</div>
                            <button
                                type="button"
                                className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50"
                                onClick={() => setOpen(false)}
                                aria-label="Close menu"
                            >
                                ✕
                            </button>
                        </div>
                        <Sidebar onNavigate={() => setOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}