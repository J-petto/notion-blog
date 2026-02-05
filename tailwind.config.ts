import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    main: '#EEF2F7',   // 메인 배경
                },
                primary: {
                    DEFAULT: '#1E3A8A', // 메인 포인트 (링크, 버튼)
                    light: '#3B82F6',
                },
                secondary: {
                    DEFAULT: '#64748B', // 보조 포인트
                    light: '#94A3B8',
                },
                text: {
                    main: '#0F172A',   // 본문
                    sub: '#334155',    // 서브 텍스트
                    muted: '#64748B',  // 설명, 날짜
                },
                border: {
                    DEFAULT: '#E2E8F0',
                },
                code: {
                    bg: '#0F172A',
                    text: '#E5E7EB',
                },
            },
        },
    },
    plugins: [],
};

export default config;