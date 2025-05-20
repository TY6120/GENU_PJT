import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GENU - あなたの理想の体型へ",
  description: "あなたの理想の体型を実現するための食事管理アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
