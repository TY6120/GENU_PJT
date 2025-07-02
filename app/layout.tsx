import "./globals.css";
import React from "react";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "GENU",
  description: "ユーザーの身体情報や好みに基づいて献立を自動提案するWebアプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body style={{ minHeight: "100vh", background: "#fff" }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
