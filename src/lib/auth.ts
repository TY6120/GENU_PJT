import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase"; // Supabase clientをインポート

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("メールアドレスとパスワードを入力してください");
        }

        // Supabaseでユーザーを検索
        const { data: user, error } = await supabase
          .from("users") // 'users' テーブルを仮定
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (error || !user) {
          throw new Error("ユーザーが見つかりません");
        }

        // パスワードを比較
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword, // 'hashedPassword' カラムを仮定
        );

        if (!isCorrectPassword) {
          throw new Error("パスワードが正しくありません");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/signin",
  },
};
