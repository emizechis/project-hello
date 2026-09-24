import {supabaseFetch } from "@/lib/supabase";
import {getSession} from "@/lib/session";
export type Campaign={id:string;owner_id:string;name:string;description?:string;cover_url?:string;invite_code:string;created_at:string;updated_at:string};
const token=()=>getSession()?.access_token;
export function listCampaigns(){return supabaseFetch("campaigns?select=*&order=updated_at.desc",{},token()) as Promise<Campaign[]>}
export function createCampaign(name:string,description:string){const owner_id=getSession()?.user?.id;if(!owner_id)throw new Error("Sessão inválida.");return supabaseFetch("campaigns",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify({name,description,owner_id})},token()) as Promise<Campaign[]>}
export function deleteCampaign(id:string){return supabaseFetch("campaigns?id=eq."+encodeURIComponent(id),{method:"DELETE"},token())}
export function joinCampaign(invite_code:string){const user_id=getSession()?.user?.id;if(!user_id)throw new Error("Sessão inválida.");return supabaseFetch("campaigns?invite_code=eq."+encodeURIComponent(invite_code)+"&select=id",{},token()).then(async(c:any[])=>{if(!c[0])throw new Error("Convite inválido.");return supabaseFetch("campaign_members",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify({campaign_id:c[0].id,user_id})},token())})}