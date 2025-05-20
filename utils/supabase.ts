import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// テーブル一覧を取得する関数
export async function getTables() {
  const { data, error } = await supabase
    .from("information_schema.tables")
    .select("table_name")
    .eq("table_schema", "public");

  if (error) {
    console.error("テーブル一覧の取得に失敗しました:", error);
    return [];
  }

  return data;
}

// テーブルのデータを取得する関数
export async function getTableData(tableName: string) {
  const { data, error } = await supabase.from(tableName).select("*");

  if (error) {
    console.error(`${tableName}のデータ取得に失敗しました:`, error);
    return [];
  }

  return data;
}
