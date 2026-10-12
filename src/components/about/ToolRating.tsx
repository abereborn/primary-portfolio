import type { CSSProperties } from "react";
import type { tools } from "../../data/tools";
type Tool = (typeof tools)[number];
export default function ToolRating({ tool }: { tool: Tool }) {
  return <li style={{ "--n": tool.index } as CSSProperties}>
    <img className="tool-icon" src={tool.src} alt={tool.alt} loading="lazy" />
    <div className="tool-content"><div className="tool-top"><span className="tool-name">{tool.name}</span><span className="tool-score"><b>{tool.score}</b>/10</span></div><span className="tool-bar"><i style={{ "--level": tool.level } as CSSProperties}></i></span></div>
  </li>;
}
