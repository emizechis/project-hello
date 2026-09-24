import { useEffect, useState } from "react";
import { getSession } from "@/lib/session";
import { supabaseFetch } from "@/lib/supabase";

type DocumentItem = {
  id: string;
  title: string;
  type: "Nota" | "Handout" | "NPC";
  content: string;
};

type Props = { campaignId: string };

export function DocumentsPanel({ campaignId }: Props) {
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<DocumentItem["type"]>("Nota");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const token = getSession()?.access_token;

  useEffect(() => {
    supabaseFetch(
      "campaign_documents?campaign_id=eq." +
        encodeURIComponent(campaignId) +
        "&select=id,title,type,content&order=created_at.desc",
      {},
      token
    )
      .then((data) => setItems(data as DocumentItem[]))
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar documentos."));
  }, [campaignId]);

  function resetForm() {
    setTitle("");
    setType("Nota");
    setContent("");
    setEditingId(null);
  }

  function startEdit(item: DocumentItem) {
    setEditingId(item.id);
    setTitle(item.title);
    setType(item.type);
    setContent(item.content);
    setError("");
  }

  async function saveItem() {
    if (!title.trim() || saving) return;

    const userId = getSession()?.user?.id;
    if (!userId) {
      setError("Sessão inválida.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingId) {
        const updated = await supabaseFetch(
          "campaign_documents?id=eq." + encodeURIComponent(editingId),
          {
            method: "PATCH",
            headers: { Prefer: "return=representation" },
            body: JSON.stringify({
              title: title.trim(),
              type,
              content: content.trim(),
              updated_at: new Date().toISOString(),
            }),
          },
          token
        );
        const row = (updated as DocumentItem[])[0];
        if (row) setItems((current) => current.map((item) => item.id === row.id ? row : item));
      } else {
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
      }

      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar documento.");
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(id: string) {
    if (!window.confirm("Excluir este documento?")) return;

    try {
      await supabaseFetch(
        "campaign_documents?id=eq." + encodeURIComponent(id),
        { method: "DELETE" },
        token
      );
      setItems((current) => current.filter((item) => item.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir documento.");
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
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
          className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-violet-400/50"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={saveItem}
            disabled={saving}
            className="rounded-xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-300 disabled:opacity-50"
          >
            {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Adicionar"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-white">{item.title}</h4>
                <span className="mt-2 inline-block rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-1 text-xs text-violet-200">
                  {item.type}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-300 hover:bg-white/5"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="rounded-lg border border-red-400/20 px-2 py-1 text-xs text-red-300 hover:bg-red-400/10"
                >
                  Excluir
                </button>
              </div>
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
