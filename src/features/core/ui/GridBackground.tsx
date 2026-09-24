export function GridBackground() {
  return <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#070b14]">
    <div className="absolute inset-0 opacity-[.16]" style={{backgroundImage:"linear-gradient(rgba(56,189,248,.18) 1px, transparent 1px),linear-gradient(90deg, rgba(139,92,246,.14) 1px, transparent 1px)",backgroundSize:"48px 48px"}} />
    <div className="absolute left-1/2 top-[-20%] h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-sky-500/10 blur-[140px]" />
    <div className="absolute bottom-[-20%] right-[-10%] h-[35rem] w-[35rem] rounded-full bg-violet-600/10 blur-[130px]" />
  </div>;
}
