import Link from "next/link";
import { GridBackground } from "@/features/core/ui/GridBackground";
import { Navbar } from "@/features/core/ui/Navbar";
import { GlassCard } from "@/features/core/ui/GlassCard";
import { NeonButton } from "@/features/core/ui/NeonButton";

export default function CampaignsPage(){return <main className="min-h-screen text-slate-100"><GridBackground/><Navbar/><section className="mx-auto max-w-7xl px-6 py-12"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs uppercase tracking-[.3em] text-violet-300">NEXUS / CAMPAIGNS</p><h1 className="mt-3 text-4xl font-bold">Campaign network</h1><p className="mt-2 text-slate-400">Find your table or create a new one.</p></div><Link href="/campaigns/new"><NeonButton>+ New campaign</NeonButton></Link></div><div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3"><GlassCard className="min-h-52 p-6"><p className="text-xs text-emerald-400">OPEN FOR PLAYERS</p><h2 className="mt-8 text-xl font-semibold">Find a campaign</h2><p className="mt-2 text-sm text-slate-500">Public campaigns will be listed here.</p></GlassCard></div></section></main>}