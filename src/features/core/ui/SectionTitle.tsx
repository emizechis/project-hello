export function SectionTitle({eyebrow,title,description}:{eyebrow?:string;title:string;description?:string}) {
  return <div className="max-w-2xl">
    {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[.3em] text-sky-300">{eyebrow}</p>}
    <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h2>
    {description && <p className="mt-3 text-slate-400">{description}</p>}
    <div className="mt-5 h-px w-24 bg-gradient-to-r from-sky-400 to-violet-500" />
  </div>;
}
