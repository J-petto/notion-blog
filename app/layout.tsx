import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
        <body className="bg-bg-main text-text-main">{children}</body>
        </html>
    );
}