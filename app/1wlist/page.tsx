"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

type ShoppingListRow = {
  id: string;
  quantity: number;
  checked: boolean;
  ingredient: { name: string; unit: string }[];
};

type Item = {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  checked: boolean;
};

export default function ShoppingList() {
  const { user: authUser, loading } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const router = useRouter();

  /** Supabase から買い物リストを取得して state にセット */
  const fetchList = useCallback(async () => {
    if (!authUser) return;

    // shopping_list と ingredients を JOIN
    const { data, error } = await supabase
      .from("shopping_list")
      // ingredient_id → ingredients テーブルを参照、alias を ingredient にしています
      .select("id, quantity, checked, ingredient:ingredient_id(name, unit)")
      .eq("user_id", authUser.id);

    if (error) {
      console.error("shopping_list fetch error:", error);
      return;
    }

    // 配列の先頭要素から name/unit を取り出す
    const mapped = (data ?? []).map((row: ShoppingListRow) => {
      const rec = Array.isArray(row.ingredient)
        ? (row.ingredient[0] ?? { name: "", unit: "" })
        : (row.ingredient ?? { name: "", unit: "" });
      return {
        id: row.id,
        name: rec.name ?? "",
        unit: rec.unit ?? "",
        quantity: Number(row.quantity),
        checked: row.checked,
      };
    });

    setItems(mapped);
  }, [authUser]);

  useEffect(() => {
    if (!authUser) return;
    fetchList();
  }, [authUser, fetchList]);

  const handleCheck = async (id: string, checked: boolean) => {
    // Supabaseにchecked状態を保存
    await supabase
      .from("shopping_list")
      .update({ checked: !checked })
      .eq("id", id);

    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, checked: !checked } : it)),
    );
  };

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
    <div
      style={{ position: "relative", minHeight: "100vh", background: "#fff" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 120,
          paddingBottom: 100,
        }}
      >
        <h2
          style={{
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 32,
            textAlign: "center",
            textShadow: "1px 1px 2px #ccc",
          }}
        >
          買い物リスト
        </h2>

        <div
          style={{
            background: "#fff",
            boxShadow: "0 2px 16px #eee",
            borderRadius: 12,
            padding: 32,
            minWidth: 400,
            maxWidth: 600,
            width: "100%",
          }}
        >
          {items.length === 0 ? (
            <p style={{ textAlign: "center" }}>リストが空です</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#fafafa",
                  borderRadius: 8,
                  boxShadow: "0 1px 4px #eee",
                  padding: "12px 20px",
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleCheck(item.id, item.checked)}
                    style={{ width: 20, height: 20 }}
                  />
                  <span style={{ fontSize: 16 }}>
                    {item.name}（{item.unit}）
                  </span>
                </div>
                <span style={{ fontSize: 15, color: "#333" }}>
                  数量：{item.quantity}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={() => router.push("/1wlistedit")}
        style={{
          position: "fixed",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "14px 60px",
          borderRadius: 6,
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: 18,
          fontWeight: "bold",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          letterSpacing: 2,
        }}
      >
        編集
      </button>
    </div>
  );
}
