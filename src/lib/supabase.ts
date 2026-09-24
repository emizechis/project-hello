const url=import.meta.env.VITE_SUPABASE_URL as string|undefined;
const key=import.meta.env.VITE_SUPABASE_ANON_KEY as string|undefined;
export const supabaseConfig={url,key};
export function requireSupabase(){if(!url||!key)throw new Error("Supabase environment variables are missing.");return{url,key};}
export async function supabaseFetch(path:string,options:RequestInit={},accessToken?:string){const {url,key}=requireSupabase();const headers=new Headers(options.headers);headers.set("apikey",key);headers.set("Authorization",`Bearer ${accessToken||key}`);headers.set("Content-Type","application/json");const res=await fetch(`${url}/rest/v1/${path}`,{...options,headers});if(!res.ok)throw new Error(await res.text());return res.status===204?null:res.json();}