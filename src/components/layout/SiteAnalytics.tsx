"use client";

import { Analytics } from "@vercel/analytics/next";

/**
 * 방문 분석(Vercel Web Analytics). 쿠키 없이 페이지 경로만 센다.
 * 이름은 URL에 실리지 않지만, 만일을 대비해 쿼리·해시는 지우고 경로만 보낸다.
 */
export function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        const url = new URL(event.url);
        return { ...event, url: `${url.origin}${url.pathname}` };
      }}
    />
  );
}
