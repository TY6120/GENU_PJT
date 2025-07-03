import Image from "next/image";

export default function Logo() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Image src="/genu_logo.png" alt="GENUロゴ" width={60} height={60} />
    </div>
  );
}
