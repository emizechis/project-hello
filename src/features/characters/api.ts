import { supabaseFetch } from "@/lib/supabase";
import type { CharacterInput } from "./data";
import { getSession } from "@/lib/session";

export type Character = {
  id: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
} & CharacterInput & {
  skills?: unknown[];
  inventory?: unknown[];
  weapons?: unknown[];
  conditions?: string[];
};

const token = () => getSession()?.access_token;

export function listCharacters() {
  return supabaseFetch("characters?select=*&order=updated_at.desc", {}, token()) as Promise<Character[]>;
}

export function createCharacter(input: CharacterInput) {
  const owner_id = getSession()?.user?.id;
  if (!owner_id) throw new Error("Sessão inválida.");
  return supabaseFetch(
    "characters",
    {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ ...input, owner_id }),
    },
    token()
  ) as Promise<Character[]>;
}

export function updateCharacter(id: string, input: Partial<CharacterInput>) {
  return supabaseFetch(
    "characters?id=eq." + encodeURIComponent(id),
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ ...input, updated_at: new Date().toISOString() }),
    },
    token()
  ) as Promise<Character[]>;
}

export function deleteCharacter(id: string) {
  return supabaseFetch("characters?id=eq." + encodeURIComponent(id), { method: "DELETE" }, token());
}

export async function duplicateCharacter(character: Character) {
  const { id, owner_id, created_at, updated_at, ...copy } = character;
  return createCharacter({ ...copy, name: character.name + " (Cópia)" });
}
