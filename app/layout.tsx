import "../src/app/globals.css";
import Logo from "@/components/Logo";
import NavigationBar from "@/components/NavigationBar";
import React from "react";

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
        {/* <div style={{ position: "absolute", top: 40, left: 40 }}>
          <Logo />
        </div> */}
        <NavigationBar />
        {children}
      </body>
    </html>
  );
}
