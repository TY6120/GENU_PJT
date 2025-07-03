"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export default function MyPageEdit() {
  const { user: authUser, loading } = useAuth();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!authUser) return;
    (async () => {
      try {
        const userId = authUser.id;

        const { data: physData, error: physError } = await supabase
          .from("currentphysical_infos")
          .select("age, gender, height, weight, bodyfat")
          .eq("user_id", userId)
          .maybeSingle();

        if (physError) {
          setError("既存データの取得中にエラーが発生しました");
          return;
        }

        if (physData) {
          setAge(String(physData.age));
          setGender(physData.gender);
          setHeight(String(physData.height));
          setWeight(String(physData.weight));
          setBodyFat(String(physData.bodyfat));
        }
      } catch (error) {
        console.error("認証エラー:", error);
        router.push("/signin");
      }
    })();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!age || !gender || !height || !weight || !bodyFat) {
      setError("全ての項目を入力してください");
      return;
    }
    const userId = authUser.id;
    const { data: existData, error: existError } = await supabase
      .from("currentphysical_infos")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    if (existError) {
      setError("既存データの確認中にエラーが発生しました");
      return;
    }
    let result;
    if (existData) {
      result = await supabase
        .from("currentphysical_infos")
        .update({
          age: Number(age),
          gender,
          height: Number(height),
          weight: Number(weight),
          bodyfat: Number(bodyFat),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
    } else {
      result = await supabase.from("currentphysical_infos").insert([
        {
          user_id: userId,
          age: Number(age),
          gender,
          height: Number(height),
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
    setSuccess("編集が完了しました！");
    setTimeout(() => router.push("/mypage"), 1000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
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
          <h2 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 32 }}>
            マイページ
          </h2>
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="age" style={{ display: "block", marginBottom: 8 }}>
              年齢
            </label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                fontSize: 16,
                border: "1px solid #aaa",
                borderRadius: 4,
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="gender"
              style={{ display: "block", marginBottom: 8 }}
            >
              性別
            </label>
            <input
              id="gender"
              type="text"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                fontSize: 16,
                border: "1px solid #aaa",
                borderRadius: 4,
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="height"
              style={{ display: "block", marginBottom: 8 }}
            >
              身長
            </label>
            <input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                fontSize: 16,
                border: "1px solid #aaa",
                borderRadius: 4,
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="weight"
              style={{ display: "block", marginBottom: 8 }}
            >
              体重
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
              体脂肪率
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
          {error && (
            <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
          )}
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
            保存する
          </button>
        </form>
      </div>
    </div>
  );
}
