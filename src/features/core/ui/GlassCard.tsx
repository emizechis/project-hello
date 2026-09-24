import type { PropsWithChildren } from "react";

export function GlassCard({ children, className="" }: PropsWithChildren<{className?:string}>) {
  return <div className={`rounded-2xl border border-white/10 bg-white/[0.035] shadow-2xl backdrop-blur-xl ${className}`}>{children}</div>;
}
