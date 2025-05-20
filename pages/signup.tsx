import { useState } from "react";
import { useRouter } from "next/router";
import Logo from "@/components/Logo";

export default function Signup() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!userId || !password) {
      setError("全ての項目を入力してください");
      return;
    }
    setSuccess("新規登録が完了しました！");
    setTimeout(() => router.push("/signin"), 1500);
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
      <div style={{ position: "absolute", top: 40, left: 40 }}>
        <Logo />
      </div>
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
          新規登録
        </h2>
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="userId"
            style={{ display: "block", marginBottom: 8, fontWeight: 400 }}
          >
            ユーザーID（メールアドレス）
          </label>
          <input
            id="userId"
            type="email"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
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
        {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
        {success && (
          <div style={{ color: "green", marginBottom: 16 }}>{success}</div>
        )}
        <button
          type="submit"
          style={{
            width: "100%",
            background: "#c3c95a",
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
          新規登録
        </button>
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <span style={{ fontSize: 14 }}>すでに登録済みの方はこちら</span>{" "}
          <button
            type="button"
            onClick={() => router.push("/signin")}
            style={{
              background: "#6b9e3d",
              color: "#fff",
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
            ログイン
          </button>
        </div>
      </form>
    </div>
  );
}
