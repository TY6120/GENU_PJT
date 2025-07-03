"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

type Meal = {
  type: "朝食" | "昼食" | "夕食";
  name: string;
  ingredients: string; // 例: 玉ねぎ 1個、にんじん 2本
  steps: string[]; // 作り方のステップ
  calories: number;
};

export default function OneDayMenu() {
  return (
    <Suspense>
      <OneDayMenuInner />
    </Suspense>
  );
}

function OneDayMenuInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: authUser, loading } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([
    { type: "朝食", name: "", ingredients: "", steps: [], calories: 0 },
    { type: "昼食", name: "", ingredients: "", steps: [], calories: 0 },
    { type: "夕食", name: "", ingredients: "", steps: [], calories: 0 },
  ]);
  const [day, setDay] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");

  const dayIndex = useMemo<Record<string, number>>(
    () => ({
      月曜日: 0,
      火曜日: 1,
      水曜日: 2,
      木曜日: 3,
      金曜日: 4,
      土曜日: 5,
      日曜日: 6,
    }),
    [],
  );

  useEffect(() => {
    if (!authUser) return;
    async function fetchData() {
      try {
        const dayParam = searchParams?.get("day");
        if (!dayParam) return;
        setDay(dayParam);

        // --- STEP1: 最新プランID を取得 ---
        const { data: plan, error: planErr } = await supabase
          .from("meal_plans")
          .select("id")
          .order("week_start_date", { ascending: false })
          .limit(1)
          .single();
        if (planErr || !plan) {
          console.error("プラン取得エラー", planErr);
          setErrorMessage("プランが見つかりませんでした。");
          return;
        }
        const planId = plan.id;

        // --- STEP2: meal_plan_items と recipe の基本情報を取得 ---
        const { data: items, error: itemsErr } = await supabase
          .from("meal_plan_items")
          .select(
            `
            meal_type,
            recipe_id,
            recipe:recipe_id (
              name,
              instructions,
              calories
            )
          `,
          )
          .eq("plan_id", planId)
          .eq("day_of_week", dayIndex[dayParam])
          .order("meal_type", { ascending: true });
        if (itemsErr) {
          console.error("項目取得エラー", itemsErr);
          setErrorMessage("メニューがまだ作成されていません。");
          setMeals([]);
          return;
        }
        if (!items || items.length === 0) {
          setErrorMessage("メニューがまだ作成されていません。");
          setMeals([]);
          return;
        }

        // --- STEP3: recipe_ingredients を一括取得 ---
        const recipeIds = items.map((it) => it.recipe_id);
        const { data: ris, error: risErr } = await supabase
          .from("recipe_ingredients")
          .select(
            `
            recipe_id,
            quantity,
            ingredient:ingredient_id (
              name, unit
            )
          `,
          )
          .in("recipe_id", recipeIds);
        if (risErr || !ris) {
          console.error("材料取得エラー", risErr);
          return;
        }

        // --- STEP4: recipe_id ごとにグループ化 ---
        const riMap: Record<string, typeof ris> = {};
        ris.forEach((r) => {
          if (!riMap[r.recipe_id]) riMap[r.recipe_id] = [];
          riMap[r.recipe_id].push(r);
        });

        // --- STEP5: 画面用データ作成 ---
        const types: ("breakfast" | "lunch" | "dinner")[] = [
          "breakfast",
          "lunch",
          "dinner",
        ];
        const jpTypes: Meal["type"][] = ["朝食", "昼食", "夕食"];

        const newMeals = types.map((type, i) => {
          const it = items.find((r) => r.meal_type === type)!;
          const rec = it.recipe!;

          // 材料文字列: 「名前 数量単位」
          const ingrList = (riMap[it.recipe_id] || []).map((ri) => {
            const ingr = Array.isArray(ri.ingredient)
              ? ri.ingredient[0]
              : ri.ingredient;
            const { name, unit } = ingr || {};
            return `${name ?? ""} ${ri.quantity ?? ""}${unit ?? ""}`;
          });

          // 作り方ステップ: 改行→空行除去
          const recObj = Array.isArray(rec) ? rec[0] : rec;
          const steps = (recObj.instructions ?? "")
            .split("\n")
            .map((l: string) => l.trim())
            .filter((l: string) => l.length > 0);

          return {
            type: jpTypes[i],
            name: recObj.name,
            ingredients: ingrList.join("、"),
            steps,
            calories: recObj.calories,
          };
        });

        setMeals(newMeals);
        setErrorMessage("");
      } catch (error: unknown) {
        // 認証エラーの場合のみログイン画面へ
        if (
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof (error as { message?: unknown }).message === "string" &&
          (error as { message: string }).message.includes("認証")
        ) {
          router.push("/signin");
        } else if (
          typeof error === "object" &&
          error !== null &&
          "status" in error &&
          (error as { status?: unknown }).status === 401
        ) {
          router.push("/signin");
        } else {
          setErrorMessage("データ取得中にエラーが発生しました。");
        }
      }
    }

    fetchData();
  }, [authUser, searchParams, dayIndex, router]);

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

  // エラーメッセージがある場合は表示
  if (errorMessage) {
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
          <p style={{ color: "red", fontSize: 20 }}>{errorMessage}</p>
          <button
            onClick={() => router.push("/1wsgtdmenu")}
            style={{
              marginTop: 24,
              background: "#6b9e3d",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 18,
              padding: "10px 24px",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            1週間分のメニューへ戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 120,
        }}
      >
        <style>{`
          @media (max-width: 600px) {
            .oneday-menu-detail-card {
              width: 100% !important;
              padding: 16px !important;
              box-sizing: border-box !important;
            }
            .oneday-menu-title {
              font-size: 24px !important;
            }
          }
        `}</style>
        <h2
          className="oneday-menu-title"
          style={{
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 32,
            textAlign: "center",
            letterSpacing: 2,
          }}
        >
          {day || "○曜日"}
        </h2>

        <div
          className="oneday-menu-detail-card"
          style={{
            background: "#fff",
            padding: 40,
            borderRadius: 12,
            boxShadow: "0 2px 8px #eee",
            width: 900,
            marginBottom: 40,
          }}
        >
          {meals.map((meal) => (
            <div key={meal.type} style={{ marginBottom: 48 }}>
              {/* タイトル行 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: 18, minWidth: 60 }}>
                  {meal.type}
                </div>
                <div style={{ fontSize: 18, marginLeft: 24 }}>{meal.name}</div>
              </div>

              {/* 材料 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: 16,
                  fontSize: 16,
                }}
              >
                <div style={{ fontWeight: "bold", minWidth: 60 }}>材料</div>
                <div style={{ marginLeft: 24 }}>{meal.ingredients}</div>
              </div>

              {/* 作り方 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: 16,
                  fontSize: 16,
                }}
              >
                <div style={{ fontWeight: "bold", minWidth: 60 }}>作り方</div>
                <div style={{ marginLeft: 24 }}>
                  {meal.steps.map((step, index) => (
                    <div key={index}>{step}</div>
                  ))}
                </div>
              </div>

              {/* カロリー */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                  fontSize: 16,
                }}
              >
                <div style={{ fontWeight: "bold", minWidth: 60 }}>カロリー</div>
                <div style={{ marginLeft: 24 }}>{meal.calories}kcal</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/1wsgtdmenu")}
          style={{
            width: 400,
            background: "#6b9e3d",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 20,
            padding: "10px 0",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          1週間分のメニューへ戻る
        </button>
      </div>
    </div>
  );
}
