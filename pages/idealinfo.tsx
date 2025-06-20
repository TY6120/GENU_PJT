"use client";
import { useState, useEffect } from "react";
import NavigationBar from "@/components/NavigationBar";
import Logo from "@/components/Logo";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";

export default function IdealInfo() {
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchIdeal = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from("idealphysical_infos")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        setWeight(data.weight?.toString() ?? "");
        setBodyFat(data.bodyfat?.toString() ?? "");
      }
    };
    fetchIdeal();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Supabase Authから直接ユーザー情報を取得
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      setError("ユーザーIDの取得に失敗しました");
      return;
    }
    const userId = userData.user.id;

    if (!weight || !bodyFat) {
      setError("全ての項目を入力してください");
      return;
    }

    let result;
    // 既存レコードがあるか確認
    const { data: exist } = await supabase
      .from("idealphysical_infos")
      .select("id")
      .eq("user_id", userId)
      .single();
    if (exist) {
      // update
      result = await supabase
        .from("idealphysical_infos")
        .update({
          weight: Number(weight),
          bodyfat: Number(bodyFat),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
    } else {
      // insert
      result = await supabase.from("idealphysical_infos").insert([
        {
          user_id: userId,
          weight: Number(weight),
          bodyfat: Number(bodyFat),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    }
    if (result.error) {
      setError("保存に失敗しました: " + result.error.message);
      return;
    }
    setSuccess("登録が完了しました！");
    setTimeout(() => router.push("/mypage"), 1000);
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
      <NavigationBar />
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
            textAlign: "center",
          }}
        >
          理想の体型
        </h2>
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="weight" style={{ display: "block", marginBottom: 8 }}>
            体重(kg)
          </label>
          <input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              fontSize: 16,
              border: "1px solid #aaa",
              borderRadius: 4,
            }}
          />
        </div>
        <div style={{ marginBottom: 32 }}>
          <label
            htmlFor="bodyFat"
            style={{ display: "block", marginBottom: 8 }}
          >
            体脂肪率(%)
          </label>
          <input
            id="bodyFat"
            type="number"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              fontSize: 16,
              border: "1px solid #aaa",
              borderRadius: 4,
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
            background: "#6b9e3d",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 20,
            padding: "10px 0",
            border: "none",
            borderRadius: 8,
            marginBottom: 16,
            cursor: "pointer",
          }}
        >
          登録する
        </button>
      </form>
    </div>
  );
}
