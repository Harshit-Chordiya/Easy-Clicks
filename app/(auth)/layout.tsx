import Logo from "@/components/Logo";
import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Logo />
      {children}
    </div>
  );
}

export default Layout;
