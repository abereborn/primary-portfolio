import type { CSSProperties } from "react";
import type { projects } from "../../data/projects";
type Fan = (typeof projects)[number]["fans"][number];
const asStyle = (raw: string) => Object.fromEntries(raw.split(";").map(item => item.trim()).filter(Boolean).map(item => { const [key,value] = item.split(":"); return [key.trim(),value.trim()]; })) as CSSProperties;
export default function FanCard({ fan }: { fan: Fan }) {
  return <span className={fan.className} style={asStyle(fan.style)}><img src={fan.src} alt="" loading="lazy" decoding="async" /></span>;
}
