export type Weapon={id:string;name:string;category:string;attack:number;damage:string;critical:string;extra:string};
export const WEAPONS:Weapon[]=[
{id:"pistol",name:"Pistola",category:"Arma de fogo",attack:0,damage:"1d10",critical:"19/x2",extra:"Leve"},
{id:"rifle",name:"Rifle",category:"Arma de fogo",attack:0,damage:"2d10",critical:"19/x3",extra:"Duas mãos"},
{id:"smg",name:"Submetralhadora",category:"Arma de fogo",attack:0,damage:"2d6",critical:"19/x3",extra:"Rajada"},
{id:"shotgun",name:"Escopeta",category:"Arma de fogo",attack:0,damage:"2d12",critical:"20/x2",extra:"Curto alcance"},
{id:"knife",name:"Faca",category:"Corpo a corpo",attack:0,damage:"1d4",critical:"19/x2",extra:"Leve"}
];