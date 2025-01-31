import type { Viewport } from "next";
import { Metadata } from "next";
import localFont from "next/font/local";
import { DevOverlay } from "../components/DevOverlay";
import StyledComponentsRegistry from "../lib/registry";
import "./global.css";
import Provider from "./provider";

export const metadata: Metadata = {
  title: "TrainLED",
  description:
    "TrainLEDは、日本全国の鉄道路線で使える新感覚のナビゲーションウェブアプリです。",
  appleWebApp: {
    title: "TrainLED",
    statusBarStyle: "black-translucent",
  },
};

const jfDotFont = localFont({
  src: "./JF-Dot-jiskan24.woff2",
  display: "swap",
  variable: "--font-jfdot",
});

export const viewport: Viewport = {
  themeColor: "#212121",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={jfDotFont.className}>
      <body>
        <Provider>
          <StyledComponentsRegistry><DevOverlay />{children}</StyledComponentsRegistry>
        </Provider>
      </body>
    </html>
  );
}
