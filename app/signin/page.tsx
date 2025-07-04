"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        // 認証エラーが発生した場合はメッセージをセット
        setErrorMessage(error.message);
        return;
      }

      if (data.session) {
        // サインインに成功したら、例えばダッシュボードへリダイレクト
        router.push("/mypage");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("メールアドレスまたはパスワードが正しくありません");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#fff",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 400,
          margin: "0 auto",
          background: "white",
          padding: 40,
          borderRadius: 8,
          boxShadow: "0 2px 8px #eee",
        }}
      >
        <h2
          style={{
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 32,
            textAlign: "left",
          }}
        >
          ログイン
        </h2>
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: 8, fontWeight: 400 }}
          >
            ユーザーID（メールアドレス）
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: 16,
              border: "1px solid #888",
              borderRadius: 6,
              background: "#fff",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: 32 }}>
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: 8, fontWeight: 400 }}
          >
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: 16,
              border: "1px solid #888",
              borderRadius: 6,
              background: "#fff",
              boxSizing: "border-box",
            }}
          />
        </div>
        {errorMessage && (
          <div style={{ color: "red", marginBottom: 16 }}>{errorMessage}</div>
        )}
        <button
          type="submit"
          style={{
            width: "100%",
            background: "#6b9e3d",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 18,
            padding: "12px 0",
            border: "none",
            borderRadius: 8,
            marginBottom: 24,
            cursor: "pointer",
            letterSpacing: 1,
          }}
        >
          ログインする
        </button>
        <div style={{ textAlign: "left", marginTop: 8 }}>
          <span style={{ fontSize: 14 }}>新規登録はこちら</span>{" "}
          <button
            type="button"
            onClick={() => router.push("/signup")}
            style={{
              background: "#e6e6a8",
              color: "#6b9e3d",
              border: "none",
              borderRadius: 8,
              padding: "4px 16px",
              fontSize: 14,
              fontWeight: "bold",
              cursor: "pointer",
              marginLeft: 8,
              verticalAlign: "middle",
            }}
          >
            新規登録
          </button>
        </div>
      </form>
    </div>
  );
}
