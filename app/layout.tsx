import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { ToastProvider } from "@/components/toast";

export const metadata: Metadata = { title: "NeuroFlow AI", description: "AI-powered productivity workspace" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><ToastProvider><AppShell>{children}</AppShell></ToastProvider></body></html>;
}
