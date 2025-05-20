"use client";
import { useState, useEffect } from "react";
import NavigationBar from "@/components/NavigationBar";
import Logo from "@/components/Logo";
import { useRouter } from "next/router";

const mockItems = [
  { id: 1, name: "魚の切り身", unit: "切れ", quantity: 1 },
  { id: 2, name: "豆腐", unit: "丁", quantity: 1 },
  { id: 3, name: "ネギ", unit: "本", quantity: 1 },
  { id: 4, name: "納豆", unit: "パック", quantity: 1 },
  { id: 5, name: "卵", unit: "パック", quantity: 1 },
];

export default function ShoppingList() {
  const [checked, setChecked] = useState<number[]>([]);
  const [items, setItems] = useState(mockItems);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shoppingList");
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch {
          setItems(mockItems);
        }
      } else {
        setItems(mockItems);
      }
    }
  }, []);

  const handleCheck = (id: number) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* ロゴ */}
      <div style={{ position: "absolute", top: 40, left: 40 }}>
        <Logo />
      </div>
      {/* ナビゲーションバー */}
      <NavigationBar />
      {/* メイン */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 120,
        }}
      >
        <h2
          style={{
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 32,
            textAlign: "center",
            letterSpacing: 2,
          }}
        >
          買い物リスト
        </h2>
        <div
          style={{
            background: "#fff",
            padding: 40,
            borderRadius: 12,
            boxShadow: "0 2px 8px #eee",
            width: 600,
            marginBottom: 40,
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                background: "#fafafa",
                borderRadius: 8,
                boxShadow: "0 1px 4px #eee",
                marginBottom: 16,
                padding: "12px 20px",
              }}
            >
              <input
                type="checkbox"
                checked={checked.includes(item.id)}
                onChange={() => handleCheck(item.id)}
                style={{ marginRight: 16, width: 20, height: 20 }}
              />
              <span style={{ flex: 1, fontSize: 18 }}>
                {item.name}（{item.unit}）
              </span>
              <span style={{ fontSize: 16, color: "#555", marginLeft: 16 }}>
                数量：{item.quantity}
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={() => router.push("/1wlistedit")}
          style={{
            width: 300,
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
          編集
        </button>
      </div>
    </div>
  );
}
