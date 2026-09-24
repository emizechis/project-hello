import { useState } from "react";

type DocumentItem = {
  id: string;
  title: string;
  type: "Nota" | "Handout" | "NPC";
  content: string;
};

export function DocumentsPanel() {
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<DocumentItem["type"]>("Nota");
  const [content, setContent] = useState("");

  function addItem() {
    if (!title.trim()) return;
    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        type,
        content: content.trim(),
      },
    ]);
    setTitle("");
    setContent("");
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_150px]">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Título"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-sky-400/50"
        />
        <select
          value={type}
          onChange={(event) => setType(event.target.value as DocumentItem["type"])}
          className="rounded-xl border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white outline-none"
        >
          <option>Nota</option>
          <option>Handout</option>
          <option>NPC</option>
        </select>
      </div>

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Conteúdo..."
        rows={4}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-violet-400/50"
      />

      <button
        type="button"
        onClick={addItem}
        className="rounded-xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-300"
      >
        Adicionar
      </button>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-semibold text-white">{item.title}</h4>
              <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-1 text-xs text-violet-200">
                {item.type}
              </span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-400">
              {item.content || "Sem conteúdo."}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
