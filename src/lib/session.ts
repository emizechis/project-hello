export type NexusSession={access_token:string;refresh_token?:string;user?:{id:string;email?:string}};
const KEY="nexus_session";
export function getSession():NexusSession|null{try{const raw=localStorage.getItem(KEY);return raw?JSON.parse(raw):null}catch{return null}}
export function setSession(session:NexusSession){localStorage.setItem(KEY,JSON.stringify(session))}
export function clearSession(){localStorage.removeItem(KEY)}
export function isAuthenticated(){return !!getSession()?.access_token}