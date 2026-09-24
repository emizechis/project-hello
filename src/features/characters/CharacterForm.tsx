import { useState } from "react";
import { ATTRIBUTES, CLASSES, ORIGINS, type CharacterInput } from "./data";
import { NeonButton } from "@/features/core/ui/NeonButton";

const steps = ["Identidade", "Perfil", "Atributos"];

export function CharacterForm({
  initial,
  onSubmit,
  submitLabel = "Criar personagem",
}: {
  initial?: Partial<CharacterInput>;
  onSubmit: (data: CharacterInput) => Promise<void>;
  submitLabel?: string;
}) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<CharacterInput>({
    name: initial?.name || "",
    portrait_url: initial?.portrait_url || "",
    origin: initial?.origin || ORIGINS[0].name,
    class_name: initial?.class_name || CLASSES[0].name,
    nex: initial?.nex ?? 5,
    age: initial?.age,
    height: initial?.height,
    weight: initial?.weight,
    appearance: initial?.appearance || "",
    personality: initial?.personality || "",
    background: initial?.background || "",
    goals: initial?.goals || "",
    notes: initial?.notes || "",
    attributes: initial?.attributes || Object.fromEntries(ATTRIBUTES.map((a) => [a, 1])),
  });

  const set = (key: keyof CharacterInput, value: unknown) =>
    setData((current) => ({ ...current, [key]: value }));

  const canContinue =
    step === 0 ? data.name.trim().length >= 2 : true;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (step < steps.length - 1) {
      if (canContinue) setStep((current) => current + 1);
      return;
    }

    setSaving(true);
    try {
      await onSubmit(data);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-7">
      <div className="grid grid-cols-3 gap-2">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => index <= step && setStep(index)}
            className={`rounded-xl border px-3 py-3 text-left transition ${
              index === step
                ? "border-sky-400/40 bg-sky-400/10 text-sky-200"
                : index < step
                  ? "border-violet-400/20 bg-violet-400/5 text-violet-200"
                  : "border-white/10 bg-white/[0.02] text-slate-500"
            }`}
          >
            <span className="block text-[10px] uppercase tracking-[.2em]">0{index + 1}</span>
            <span className="mt-1 block text-sm font-semibold">{label}</span>
          </button>
        ))}
      </div>

      {step === 0 && (
        <section className="space-y-5">
          <div>
            <label className="text-xs uppercase tracking-[.2em] text-slate-500">Nome</label>
            <input required value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="Nome do personagem" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-sky-400/50" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[.2em] text-slate-500">Retrato</label>
            <input value={data.portrait_url || ""} onChange={(e) => set("portrait_url", e.target.value)} placeholder="URL da imagem (opcional)" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-sky-400/50" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-xs text-slate-400">Origem
              <select value={data.origin} onChange={(e) => set("origin", e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1120] px-4 py-3 text-white">
                {ORIGINS.map((item) => <option key={item.name}>{item.name}</option>)}
              </select>
            </label>
            <label className="text-xs text-slate-400">Classe
              <select value={data.class_name} onChange={(e) => set("class_name", e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1120] px-4 py-3 text-white">
                {CLASSES.map((item) => <option key={item.name}>{item.name}</option>)}
              </select>
            </label>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm font-semibold text-white">{data.origin}</p>
            <p className="mt-1 text-sm text-slate-500">{ORIGINS.find((item) => item.name === data.origin)?.summary}</p>
            <p className="mt-4 text-sm font-semibold text-white">{data.class_name}</p>
            <p className="mt-1 text-sm text-slate-500">{CLASSES.find((item) => item.name === data.class_name)?.summary}</p>
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            {(["age", "height", "weight"] as const).map((key) => (
              <label key={key} className="text-xs text-slate-400 capitalize">
                {key === "age" ? "Idade" : key === "height" ? "Altura" : "Peso"}
                <input type="number" min="0" value={data[key] ?? ""} onChange={(e) => set(key, e.target.value ? Number(e.target.value) : undefined)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white" />
              </label>
            ))}
          </div>
          {(["appearance", "personality", "background", "goals", "notes"] as const).map((key) => (
            <label key={key} className="block text-xs uppercase tracking-[.15em] text-slate-500">
              {key === "appearance" ? "Aparência" : key === "personality" ? "Personalidade" : key === "background" ? "História" : key === "goals" ? "Objetivos" : "Notas"}
              <textarea value={data[key] || ""} onChange={(e) => set(key, e.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-violet-400/50" />
            </label>
          ))}
        </section>
      )}

      {step === 2 && (
        <section className="space-y-5">
          <label className="block text-xs uppercase tracking-[.2em] text-slate-500">NEX
            <div className="mt-2 flex items-center gap-4">
              <input type="range" min="5" max="99" step="5" value={data.nex ?? 5} onChange={(e) => set("nex", Number(e.target.value))} className="w-full accent-sky-400" />
              <span className="w-14 text-right text-lg font-bold text-sky-300">{data.nex}%</span>
            </div>
          </label>
          <div className="grid gap-4 md:grid-cols-5">
            {ATTRIBUTES.map((attribute) => (
              <label key={attribute} className="text-xs font-semibold text-slate-400">
                {attribute}
                <input type="number" min="1" max="5" value={data.attributes?.[attribute] ?? 1} onChange={(e) => set("attributes", { ...data.attributes, [attribute]: Number(e.target.value) })} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-center text-white" />
              </label>
            ))}
          </div>
          <div className="rounded-xl border border-sky-400/10 bg-sky-400/5 p-4 text-sm text-slate-400">
            Revise os dados antes de criar a ficha. Você poderá continuar editando tudo depois.
          </div>
        </section>
      )}

      <div className="flex items-center justify-between border-t border-white/10 pt-5">
        <button type="button" disabled={step === 0 || saving} onClick={() => setStep((current) => current - 1)} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 disabled:opacity-30">Voltar</button>
        <NeonButton type="submit" disabled={saving || !canContinue}>{saving ? "Salvando..." : step === steps.length - 1 ? submitLabel : "Continuar"}</NeonButton>
      </div>
    </form>
  );
}
