import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & { variant?: "primary" | "ghost" };

export function NeonButton({ children, variant="primary", className="", ...props }: Props) {
  return <button {...props} className={`rounded-xl px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-200 ${variant==="primary" ? "bg-sky-400 text-slate-950 shadow-[0_0_28px_rgba(56,189,248,.3)] hover:shadow-[0_0_40px_rgba(56,189,248,.55)]" : "border border-slate-700 bg-white/5 text-slate-100 hover:border-violet-400/60 hover:bg-violet-400/10"} ${className}`}>{children}</button>;
}
