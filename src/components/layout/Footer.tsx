import { Link } from "react-router-dom";
import { site } from "../../data/site";
import { navigation } from "../../data/navigation";
import React from "react";

type FooterIconName = "instagram" | "phone" | "email" | "github" | "download";

function FooterIcon({ name }: { name: FooterIconName }) {
  const common = {
    className: "footer-contact-icon",
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    focusable: false,
  } as const;

  switch (name) {
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="4.8" />
          <circle cx="12" cy="12" r="4.15" />
          <circle cx="17.6" cy="6.45" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16.72v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.45 19.45 0 0 1-6-6A19.8 19.8 0 0 1 1.12 4a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L7 9.55a16 16 0 0 0 7.45 7.45l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 21 16.72Z" />
        </svg>
      );
    case "email":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2.2" />
          <path d="m4.5 7 7.5 5.5L19.5 7" />
        </svg>
      );
    case "github":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.1.68-.21.68-.48v-1.68c-2.78.6-3.37-1.18-3.37-1.18-.46-1.17-1.11-1.48-1.11-1.48-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.84.1-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.55 9.55 0 0 1 5 0c1.9-1.3 2.74-1.03 2.74-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
        </svg>
      );
    case "download":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v11" />
          <path d="m7.5 10 4.5 4.5 4.5-4.5" />
          <path d="M4 20.5h16" />
        </svg>
      );
  }
}

export default function Footer() {
  const [runnerX, setRunnerX] = React.useState(0);
  const contactBarRef = React.useRef<HTMLDivElement>(null);
  const instagramRef = React.useRef<HTMLAnchorElement>(null);
  const activeLinkRef = React.useRef<HTMLAnchorElement | null>(null);
  const [runnerReady, setRunnerReady] = React.useState(false);

  const moveRunnerTo = (link: HTMLAnchorElement) => {
    const bar = contactBarRef.current;
    if (!bar) return;

    const barBounds = bar.getBoundingClientRect();
    const linkBounds = link.getBoundingClientRect();
    const center = linkBounds.left + linkBounds.width / 2 - barBounds.left;
    const progress = (center / barBounds.width) * 100;
    setRunnerX(Math.max(5, Math.min(95, progress)));
    setRunnerReady(true);
  };

  const resetRunner = () => {
    const bar = contactBarRef.current;
    const focused = bar?.contains(document.activeElement)
      ? document.activeElement as HTMLAnchorElement : null;
    activeLinkRef.current = focused?.matches("a") ? focused : null;
    const target = activeLinkRef.current ?? instagramRef.current;
    if (target) moveRunnerTo(target);
  };

  React.useLayoutEffect(() => {
    const bar = contactBarRef.current;
    if (!bar) return;
    let mounted = true;
    const measure = () => {
      if (!mounted) return;
      const target = activeLinkRef.current ?? instagramRef.current;
      if (target) moveRunnerTo(target);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    bar.querySelectorAll("a").forEach(link => observer.observe(link));
    document.fonts.ready.then(measure);
    return () => { mounted = false; observer.disconnect(); };
  }, []);

  const trackRunner = (event: React.SyntheticEvent<HTMLAnchorElement>) => {
    activeLinkRef.current = event.currentTarget;
    moveRunnerTo(event.currentTarget);
  };

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-top rv">
          <div className="foot-lead">
            <p className="foot-quote">
              People don't always reveal
              {" "}<br />
              {"who they are."}
              {" "}<br />
              <b>
                {"They reveal who you are"}
                {" "}<br />
                {"to them."}
              </b>
            </p>
            <Link className="lede-cta" to="/contact">
              <span>{"Get in touch"}</span>
              <i>
                <svg className="ico ico-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M7 17 17 7M9.2 7H17v7.8"></path>
                </svg>
              </i>
            </Link>
          </div>
          <nav className="foot-nav" aria-label="Footer">
            {navigation.map(({ id, label, href }) => (
              <Link key={id} to={href}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="foot-bottom">
          <div className="foot-cut">
            <picture>
              <img src="assets/personal/afan-footer-avatar.png" alt={`Ilustrasi ${site.name}`} width="1024" height="1536" loading="lazy" decoding="async" />
            </picture>
          </div>
          <div
            className="footer-contact-bar"
            ref={contactBarRef}
            onPointerLeave={resetRunner}
            onBlurCapture={(event) => {
              const nextTarget = event.relatedTarget;
              if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
                activeLinkRef.current = null;
                if (instagramRef.current) moveRunnerTo(instagramRef.current);
              }
            }}
          >
            <span className="footer-runner-stage" style={{ left: `${runnerX}%`, visibility: runnerReady ? "visible" : "hidden" }} aria-hidden="true">
              <picture className="footer-runner-art">
                <source
                  srcSet="assets/animations/footer-runner-still.webp"
                  type="image/webp"
                  media="(prefers-reduced-motion: reduce)"
                />
                <img
                  className="footer-runner"
                  src="assets/animations/footer-runner.webp"
                  alt=""
                  width="252"
                  height="336"
                  decoding="async"
                />
              </picture>
            </span>
            <a
              className="footer-contact-link"
              ref={instagramRef}
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              onPointerEnter={trackRunner}
              onFocus={trackRunner}
            >
              <FooterIcon name="instagram" />
              <span>Instagram</span>
            </a>
            <a
              className="footer-contact-link"
              href={`tel:${site.phone}`}
              aria-label="Phone"
              onPointerEnter={trackRunner}
              onFocus={trackRunner}
            >
              <FooterIcon name="phone" />
              <span>{site.phone}</span>
            </a>
            <a
              className="footer-contact-link"
              href={`mailto:${site.email}`}
              aria-label="Email"
              onPointerEnter={trackRunner}
              onFocus={trackRunner}
            >
              <FooterIcon name="email" />
              <span>{site.email}</span>
            </a>
            <a
              className="footer-contact-link"
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              onPointerEnter={trackRunner}
              onFocus={trackRunner}
            >
              <FooterIcon name="github" />
              <span>GitHub</span>
            </a>
            <a
              className="footer-contact-link footer-cv"
              href={site.cv}
              download={true}
              aria-label="Download CV"
              onPointerEnter={trackRunner}
              onFocus={trackRunner}
            >
              <FooterIcon name="download" />
              <span>Download CV</span>
            </a>
            <span className="contact-badge">{"contact me!"}</span>
          </div>
        </div>
        <p className="foot-copy">{`© 2026 ${site.name} · ${site.location}`}</p>
      </div>
    </footer>
  );
}
