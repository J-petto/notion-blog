import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://notion-blog-theta-tawny.vercel.app";
const siteName = "Tech Notes";
const siteDescription = "Notion CMS 기반 기술 블로그. 개발 기록과 트러블슈팅을 정리합니다.";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: siteName,
        template: `%s | ${siteName}`,
    },
    description: siteDescription,
    applicationName: siteName,
    authors: [{ name: siteName }],
    alternates: {
        canonical: "/",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    openGraph: {
        type: "website",
        url: siteUrl,
        siteName,
        title: siteName,
        description: siteDescription,
        locale: "ko_KR",
    },
    twitter: {
        card: "summary_large_image",
        title: siteName,
        description: siteDescription,
    },
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
        {/* 여기 body 색상은 너의 tailwind 토큰을 유지 */}
        <body className="bg-bg-main text-text-main">{children}</body>
        </html>
    );
}