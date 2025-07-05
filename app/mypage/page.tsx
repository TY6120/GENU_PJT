"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export default function MyPage() {
  const { user: authUser, loading } = useAuth();
  // state の初期値は「何も登録されていない → 0 や空文字」で OK
  const [user, setUser] = useState({
    age: 0,
    gender: "",
    height: 0,
    weight: 0,
    bodyFat: 0,
  });
  const [ideal, setIdeal] = useState({
    weight: 0,
    bodyFat: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser) return;
      try {
        // ───────────────────────────────────────────────────
        // ① public.users テーブルから id(uuid) を取得
        //    signup.tsx / signin.tsx の段階で必ず users テーブルにレコードを入れている想定
        const { data: userRow, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("email", authUser.email)
          .single();

        if (userError || !userRow) {
          console.error(
            "🚫 users テーブルからのユーザーID取得エラー",
            userError,
          );
          return;
        }
        const userId = userRow.id;

        try {
          // ───────────────────────────────────────────────────
          // ② currentphysical_infos テーブルから「現在の身体情報」を取得
          const { data: bodyData, error: bodyError } = await supabase
            .from("currentphysical_infos")
            .select("*")
            .eq("user_id", userId)
            .single();

          if (!bodyError && bodyData) {
            setUser({
              age: bodyData.age,
              gender: bodyData.gender,
              // PostgreSQL の numeric は JS では string で返ってくる場合があるので Number() する
              height: Number(bodyData.height),
              weight: Number(bodyData.weight),
              bodyFat: Number(bodyData.bodyfat),
            });
          } else {
            console.warn(
              "⚠️ currentphysical_infos に該当レコードなし or 取得エラー",
              bodyError,
            );
          }

          // ───────────────────────────────────────────────────
          // ③ idealphysical_infos テーブルから「理想の身体情報」を取得
          const { data: idealData, error: idealError } = await supabase
            .from("idealphysical_infos")
            .select("*")
            .eq("user_id", userId)
            .single();

          if (!idealError && idealData) {
            setIdeal({
              weight: Number(idealData.weight),
              bodyFat: Number(idealData.bodyfat),
            });
          } else {
            console.warn(
              "⚠️ idealphysical_infos に該当レコードなし or 取得エラー",
              idealError,
            );
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } catch (error) {
        console.error("認証エラー:", error);
        router.push("/signin");
      }
    };

    fetchUserData();
  }, [authUser, router]);

  // ローディング中または未認証の場合はローディング画面を表示
  if (loading || !authUser) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <p>認証中...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
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

        {/* 情報カード２カラム */}
        <style>{`
          @media (max-width: 600px) {
            .mypage-card-row {
              flex-direction: column !important;
              align-items: center !important;
              gap: 32px !important;
            }
          }
        `}</style>
        <div
          className="mypage-card-row"
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
