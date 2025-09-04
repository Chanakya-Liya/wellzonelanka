import type React from "react";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "Wellzone Lanka - AI-Powered Health and Fitness Tracker",
  description:
    "Connect with doctors, track your health, and get personalized fitness training",
};

export default function GymDocHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <main className="pt-16">{children}</main>
    </ThemeProvider>
  );
}
