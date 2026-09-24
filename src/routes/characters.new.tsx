import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GlassCard } from "@/features/core/ui/GlassCard";
import { CharacterForm } from "@/features/characters/CharacterForm";
import { createCharacter } from "@/features/characters/api";

export const Route = createFileRoute("/characters/new")({
  component: NewCharacter,
});

function NewCharacter() {
  const nav = useNavigate();

  return (
    <main className="min-h-screen bg-[#070b14] px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-4xl">
        <button onClick={() => nav({ to: "/characters" })} className="text-sm text-slate-500 hover:text-white">
          ← Personagens
        </button>
        <p className="mt-6 text-xs uppercase tracking-[.3em] text-sky-300">NEXUS / CRIAÇÃO</p>
        <h1 className="mt-2 text-4xl font-bold">Nova ficha</h1>
        <p className="mt-2 text-slate-500">Monte seu personagem em etapas e revise tudo antes de salvar.</p>

        <GlassCard className="mt-8 p-6 md:p-8">
          <CharacterForm
            submitLabel="Criar ficha"
            onSubmit={async (data) => {
              const created = await createCharacter(data);
              const id = created[0]?.id;
              if (id) nav({ to: "/characters/$id", params: { id } });
              else nav({ to: "/characters" });
            }}
          />
        </GlassCard>
      </div>
    </main>
  );
}
