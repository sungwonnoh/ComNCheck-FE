"use client";

import StyledComponentsRegistry from "../lib/registry";
import Container from "../components/Container";
import MobileWapper from "../components/MobileWapper";
import ThemeProviderWrapper from "./styles/ThemeProviderWrapper";
import BottomNavbar from "../components/BottomNavbar";
import GlobalStyle from "./styles/globalStyle";
import HeaderNavbar from "@/components/Header/HeaderNavbar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading/page";
import GoogleAnalytics from "../lib/GoogleAnalytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const hidePaths = ["/login", "/signup", "/setting"]; // 네비바 숨길 경로 배열
  const shouldHide = hidePaths.some((path) => pathname.startsWith(path));
  return (
    <html lang="ko">
      <head>
        {/* PWA 관련 태그를 직접 추가 (클라이언트 컴포넌트이므로 metadata 사용 불가) */}
        <meta name="application-name" content="comNcheck" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="comNcheck" />
        <meta
          name="description"
          content="컴퓨터공학부 학생이라면 놓치는 공지 없이 빠르게 체크"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0077FF" />

        <link rel="apple-touch-icon" href="/icons/logo-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        ) : null}
        <GlobalStyle />
        <StyledComponentsRegistry>
          <ThemeProviderWrapper>
            {loading ? (
              <Loading />
            ) : (
              <Container>
                {!shouldHide && <HeaderNavbar />}
                <MobileWapper>{children}</MobileWapper>
                {!shouldHide && <BottomNavbar />}
              </Container>
            )}
          </ThemeProviderWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
