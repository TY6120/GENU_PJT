"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import NavigationBar from "@/components/NavigationBar";
import Logo from "@/components/Logo";
import { useRouter } from "next/router";

type Item = { id: string; name: string; unit: string; quantity: number };

export default function ShoppingListEdit() {
  const [items, setItems] = useState<Item[]>([]);
  const router = useRouter();

  // 一覧取得
  const fetchList = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from("shopping_list")
      .select("id, quantity, ingredient:ingredient_id(name, unit)")
      .eq("user_id", userId);
    if (error) return console.error(error);

    setItems(
      data!.map((r) => {
        let name = "";
        let unit = "";
        if (Array.isArray(r.ingredient)) {
          if (r.ingredient[0]) {
            name = r.ingredient[0].name ?? "";
            unit = r.ingredient[0].unit ?? "";
          }
        } else if (r.ingredient) {
          const ingr = r.ingredient as { name: string; unit: string };
          name = ingr.name ?? "";
          unit = ingr.unit ?? "";
        }
        return {
          id: r.id,
          name,
          unit,
          quantity: Number(r.quantity),
        };
      }),
    );
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("shopping_list").delete().eq("id", id);
    fetchList();
  };

  const handleQtyChange = async (id: string, newQty: number) => {
    await supabase
      .from("shopping_list")
      .update({ quantity: newQty })
      .eq("id", id);
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: newQty } : it)),
    );
  };

  return (
    <div
      style={{ position: "relative", minHeight: "100vh", background: "#fff" }}
    >
      <div style={{ position: "absolute", top: 40, left: 40 }}>
        <Logo />
      </div>
      <NavigationBar />

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
          買い物リスト編集ページ
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
                  <span style={{ fontSize: 16 }}>
                    {item.name}（{item.unit}）
                  </span>
                  <span style={{ fontSize: 15, color: "#333" }}>
                    数量：
                    <input
                      type="number"
                      value={item.quantity}
                      min={0}
                      onChange={(e) =>
                        handleQtyChange(item.id, Number(e.target.value))
                      }
                      style={{
                        width: 60,
                        marginLeft: 4,
                        marginRight: 4,
                        padding: 2,
                        borderRadius: 4,
                        border: "1px solid #ccc",
                      }}
                    />
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    background: "#B71C1C",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 18px",
                    fontWeight: "bold",
                    fontSize: 15,
                    cursor: "pointer",
                    boxShadow: "0 1px 4px #eee",
                  }}
                >
                  削除
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <button
        onClick={() => router.push("/1wlist")}
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
        保存
      </button>
    </div>
  );
}
