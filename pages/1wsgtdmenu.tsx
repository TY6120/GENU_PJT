"use client";
import React from "react";
import { useRouter } from "next/router";
import NavigationBar from "@/components/NavigationBar";
import Logo from "@/components/Logo";

const weekMenus = [
  {
    day: "月曜日",
    breakfast: "焼魚、焼き野菜、味噌汁、卵",
    lunch: "サラダチキン、ブロッコリー、おにぎり",
    dinner: "鶏胸肉スープ、シーザーサラダ",
    kcal: 999,
    note: "卵野菜スープ、ごはん少なめ、おにぎり",
  },
  {
    day: "火曜日",
    breakfast: "焼魚、焼き野菜、味噌汁、卵",
    lunch: "サラダチキン、ブロッコリー、おにぎり",
    dinner: "鶏胸肉スープ、シーザーサラダ",
    kcal: 999,
  },
  {
    day: "水曜日",
    breakfast: "焼魚、焼き野菜、味噌汁、卵",
    lunch: "サラダチキン、ブロッコリー、おにぎり",
    dinner: "鶏胸肉スープ、シーザーサラダ",
    kcal: 999,
  },
  {
    day: "木曜日",
    breakfast: "焼魚、焼き野菜、味噌汁、卵",
    lunch: "サラダチキン、ブロッコリー、おにぎり",
    dinner: "鶏胸肉スープ、シーザーサラダ",
    kcal: 999,
  },
  {
    day: "金曜日",
    breakfast: "焼魚、焼き野菜、味噌汁、卵",
    lunch: "サラダチキン、ブロッコリー、おにぎり",
    dinner: "鶏胸肉スープ、シーザーサラダ",
    kcal: 999,
  },
  {
    day: "土曜日",
    breakfast: "焼魚、焼き野菜、味噌汁、卵",
    lunch: "サラダチキン、ブロッコリー、おにぎり",
    dinner: "鶏胸肉スープ、シーザーサラダ",
    kcal: 999,
  },
  {
    day: "日曜日",
    breakfast: "焼魚、焼き野菜、味噌汁、卵",
    lunch: "サラダチキン、ブロッコリー、おにぎり",
    dinner: "鶏胸肉スープ、シーザーサラダ",
    kcal: 999,
  },
];

export default function OneWeekMenu() {
  const router = useRouter();
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
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          一週間分の食事
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 32,
            justifyContent: "center",
            width: "100%",
          }}
        >
          {weekMenus.map((menu) => (
            <div
              key={menu.day}
              style={{
                background: "#fff",
                minWidth: 240,
                maxWidth: 260,
                minHeight: 260,
                boxShadow: "0 2px 8px #ddd",
                borderRadius: 8,
                padding: 24,
                marginBottom: 24,
                cursor: "pointer",
                transition: "box-shadow 0.2s",
              }}
              onClick={() =>
                router.push(`/1dsgtdmenu?day=${encodeURIComponent(menu.day)}`)
              }
            >
              <div
                style={{ fontWeight: "bold", fontSize: 20, marginBottom: 12 }}
              >
                {menu.day}
              </div>
              <div style={{ marginBottom: 8 }}>
                <b>朝食</b>　{menu.breakfast}
              </div>
              <div style={{ marginBottom: 8 }}>
                <b>昼食</b>　{menu.lunch}
              </div>
              <div style={{ marginBottom: 8 }}>
                <b>夕食</b>　{menu.dinner}
              </div>
              {menu.note && <div style={{ marginBottom: 8 }}>{menu.note}</div>}
              <div style={{ marginTop: 8 }}>
                <b>総摂取カロリー</b>　{menu.kcal}kcal
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
