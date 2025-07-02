"use client";
import { usePathname } from "next/navigation";
import NavigationBar from "@/components/NavigationBar";
import React from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname === "/signin" || pathname === "/signup";
  return (
    <>
      {!hideNav && <NavigationBar />}
      {children}
    </>
  );
} 