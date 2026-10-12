import type { projects } from "../../data/projects";
import FanCard from "./FanCard";
import Screenshot from "./Screenshot";

type Project = (typeof projects)[number];
function Arrow() { return <svg className="ico ico-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M9.2 7H17v7.8" /></svg>; }
function ExternalLink({ href, aria, children, ghost = false }: { href: string; aria: string; children: string; ghost?: boolean }) {
  return <a className={ghost ? "ghost" : undefined} href={href} target="_blank" rel="noopener noreferrer" aria-label={aria + " (opens in a new tab)"}>{children}<Arrow /></a>;
}
function Details({ project }: { project: Project }) {
  const details = project.details;
  if (details.type === "demo-only") return <div className="say-links"><ExternalLink href={details.demo.href} aria={details.demo.aria}>Live demo</ExternalLink><span className="off">Frontend only · No backend or database</span></div>;
  if (details.type === "coming-soon") return <div className="say-links"><span className="off">Live demo · Coming soon</span><ExternalLink ghost href={details.source[0].href} aria={details.source[0].aria}>Source code</ExternalLink></div>;
  if (details.type === "unavailable") return <div className="say-links"><span className="off">Requires backend to run</span><span className="off">Private repository</span></div>;
  if (details.type === "demo-private") return <div className="say-links"><ExternalLink href={details.demo.href} aria={details.demo.aria}>Live demo</ExternalLink><span className="off">Private repository</span></div>;
  if (details.type === "features") return <><span className="proj-h">Key features</span><ul className="pts">{details.features.map(feature => <li key={feature}>{feature}</li>)}</ul><div className="say-links"><ExternalLink ghost href={details.source[0].href} aria={details.source[0].aria}>Source code</ExternalLink></div></>;
  return <><div className="say-links"><ExternalLink href={details.demo.href} aria={details.demo.aria}>Live demo</ExternalLink></div><span className="proj-h">Source code</span><div className="say-links">{details.source.map(link => <ExternalLink key={link.href} ghost href={link.href} aria={link.aria}>{link.label}</ExternalLink>)}</div></>;
}
export default function ProjectDrawer({ project }: { project: Project }) {
  return <section className="group drawer rv" aria-labelledby={"g-" + project.id}>
    <button className="drawer-head" type="button" aria-expanded="true" aria-controls={"d-" + project.id}>
      <span className="fan" aria-hidden="true">{project.fans.map((fan,index) => <FanCard key={index} fan={fan} />)}</span>
      <span className="d-plate"><span className="d-side"><span className="d-no">{project.number}</span><span className="d-count">{project.countLabel}</span></span>
        <span className="d-txt"><b id={"g-" + project.id}>{project.name}</b><i>{project.category}</i></span><span className="d-icon" aria-hidden="true"><em></em><em></em></span>
      </span>
    </button>
    <div className="drawer-body" id={"d-" + project.id}>
      <div className="drawer-in"><div className="proj"><div className="proj-side">
        <span className="proj-type">{project.category}</span><p className="proj-desc">{project.description}</p><span className="proj-h">Built with</span>
        <ul className="dots-list">{project.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul><Details project={project} />
      </div><div className={project.galleryClass}>{project.screenshots.map((shot,index) => <Screenshot key={index} shot={shot} />)}</div></div></div>
    </div>
  </section>;
}
