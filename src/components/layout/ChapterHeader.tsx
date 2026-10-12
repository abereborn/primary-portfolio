import type { ReactNode } from "react";
export default function ChapterHeader({ chapter, children }: { chapter: string; children: ReactNode }) {
  return <header className="ch-head rv"><span className="ch-no">{chapter}</span><h1 className="ch-title">{children}</h1><span className="ch-rule"></span></header>;
}
