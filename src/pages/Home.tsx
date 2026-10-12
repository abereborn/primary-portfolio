import HomeCard from "../components/home/HomeCard";
import { homeCards } from "../data/homeCards";
import { site } from "../data/site";
import type { CSSProperties } from "react";
import React from "react";

export default function Home() {
  return (
    <>
    <main className="stage" id="home">
      <div className="wrap">
        <section className="slab">
          <div className="sheen"></div>
          <div className="edge"></div>
          <div className="slab-rivets">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </div>
          <header className="head">
            <div>
              <div className="tagline rise d1">
                <i></i>
                <span>
                  {"Portfolio"}
                </span>
                <b>
                  {"2026"}
                </b>
                <i></i>
                <span>
                  {site.role}
                </span>
              </div>
              <h1 className="title" id="title">
                <span className="sr">
                  {site.name + " — "}
                </span>
                <span className="wm-box">
                  <span className="wordmark disp" data-split={true}>
                    {"Portofolio"}
                  </span>
                </span>
                <span className="badge mono">
                  {"2026"}
                </span>
              </h1>
              <div className="ident rise d3">
                <p className="who">
                  <span className="who-thin">
                    {"Afan"}
                  </span>
                  <span className="who-fat">
                    {"Baihaqi"}
                  </span>
                </p>
                <ol className="roles">
                  <li>
                    <i>
                      {"01"}
                    </i>
                    {site.role}
                  </li>
                  <li>
                    <i>
                      {"02"}
                    </i>
                    {"Frontend-Focused"}
                  </li>
                  <li>
                    <i>
                      {"03"}
                    </i>
                    {"React · TypeScript · REST APIs"}
                  </li>
                </ol>
                <dl className="spec">
                  <div>
                    <dt>
                      {"Study"}
                    </dt>
                    <dd>
                      <b>
                        {"D3 IT"}
                      </b>
                      {", CCIT FTUI"}
                    </dd>
                  </div>
                  <div>
                    <dt>
                      {"Based"}
                    </dt>
                    <dd>
                      <b>
                        {"Tangerang"}
                      </b>
                      {", Indonesia"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </header>
          <div className="deck-head rise d4">
            <span className="pick">
              {"Pick your card! "}
              <span className="kbd">
                {"4 decks"}
              </span>
            </span>
            <span className="deck-hint mono">
              <i></i>
              <span className="hint-mouse">
                {"Hover to reveal"}
              </span>
              <span className="hint-touch">
                {"Swipe to browse"}
              </span>
            </span>
          </div>
          <div className="deck-scroll">
            <div className="deck" id="deck">{homeCards.map(card => <HomeCard key={card.index} card={card} />)}</div>
          </div>
          <div className="dots" id="dots" aria-hidden="true">
            <button type="button" className="on" aria-label="Card 1"></button>
            <button type="button" aria-label="Card 2"></button>
            <button type="button" aria-label="Card 3"></button>
            <button type="button" aria-label="Card 4"></button>
          </div>
        </section>
        <div className="strip rise d5">
          <div className="strip-in">
            <div className="ticker" aria-label="Technologies">
              <div className="ticker-track" id="track">
                <span>
                  {"HTML5"}
                </span>
                <span>
                  {"CSS3"}
                </span>
                <span>
                  {"JavaScript"}
                </span>
                <span>
                  {"TypeScript"}
                </span>
                <span>
                  {"React"}
                </span>
                <span>
                  {"Tailwind CSS"}
                </span>
                <span>
                  {"Java"}
                </span>
                <span>
                  {"Spring Boot"}
                </span>
                <span>
                  {"CodeIgniter"}
                </span>
                <span>
                  {"REST API"}
                </span>
                <span>
                  {"MySQL"}
                </span>
                <span>
                  {"PostgreSQL"}
                </span>
                <span>
                  {"Git"}
                </span>
                <span>
                  {"GitHub"}
                </span>
                <span>
                  {"Docker"}
                </span>
                <span>
                  {"GitHub Actions"}
                </span>
                <span>
                  {"CI/CD"}
                </span>
                <span>
                  {"Flutter"}
                </span>
              </div>
            </div>
            <div className="dock glass">
              <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub, abereborn (opens in a new tab)">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                </svg>
                <span>
                  {"abereborn"}
                </span>
              </a>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                </svg>
                <span>
                  {"LinkedIn"}
                </span>
              </a>
              <a href={"mailto:" + site.email} className="hi">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 8L4.3 7h15.4L12 13z"></path>
                </svg>
                <span>
                  {"Contact me!"}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="scroll-cue mono">
        <span className="rail"></span>
        {" Scroll to get in touch"}
      </div>
    </main>
    </>
  );
}
