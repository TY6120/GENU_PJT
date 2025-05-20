import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // 環境変数の存在確認
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SUPABASE_URL is not defined" },
        { status: 500 },
      );
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined" },
        { status: 500 },
      );
    }

    // Supabaseへの接続テスト
    const { data, error } = await supabase
      .from("_prisma_migrations")
      .select("*")
      .limit(1);

    if (error) {
      return NextResponse.json(
        { error: "Supabase connection error", details: error },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Supabase connection successful",
      env: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 },
    );
  }
}
