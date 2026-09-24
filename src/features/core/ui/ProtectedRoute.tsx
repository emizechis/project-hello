import type {PropsWithChildren} from "react";
import {useEffect} from "react";
import {useNavigate} from "@tanstack/react-router";
import {isAuthenticated} from "@/lib/session";
export function ProtectedRoute({children}:{children:PropsWithChildren["children"]}){const nav=useNavigate();useEffect(()=>{if(!isAuthenticated())nav({to:"/login"})},[nav]);if(!isAuthenticated())return null;return children}