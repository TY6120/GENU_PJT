import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";

export default function NavigationBar() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('ログアウトエラー:', error);
        alert('ログアウトに失敗しました');
        return;
      }
      // ログアウト成功後、サインインページへ遷移
      router.push('/signin');
    } catch (error) {
      console.error('ログアウトエラー:', error);
      alert('ログアウトに失敗しました');
    }
  };

  const buttonStyle = {
    background: "#6b9e3d",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "8px 18px",
    fontWeight: "bold",
    fontSize: 15,
    cursor: "pointer",
    margin: 0,
    flex: "1 1 150px",
    minWidth: 150,
  } as React.CSSProperties;

  // デフォルトは横並び
  const navWrapperStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "10px 40px 0 120px",
    zIndex: 10,
    width: "100%",
    boxSizing: "border-box",
    gap: 12,
    flexWrap: "wrap",
  };

  const groupStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    gap: 12,
  };

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .nav-bar-genu-wrapper {
            flex-direction: column !important;
            align-items: center !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            gap: 6px !important;
          }
          .nav-bar-genu-group {
            justify-content: center !important;
            width: 100% !important;
          }
        }
      `}</style>
      <div className="nav-bar-genu-wrapper" style={navWrapperStyle}>
        <div className="nav-bar-genu-group" style={groupStyle}>
          <button style={buttonStyle} onClick={() => handleNavigation("/mypage")}>マイページ</button>
          <button style={buttonStyle} onClick={() => handleNavigation("/1wsgtdmenu")}>食事メニュー</button>
        </div>
        <div className="nav-bar-genu-group" style={groupStyle}>
          <button style={buttonStyle} onClick={() => handleNavigation("/1wlist")}>買い物リスト</button>
          <button style={buttonStyle} onClick={handleLogout}>ログアウト</button>
        </div>
      </div>
    </>
  );
}
