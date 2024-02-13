import { Metadata } from "next";
import localFont from "next/font/local";
import StyledComponentsRegistry from "../lib/registry";
import "./global.css";
import Provider from "./provider";

export const metadata: Metadata = {
  title: "TrainLED",
  description: "A joking navigation app.",
};

const jfDotFont = localFont({
  src: "./JF-Dot-jiskan24.woff2",
  display: "swap",
  variable: "--font-jfdot",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={jfDotFont.className}>
      <body>
        <Provider>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </Provider>
      </body>
    </html>
  );
}
