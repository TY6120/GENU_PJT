"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

const WEEKDAYS_JP = [
  "月曜日",
  "火曜日",
  "水曜日",
  "木曜日",
  "金曜日",
  "土曜日",
  "日曜日",
];

type DayMenu = {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  kcal: number;
};

type MealPlanItem = {
  day_of_week: number;
  meal_type: "breakfast" | "lunch" | "dinner";
  recipe:
    | {
        name: string;
        calories: number;
      }[]
    | null;
};

async function updateShoppingList(planId: string, userId: string) {
  const { data: items, error: itemsErr } = await supabase
    .from("meal_plan_items")
    .select("recipe_id")
    .eq("plan_id", planId);
  if (itemsErr || !items) throw itemsErr;
  const recipeIds = items.map((i) => i.recipe_id);
  const { data: aggs, error: aggErr } = await supabase
    .from("recipe_ingredients")
    .select("ingredient_id, quantity")
    .in("recipe_id", recipeIds);
  if (aggErr || !aggs) throw aggErr;
  const map = new Map<string, number>();
  aggs.forEach(({ ingredient_id, quantity }) => {
    map.set(ingredient_id, (map.get(ingredient_id) ?? 0) + Number(quantity));
  });
  const upsertPayload = Array.from(map.entries()).map(
    ([ingredient_id, quantity]) => ({
      user_id: userId,
      ingredient_id,
      quantity,
      checked: false,
    }),
  );
  const { error: upsertErr } = await supabase
    .from("shopping_list")
    .upsert(upsertPayload, { onConflict: "user_id,ingredient_id" });
  if (upsertErr) throw upsertErr;
}

export default function OneWeekMenu() {
  const router = useRouter();
  const { user: authUser, loading } = useAuth();
  const [menus, setMenus] = useState<DayMenu[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [planId, setPlanId] = useState("");

  const fetchMenus = async (userId: string) => {
    const { data: plan, error: planErr } = await supabase
      .from("meal_plans")
      .select("id")
      .eq("user_id", userId)
      .order("week_start_date", { ascending: false })
      .limit(1)
      .single();
    if (planErr || !plan) {
      try {
        const currentDate = new Date();
        const day = currentDate.getDay();
        const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
        const weekStartDate = new Date(currentDate.setDate(diff));
        weekStartDate.setHours(0, 0, 0, 0);
        const { data: newPlans, error: createPlanErr } = await supabase
          .from("meal_plans")
          .insert([
            {
              user_id: userId,
              week_start_date: weekStartDate.toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select();
        if (createPlanErr || !newPlans || newPlans.length === 0) {
          setErrorMessage("初期プランの作成に失敗しました。");
          return;
        }
        const newPlan = newPlans[0];
        setPlanId(newPlan.id);
        const emptyMenus = WEEKDAYS_JP.map((day) => ({
          day,
          breakfast: "",
          lunch: "",
          dinner: "",
          kcal: 0,
        }));
        setMenus(emptyMenus);
        return;
      } catch (error) {
        console.error("初期プラン作成エラー:", error);
        setErrorMessage("初期プランの作成に失敗しました。");
        return;
      }
    }
    setPlanId(plan.id);
    const { data: items, error: itemsErr } = await supabase
      .from("meal_plan_items")
      .select(
        `
        day_of_week,
        meal_type,
        recipe:recipes ( name, calories )
      `,
      )
      .eq("plan_id", plan.id)
      .order("day_of_week", { ascending: true })
      .order("meal_type", { ascending: true });
    if (itemsErr || !items) {
      setErrorMessage("メニューアイテムの取得に失敗しました。");
      return;
    }
    const tmp: Record<number, DayMenu> = {};
    for (let dow = 0; dow < 7; dow++) {
      tmp[dow] = {
        day: WEEKDAYS_JP[dow],
        breakfast: "",
        lunch: "",
        dinner: "",
        kcal: 0,
      };
    }
    items.forEach((it: MealPlanItem) => {
      const dm = tmp[it.day_of_week];
      const rec = Array.isArray(it.recipe)
        ? (it.recipe[0] ?? { name: "", calories: 0 })
        : (it.recipe ?? { name: "", calories: 0 });
      if (it.meal_type === "breakfast") dm.breakfast = rec.name;
      if (it.meal_type === "lunch") dm.lunch = rec.name;
      if (it.meal_type === "dinner") dm.dinner = rec.name;
      dm.kcal += rec.calories;
    });
    setMenus([tmp[0], tmp[1], tmp[2], tmp[3], tmp[4], tmp[5], tmp[6]]);
  };

  useEffect(() => {
    if (!authUser) return;
    fetchMenus(authUser.id);
  }, [authUser]);

  const handleReset = async () => {
    if (!planId || !authUser?.id) return;
    if (!confirm("本当にメニューをリセットしますか？")) return;
    try {
      const { error: resetErr } = await supabase
        .from("shopping_list")
        .update({ checked: false })
        .eq("user_id", authUser.id);
      if (resetErr) throw resetErr;
      const { error: rpcErr } = await supabase.rpc("reset_and_randomize_week", {
        p_plan_id: planId,
      });
      if (rpcErr) throw rpcErr;
      await fetchMenus(authUser.id);
      await updateShoppingList(planId, authUser.id);
    } catch (e: unknown) {
      console.error(e);
      const message = e instanceof Error ? e.message : String(e);
      alert(message);
    }
  };

  if (loading || !authUser) {
    return <p style={{ textAlign: "center", marginTop: 100 }}>認証中…</p>;
  }
  if (errorMessage)
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: 100 }}>
        {errorMessage}
      </p>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 120,
          paddingBottom: 100,
        }}
      >
        <h2 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 32 }}>
          一週間分の食事
        </h2>
        {menus.every(
          (menu) => !menu.breakfast && !menu.lunch && !menu.dinner,
        ) && (
          <div
            style={{
              background: "#f0f8ff",
              border: "1px solid #4CAF50",
              borderRadius: 8,
              padding: 16,
              marginBottom: 24,
              textAlign: "center",
              maxWidth: 600,
            }}
          >
            <p style={{ margin: 0, color: "#2e7d32", fontSize: 16 }}>
              メニューがまだ生成されていません。「メニュー生成」ボタンを押して、一週間分のメニューを作成してください。
            </p>
          </div>
        )}
        <style>{`
          @media (max-width: 700px) {
            .menu-card-list {
              flex-direction: column !important;
              align-items: center !important;
            }
          }
        `}</style>
        <div
          className="menu-card-list"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 32,
            justifyContent: "center",
            width: "100%",
          }}
        >
          {menus.map((menu) => (
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
              <div>
                <b>朝食</b> {menu.breakfast}
              </div>
              <div>
                <b>昼食</b> {menu.lunch}
              </div>
              <div>
                <b>夕食</b> {menu.dinner}
              </div>
              <div style={{ marginTop: 8 }}>
                <b>総摂取カロリー</b> {menu.kcal}kcal
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handleReset}
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "12px 24px",
          borderRadius: 4,
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: 16,
          fontWeight: "bold",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        メニュー生成
      </button>
    </div>
  );
}
