"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import Logo from "@/components/Logo";

const dayMenus: Record<
  string,
  {
    day: string;
    meals: {
      type: string;
      menu: string;
      ingredients: string;
      recipe: string[];
      kcal: number;
    }[];
  }
> = {
  月曜日: {
    day: "月曜日",
    meals: [
      {
        type: "朝食",
        menu: "焼魚、焼き野菜、納豆、卵",
        ingredients: "魚の切り身、豆腐、ネギ、納豆、卵、焼きパック、卵焼き",
        recipe: [
          "焼き魚の材料（豆腐、ネギ）を適当な大きさに切る",
          "魚の切り身を中火で片面3分、もう片面を2分",
        ],
        kcal: 250,
      },
      {
        type: "昼食",
        menu: "焼魚、焼き野菜、納豆、卵",
        ingredients: "魚の切り身、豆腐、ネギ、納豆、卵、焼きパック、卵焼き",
        recipe: [
          "焼き魚の材料（豆腐、ネギ）を適当な大きさに切る",
          "魚の切り身を中火で片面3分、もう片面を2分",
        ],
        kcal: 250,
      },
      {
        type: "夕食",
        menu: "焼魚、焼き野菜、納豆、卵",
        ingredients: "魚の切り身、豆腐、ネギ、納豆、卵、焼きパック、卵焼き",
        recipe: [
          "焼き魚の材料（豆腐、ネギ）を適当な大きさに切る",
          "魚の切り身を中火で片面3分、もう片面を2分",
        ],
        kcal: 250,
      },
    ],
  },
  火曜日: {
    day: "火曜日",
    meals: [
      {
        type: "朝食",
        menu: "サラダチキン、トマト、卵",
        ingredients: "サラダチキン、トマト、卵",
        recipe: ["サラダチキンをカットする", "トマトと卵を添える"],
        kcal: 220,
      },
      {
        type: "昼食",
        menu: "ブロッコリー、焼き魚、味噌汁",
        ingredients: "ブロッコリー、魚、味噌、豆腐",
        recipe: ["ブロッコリーを茹でる", "魚を焼く", "味噌汁を作る"],
        kcal: 300,
      },
      {
        type: "夕食",
        menu: "鶏胸肉スープ、シーザーサラダ",
        ingredients: "鶏胸肉、レタス、シーザードレッシング",
        recipe: ["鶏胸肉を茹でてスープにする", "レタスにドレッシングをかける"],
        kcal: 280,
      },
    ],
  },
  水曜日: {
    day: "水曜日",
    meals: [
      {
        type: "朝食",
        menu: "オートミール、バナナ、ヨーグルト",
        ingredients: "オートミール、バナナ、プレーンヨーグルト、はちみつ",
        recipe: [
          "オートミールを牛乳で煮る",
          "バナナをスライスして添える",
          "ヨーグルトにはちみつをかける",
        ],
        kcal: 280,
      },
      {
        type: "昼食",
        menu: "鶏肉のグリル、キヌアサラダ",
        ingredients: "鶏もも肉、キヌア、ミックスベジタブル、オリーブオイル",
        recipe: [
          "鶏肉をグリルする",
          "キヌアを茹でる",
          "野菜と混ぜてドレッシングをかける",
        ],
        kcal: 320,
      },
      {
        type: "夕食",
        menu: "白身魚のポワレ、蒸し野菜",
        ingredients: "白身魚、ブロッコリー、カリフラワー、レモン",
        recipe: ["白身魚をポワレする", "野菜を蒸す", "レモンを添える"],
        kcal: 260,
      },
    ],
  },
  木曜日: {
    day: "木曜日",
    meals: [
      {
        type: "朝食",
        menu: "全粒粉パン、スクランブルエッグ、アボカド",
        ingredients: "全粒粉パン、卵、アボカド、塩コショウ",
        recipe: [
          "パンをトーストする",
          "スクランブルエッグを作る",
          "アボカドをスライスする",
        ],
        kcal: 310,
      },
      {
        type: "昼食",
        menu: "ツナサラダ、全粒粉クラッカー",
        ingredients: "ツナ缶、レタス、トマト、全粒粉クラッカー",
        recipe: ["ツナと野菜を混ぜる", "クラッカーを添える"],
        kcal: 290,
      },
      {
        type: "夕食",
        menu: "豆腐ハンバーグ、温野菜",
        ingredients: "豆腐、ひき肉、玉ねぎ、人参、ブロッコリー",
        recipe: ["豆腐ハンバーグを作る", "野菜を蒸す"],
        kcal: 340,
      },
    ],
  },
  金曜日: {
    day: "金曜日",
    meals: [
      {
        type: "朝食",
        menu: "和風朝食セット",
        ingredients: "ご飯、納豆、味噌汁、焼き魚",
        recipe: ["ご飯を炊く", "味噌汁を作る", "魚を焼く"],
        kcal: 350,
      },
      {
        type: "昼食",
        menu: "鶏肉の照り焼き、ご飯、味噌汁",
        ingredients: "鶏もも肉、ご飯、味噌、豆腐、わかめ",
        recipe: ["鶏肉を照り焼きにする", "ご飯を炊く", "味噌汁を作る"],
        kcal: 420,
      },
      {
        type: "夕食",
        menu: "サーモンのグリル、キヌアサラダ",
        ingredients: "サーモン、キヌア、アボカド、トマト",
        recipe: ["サーモンをグリルする", "キヌアを茹でる", "野菜と混ぜる"],
        kcal: 380,
      },
    ],
  },
  土曜日: {
    day: "土曜日",
    meals: [
      {
        type: "朝食",
        menu: "フルーツグラノーラ、ヨーグルト",
        ingredients: "グラノーラ、プレーンヨーグルト、バナナ、ベリー類",
        recipe: ["グラノーラとフルーツを盛り付ける", "ヨーグルトをかける"],
        kcal: 280,
      },
      {
        type: "昼食",
        menu: "チキンサラダサンドイッチ",
        ingredients: "全粒粉パン、鶏胸肉、レタス、トマト、アボカド",
        recipe: [
          "鶏肉をグリルする",
          "野菜をスライスする",
          "サンドイッチを作る",
        ],
        kcal: 320,
      },
      {
        type: "夕食",
        menu: "和風ステーキ定食",
        ingredients: "牛もも肉、ご飯、味噌汁、温野菜",
        recipe: ["牛肉を焼く", "ご飯を炊く", "味噌汁を作る", "野菜を蒸す"],
        kcal: 450,
      },
    ],
  },
  日曜日: {
    day: "日曜日",
    meals: [
      {
        type: "朝食",
        menu: "オムレツ、全粒粉トースト",
        ingredients: "卵、全粒粉パン、チーズ、ハム、野菜",
        recipe: ["オムレツを作る", "パンをトーストする"],
        kcal: 330,
      },
      {
        type: "昼食",
        menu: "海鮮丼",
        ingredients: "ご飯、刺身、アボカド、きゅうり、わさび",
        recipe: ["ご飯を炊く", "刺身と野菜を盛り付ける"],
        kcal: 380,
      },
      {
        type: "夕食",
        menu: "ローストチキン、温野菜",
        ingredients: "鶏もも肉、じゃがいも、人参、ブロッコリー",
        recipe: ["鶏肉をローストする", "野菜を蒸す"],
        kcal: 420,
      },
    ],
  },
};

export default function OneDayMenu() {
  const router = useRouter();
  const [menu, setMenu] = useState(dayMenus["月曜日"]);

  useEffect(() => {
    if (router.isReady) {
      const { day } = router.query;
      if (typeof day === "string" && dayMenus[day]) {
        setMenu(dayMenus[day]);
      }
    }
  }, [router.isReady, router.query]);

  if (!menu) return <div>データがありません</div>;

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
          {menu.day}
        </h2>
        <div
          style={{
            background: "#fff",
            padding: 40,
            borderRadius: 8,
            boxShadow: "0 2px 8px #eee",
            width: 700,
            marginBottom: 40,
          }}
        >
          {menu.meals.map((meal) => (
            <div key={meal.type} style={{ marginBottom: 32 }}>
              <div
                style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}
              >
                {meal.type}
              </div>
              <div style={{ marginBottom: 4 }}>
                <b>材料</b>　{meal.ingredients}
              </div>
              <div style={{ marginBottom: 4 }}>
                <b>作り方</b>
                <ol style={{ margin: 0, paddingLeft: 24 }}>
                  {meal.recipe.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
              <div style={{ marginBottom: 4 }}>
                <b>カロリー</b>　{meal.kcal}kcal
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
            marginBottom: 16,
            cursor: "pointer",
          }}
        >
          1週間分のメニューへ戻る
        </button>
      </div>
    </div>
  );
}
