import type { projects } from "../../data/projects";
type ScreenshotData = (typeof projects)[number]["screenshots"][number];
export default function Screenshot({ shot }: { shot: ScreenshotData }) {
  return <figure className="shot"><button type="button" data-full={shot.full} data-alt={shot.alt} data-project={shot.project} aria-label={shot.label}><img src={shot.src} srcSet={shot.srcset} sizes={shot.sizes} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" /></button></figure>;
}
