import { useEffect, useState } from "react";
import { getSession } from "@/lib/session";
import { supabaseFetch } from "@/lib/supabase";

type DocumentItem = {
  id: string;
  title: string;
  type: "Nota" | "Handout" | "NPC";
  content: string;
};

type Props = {
  campaignId: string;
};

export function DocumentsPanel({ campaignId }: Props) {
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<DocumentItem["type"]>("Nota");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const token = getSession()?.access_token;

  useEffect(() => {
    supabaseFetch(
      "campaign_documents?campaign_id=eq." + encodeURIComponent(campaignId) + "&select=id,title,type,content&order=created_at.desc",
      {},
      token
    )
      .then((data) => setItems(data as DocumentItem[]))
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar documentos."));
  }, [campaignId]);

  async function addItem() {
    if (!title.trim() || saving) return;

    const userId = getSession()?.user?.id;
    if (!userId) {
      setError("Sessão inválida.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const created = await supabaseFetch(
        "campaign_documents",
        {
          method: "POST",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({
            campaign_id: campaignId,
            created_by: userId,
            title: title.trim(),
            type,
            content: content.trim(),
          }),
        },
        token
      );

      setItems((current) => [...(created as DocumentItem[]), ...current]);
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar documento.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}

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
        disabled={saving}
        className="rounded-xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Salvando..." : "Adicionar"}
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
