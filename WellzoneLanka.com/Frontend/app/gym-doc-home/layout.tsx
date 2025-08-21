import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wellzone Lanka - AI-Powered Health and Fitness Tracker",
  description:
    "Connect with doctors, track your health, and get personalized fitness training",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="pt-16">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
