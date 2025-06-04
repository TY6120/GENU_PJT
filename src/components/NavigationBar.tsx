import { useRouter } from "next/router";

export default function NavigationBar() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
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
  };

  const navStyle = {
    position: "absolute" as const,
    top: 10,
    right: 40,
    display: "flex",
    gap: 12,
  };

  return (
    <div style={navStyle}>
      <button style={buttonStyle} onClick={() => handleNavigation("/mypage")}>
        マイページ
      </button>
      <button
        style={buttonStyle}
        onClick={() => handleNavigation("/idealinfo")}
      >
        理想の体型
      </button>
      <button
        style={buttonStyle}
        onClick={() => handleNavigation("/1wsgtdmenu")}
      >
        食事メニュー
      </button>
      <button style={buttonStyle} onClick={() => handleNavigation("/1wlist")}>
        買い物リスト
      </button>
      <button style={buttonStyle} onClick={() => handleNavigation("/signin")}>
        ログアウト
      </button>
    </div>
  );
}
