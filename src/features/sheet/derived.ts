export type SheetAttributes=Record<string,number>;
export function modifier(value:number){return Math.floor((value-1)/2)}
export function derived(a:SheetAttributes,nex=5){const agi=modifier(a.AGI||1);const vig=modifier(a.VIG||1);const pre=modifier(a.PRE||1);return{defense:10+agi,initiative:agi,fortitude:vig,reflexes:agi,will:pre,hpMax:10+vig+nex,peMax:2+pre+Math.floor(nex/5),sanMax:20+pre*2}}