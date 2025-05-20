"use client";
import { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import Logo from "@/components/Logo";
import { useRouter } from "next/router";

export default function MyPage() {
  // 仮のユーザーデータ
  const [user] = useState({
    age: 30,
    gender: "男性",
    height: 180.1,
    weight: 78.0,
    bodyFat: 20.0,
  });
  // 仮の理想データ
  const [ideal] = useState({
    weight: 78.0,
    bodyFat: 20.0,
  });
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* ロゴ */}
      <div style={{ position: "absolute", top: 40, left: 40 }}>
        <Logo />
      </div>
      {/* ナビゲーションバー */}
      <NavigationBar />
      {/* タイトル */}
      <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
        <h2
          style={{
            fontSize: 32,
            fontWeight: "bold",
            marginTop: 80,
            marginBottom: 40,
            textAlign: "center",
            letterSpacing: 2,
          }}
        >
          マイページ
        </h2>
        {/* 情報カード2カラム */}
        <div
          style={{
            width: "100%",
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 80,
            marginBottom: 40,
          }}
        >
          {/* 現在の身体情報カード */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 12px #eee",
              width: 320,
              padding: "32px 36px 24px 36px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: 20,
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              [現在の身体情報]
            </div>
            <div
              style={{
                width: "100%",
                fontSize: 17,
                marginBottom: 8,
                textAlign: "left",
              }}
            >
              年齢(才)：{user.age}
            </div>
            <div
              style={{
                width: "100%",
                fontSize: 17,
                marginBottom: 8,
                textAlign: "left",
              }}
            >
              性別：{user.gender}
            </div>
            <div
              style={{
                width: "100%",
                fontSize: 17,
                marginBottom: 8,
                textAlign: "left",
              }}
            >
              身長(cm)：{user.height}
            </div>
            <div
              style={{
                width: "100%",
                fontSize: 17,
                marginBottom: 8,
                textAlign: "left",
              }}
            >
              体重(kg)：{user.weight}
            </div>
            <div
              style={{
                width: "100%",
                fontSize: 17,
                marginBottom: 24,
                textAlign: "left",
              }}
            >
              体脂肪率(%)：{user.bodyFat}
            </div>
            <button
              onClick={() => router.push("/mypgedit")}
              style={{
                width: "100%",
                background: "#6b9e3d",
                color: "#fff",
                fontWeight: "bold",
                fontSize: 17,
                padding: "10px 0",
                border: "none",
                borderRadius: 8,
                marginTop: 16,
                cursor: "pointer",
              }}
            >
              現在の情報を編集
            </button>
          </div>
          {/* 理想の身体情報カード */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 12px #eee",
              width: 320,
              padding: "32px 36px 24px 36px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: 20,
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              [理想の身体情報]
            </div>
            <div
              style={{
                width: "100%",
                fontSize: 17,
                marginBottom: 8,
                textAlign: "left",
              }}
            >
              体重(kg)：{ideal.weight}
            </div>
            <div
              style={{
                width: "100%",
                fontSize: 17,
                marginBottom: 24,
                textAlign: "left",
              }}
            >
              体脂肪率(%)：{ideal.bodyFat}
            </div>
            <button
              onClick={() => router.push("/idealinfo")}
              style={{
                width: "100%",
                background: "#6b9e3d",
                color: "#fff",
                fontWeight: "bold",
                fontSize: 17,
                padding: "10px 0",
                border: "none",
                borderRadius: 8,
                marginTop: 16,
                cursor: "pointer",
              }}
            >
              理想の情報を編集
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
