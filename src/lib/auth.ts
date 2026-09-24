import {requireSupabase} from "./supabase";

export async function signIn(email:string,password:string){const {url,key}=requireSupabase();const res=await fetch(`${url}/auth/v1/token?grant_type=password`,{method:"POST",headers:{"Content-Type":"application/json",apikey:key},body:JSON.stringify({email,password})});if(!res.ok) throw new Error(await res.text());return res.json();}

export async function signUp(email:string,password:string){const {url,key}=requireSupabase();const res=await fetch(`${url}/auth/v1/signup`,{method:"POST",headers:{"Content-Type":"application/json",apikey:key},body:JSON.stringify({email,password})});if(!res.ok) throw new Error(await res.text());return res.json();}

export async function signOut(accessToken:string){const {url,key}=requireSupabase();await fetch(`${url}/auth/v1/logout`,{method:"POST",headers:{apikey:key,Authorization:`Bearer ${accessToken}`}});}