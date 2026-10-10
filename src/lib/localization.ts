export type Locale="fa"|"en";
export function getClientLocale():Locale{
  if(typeof window==="undefined")return "fa";
  try {
    return localStorage.getItem("locale")==="en"?"en":"fa";
  } catch {
    return "fa";
  }
}
export function textOf(value?:{fa?:string;en?:string}|null,locale:Locale="fa"){return value?.[locale]||value?.fa||value?.en||""}