import NextChapters from "../components/layout/NextChapters";
import ToolRating from "../components/about/ToolRating";
import { tools } from "../data/tools";
import CertificatesWheel from "../components/ui/CertificatesWheel";
import { certificates } from "../data/certificates";
import { site } from "../data/site";
import ChapterHeader from "../components/layout/ChapterHeader";
import Lightbox from "../components/common/Lightbox";
import type { CSSProperties } from "react";
import React from "react";

// Adapt the existing source once; no second certificate collection is stored.
const certificateItems = certificates.map(({ title, image, link }) => ({ title, image, href: link }));

export default function About() {
  return (
    <>
      <section className="chapter" id="about">
        <div className="wrap">
          <ChapterHeader chapter="Chapter 01">
            About <em>Me</em>
          </ChapterHeader>
          <div className="bio rv">
            <div className="sheen"></div>
            <div className="edge"></div>
            <figure className="portrait">
              <div className="portrait-frame">
                <span className="mono-ab disp" aria-hidden="true">
                  {"20"}
                </span>
                <picture>
                  <source srcSet="assets/personal/portrait.webp" type="image/webp" />
                  <img src="assets/personal/portrait.png" alt={site.name} width="1289" height="1221" decoding="async" loading="lazy" />
                </picture>
                <figcaption className="portrait-cap">{"Year Old"}</figcaption>
              </div>
            </figure>
            <div className="say">
              <h3 className="hello">
                <span className="wm-box">
                  <span className="wordmark disp" data-split={true}>
                    HELLO!
                  </span>
                </span>
              </h3>
              <p className="say-text">
                <span className="s1">
                  {"I'm a "}
                  <b>{site.role}</b>
                  {" who turns ideas into modern, functional, and engaging digital experiences."}
                </span>
                I work across
                <em>{"frontend"}</em>
                {", "}
                <em>{"backend"}</em>
                {", and "}
                <em>{"API integration"}</em>
                {
                  " to build responsive interfaces and reliable applications. From designing intuitive user experiences to working with databases, DevOps, and mobile technologies, I enjoy bringing ideas from concept to a polished, working product."
                }
              </p>
              <div className="say-links">
                <a href={"mailto:" + site.email}>{site.email}</a>
                <a href="tel:+6287736240463">{site.phone}</a>
                <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub, abereborn (opens in a new tab)">
                  {"GitHub"}
                </a>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile (opens in a new tab)">
                  {"LinkedIn"}
                </a>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram, @abereborn_ (opens in a new tab)">
                  {"Instagram"}
                </a>
                <a className="cv" href={site.cv} download={true}>
                  {"Download CV"}
                  <span className="ico ico-dl" aria-hidden="true">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M12 3.2a1 1 0 0 1 1 1v8.9l2.9-2.9a1 1 0 1 1 1.4 1.42l-4.6 4.6a1 1 0 0 1-1.4 0l-4.6-4.6A1 1 0 0 1 8.1 10.2l2.9 2.9V4.2a1 1 0 0 1 1-1zM5 18.4h14a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2z"></path>
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="stats rv">
            <div>
              <b>{"5"}</b>
              <span>{"Projects showcased"}</span>
            </div>
            <div>
              <b>{"D3"}</b>
              <span>{"Information Technology"}</span>
            </div>
            <div>
              <b>{"2024"}</b>
              <span>{"Started at CCIT FTUI"}</span>
            </div>
            <div>
              <b>{"2"}</b>
              <span>{"Working languages"}</span>
            </div>
          </div>
          <div className="facts">
            <div className="facts-col facts-col--main">
              <article className="fact fact--exp rv">
                <header>
                  <span className="f-no">{"01"}</span>
                  <h4>{"Experience"}</h4>
                </header>
                <ol className="line line--track">
                  <li>
                    <span className="yr">{"2026"}</span>
                    <b>{"PT. Cantika Dian Semesta"}</b>
                    <span className="role">{"Full-Stack Developer Intern"}</span>
                    <ul className="pts">
                      <li>{"Developed a company profile website and Content Management System from the ground up for a company that previously had no official web presence."}</li>
                      <li>{"Designed and implemented responsive interfaces for the company's profile, services, and information."}</li>
                      <li>{"Built and integrated the CMS to allow efficient content management and updates."}</li>
                      <li>{"Worked through the complete development lifecycle, from planning and development to testing and deployment."}</li>
                      <li>{"Gained hands-on experience delivering a real-world project based on actual business requirements."}</li>
                    </ul>
                    <a className="f-link" href="https://cantikadiansemesta.com" target="_blank" rel="noopener noreferrer">
                      cantikadiansemesta.com
                      <svg className="ico ico-arrow" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 17 17 7M9.2 7H17v7.8"></path>
                      </svg>
                    </a>
                  </li>
                  <li>
                    <span className="yr">{"2024 — 2025"}</span>
                    <b>{"Bizantum Tech Insight"}</b>
                    <span className="role">{"Web Content Administrator"}</span>
                    <ul className="pts">
                      <li>{"Managed and integrated website content within the existing web framework and page structure."}</li>
                      <li>{"Organized and positioned content to maintain consistent layouts and a user-friendly interface."}</li>
                      <li>{"Worked with frontend structures such as HTML and page layout to support website development and content presentation."}</li>
                      <li>{"Ensured website content was properly implemented and visually consistent across pages."}</li>
                      <li>{"Collaborated with the development team while maintaining attention to detail and quality."}</li>
                    </ul>
                    <a className="f-link" href="https://bizantum.tech" target="_blank" rel="noopener noreferrer">
                      bizantum.tech
                      <svg className="ico ico-arrow" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 17 17 7M9.2 7H17v7.8"></path>
                      </svg>
                    </a>
                  </li>
                </ol>
              </article>
            </div>
            <div className="facts-col facts-col--middle">
              <article className="fact fact--tools rv">
                <header>
                  <span className="f-no">{"02"}</span>
                  <h4>{"Tools"}</h4>
                  <span className="f-yr">{"2020 — 2026"}</span>
                </header>
                <ul className="tools-list">
                  {tools.map((tool) => (
                    <ToolRating key={tool.index} tool={tool} />
                  ))}
                </ul>
              </article>
              <article className="fact fact--lng rv">
                <header>
                  <span className="f-no">{"04"}</span>
                  <h4>{"Language"}</h4>
                </header>
                <ul className="langs">
                  <li>
                    <span className="lg-top">
                      <b>{"Indonesian"}</b>
                      <i>{"Native"}</i>
                    </span>
                    <span className="lang-bar">
                      <i style={{ "--level": "100%" } as CSSProperties}></i>
                    </span>
                  </li>
                  <li>
                    <span className="lg-top">
                      <b>{"English"}</b>
                      <i>{"Professional Working Proficiency"}</i>
                    </span>
                    <span className="lang-bar">
                      <i style={{ "--level": "75%" } as CSSProperties}></i>
                    </span>
                  </li>
                </ul>
              </article>
            </div>
            <div className="facts-col facts-col--side">
              <article className="fact fact--edu rv">
                <header>
                  <span className="f-no">{"03"}</span>
                  <h4>{"Education"}</h4>
                </header>
                <ol className="line">
                  <li>
                    <span className="yr">{"Sep 2024 — Nov 2026"}</span>
                    <b>{"CCIT FTUI, Universitas Indonesia"}</b>
                    <span className="pill">
                      {"Status "}
                      <b>{"In progress"}</b>
                    </span>
                  </li>
                </ol>
              </article>
              <article className="fact fact--cap rv">
                <header>
                  <span className="f-no">{"05"}</span>
                  <h4>{"Capabilities"}</h4>
                </header>
                <ul className="dots-list">
                  <li>{"Frontend Development"}</li>
                  <li>{"Full-Stack Development"}</li>
                  <li>{"REST API Integration"}</li>
                  <li>{"Responsive Web Development"}</li>
                  <li>{"Database Integration"}</li>
                  <li>{"UI Implementation"}</li>
                  <li>{"System Development"}</li>
                  <li>{"Deployment & CI/CD"}</li>
                </ul>
              </article>
            </div>
          </div>
          <section className="certificate-section rv" aria-labelledby="certificates-title">
            <header className="certificate-section-head">
              <span className="f-no">{"06"}</span>
              <div>
                <span className="certificate-kicker mono">{"Learning record"}</span>
                <h3 id="certificates-title">{"Certificates"}</h3>
              </div>
              <span className="certificate-count mono">{String(certificates.length).padStart(2, "0") + " verified records"}</span>
            </header>
            <p className="certificate-intro">Selected course certificates that document my learning across web development, programming, frontend development and SQL.</p>
            <CertificatesWheel items={certificateItems} label="Certificates" action="Verify" />
          </section>
          <NextChapters page="about" />
        </div>
      </section>
      <Lightbox />
    </>
  );
}
