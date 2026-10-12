import NextChapters from "../components/layout/NextChapters";
import ProjectDrawer from "../components/projects/ProjectDrawer";
import { projects } from "../data/projects";
import { site } from "../data/site";
import ChapterHeader from "../components/layout/ChapterHeader";
import Lightbox from "../components/common/Lightbox";
import type { CSSProperties } from "react";
import React from "react";

export default function Projects() {
  return (
    <>
      <section className="chapter" id="projects">
        <div className="wrap">
          <ChapterHeader chapter="Chapter 02">
            Featured <em>Projects</em>
          </ChapterHeader>
          <div className="banner rv">
            <picture className="banner-bg">
              <source media="(max-width: 767px)" srcSet="assets/media/bg-abe.webp" type="image/webp" />
              <source media="(max-width: 767px)" srcSet="assets/media/bg-abe.png" />
              <source srcSet="assets/media/bg.webp" type="image/webp" />
              <img src="assets/media/bg.png" alt={site.name} width="1366" height="623" decoding="async" />
            </picture>
            <span className="banner-word disp" data-split={true}>
              PROJECTS
            </span>
            <picture className="banner-cut">
              <source srcSet="assets/media/abe-cut.webp" type="image/webp" />
              <img src="assets/media/abe-cut.png" alt={site.name} width="371" height="510" decoding="async" />
            </picture>
            <div className="banner-claim">
              <p>
                {"Let's "}
                <em>{"realize"}</em>
                {" your ideas."}
              </p>
              <div className="banner-figs">
                <span>
                  <b>{"10+"}</b>
                  {" projects"}
                </span>
                <span>
                  <b>{"5+"}</b>
                  {" years of experience"}
                </span>
              </div>
            </div>
            <div className="rail" id="promptRail">
              <span className="rail-lbl">{"Tools"}</span>
              <ul className="rail-list">
                <li>
                  <img src="assets/tools/react-js-color.svg" alt="React" loading="lazy" />
                  <i>{"Frontend"}</i>
                </li>
                <li>
                  <img src="assets/tools/spring-boot-color.svg" alt="Spring Boot" loading="lazy" />
                  <i>{"Backend"}</i>
                </li>
                <li>
                  <img src="assets/tools/chatgpt-color.svg" alt="ChatGPT" loading="lazy" />
                  <i>{"AI Assistant"}</i>
                </li>
                <li>
                  <img src="assets/tools/postgresql-color.svg" alt="PostgreSQL" loading="lazy" />
                  <i>{"Database"}</i>
                </li>
              </ul>
            </div>
          </div>
          <div className="lede rv">
            <p className="lede-text">
              <span className="s1">{"Selected work across web, full-stack and mobile."}</span>
              Web platforms, management systems and a mobile app. Open a stack to see the screens, the tech behind it, and its links.
            </p>
            <a className="lede-cta" href={site.github} target="_blank" rel="noopener noreferrer" aria-label="More on GitHub, abereborn (opens in a new tab)">
              <span>{"More on GitHub"}</span>
              <i>
                <svg className="ico ico-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M7 17 17 7M9.2 7H17v7.8"></path>
                </svg>
              </i>
            </a>
          </div>
          <p className="tap-hint rv">
            <span className="tap-ico" aria-hidden="true">
              {"+"}
            </span>
            <span>
              {"Every stack is a project. "}
              <b>{"Tap one"}</b>
              {" to lay its screens out."}
            </span>
          </p>
          <div className="sect-label rv">
            <b>{"Featured"}</b>
            <span>{"Projects 01 — 05"}</span>
          </div>
          {projects
            .filter((project) => project.group === "featured")
            .map((project) => (
              <ProjectDrawer key={project.id} project={project} />
            ))}
          <div className="sect-label rv">
            <b>Additional</b> <span>Project 06</span>
          </div>
          {projects
            .filter((project) => project.group === "additional")
            .map((project) => (
              <ProjectDrawer key={project.id} project={project} />
            ))}
          <NextChapters page="projects" />
        </div>
      </section>
      <Lightbox />
    </>
  );
}
