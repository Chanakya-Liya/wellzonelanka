"use client";

import { ReactNode } from "react";

export default function DoctorsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="doctors-layout">
      {children}
    </div>
  );
}
