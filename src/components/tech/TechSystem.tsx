import { techStack } from "../../data/techStack";

const coreFrontend = new Set(["React", "TypeScript", "JavaScript"]);

const marks: Record<string, string> = {
  HTML5: "H5",
  CSS3: "C3",
  JavaScript: "JS",
  TypeScript: "TS",
  React: "R",
  "Tailwind CSS": "TW",
  Java: "J",
  "Spring Boot": "SB",
  CodeIgniter: "CI",
  "REST API": "API",
  MySQL: "SQL",
  PostgreSQL: "PG",
  Git: "GIT",
  GitHub: "GH",
  Docker: "DK",
  "GitHub Actions": "ACT",
  "CI/CD": "CI",
  Flutter: "FL",
  "UI/UX": "UX",
  "Responsive Web Design": "RWD",
  "Team Collaboration": "TEAM",
  "Linux Server Management": "LNX",
  "Server Deployment": "DEP",
  "Backend & DevOps Practices": "OPS"
};

const laneLabels = [
  { label: "01 / BUILD", detail: "Interfaces & experience" },
  { label: "02 / SERVICES", detail: "APIs & application logic" },
  { label: "03 / INFRA", detail: "Data, tooling & growth" }
];

export default function TechSystem() {
  return (
    <section className="tech-system rv" aria-label="Tech Stack system">
      <div className="tech-system__canvas">
        <div className="tech-system__chrome" aria-hidden="true">
          <span>STACK ARCHITECTURE</span>
          <div className="tech-system__status"><i /> SYSTEM ONLINE</div>
        </div>

        <div className="tech-system__topline" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="tech-system__root" aria-hidden="true">
          <span className="tech-system__root-index">STACK / 03</span>
          <span className="tech-system__root-label disp">TECH STACK</span>
          <span className="tech-system__root-orbit" />
          <span className="tech-system__root-pin" />
        </div>

        <div className="tech-system__lanes" aria-hidden="true">
          {laneLabels.map((lane) => (
            <span key={lane.label} className="tech-system__lane">
              <b>{lane.label}</b>
              <small>{lane.detail}</small>
            </span>
          ))}
        </div>

        <svg className="tech-system__wiring" viewBox="0 0 1200 680" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="tech-wire" x1="0" x2="1">
              <stop offset="0" stopColor="rgba(255,128,71,0)" />
              <stop offset="0.5" stopColor="rgba(255,128,71,.78)" />
              <stop offset="1" stopColor="rgba(255,128,71,0)" />
            </linearGradient>
          </defs>
          <g className="tech-system__wiring-base">
            <path d="M600 82V130" />
            <path d="M200 130H1000" />
            <path d="M200 130V182" />
            <path d="M600 130V182" />
            <path d="M1000 130V182" />
            <path d="M200 354V407" />
            <path d="M600 354V407" />
            <path d="M1000 354V407" />
            <path d="M200 407H1000" />
            <path d="M200 407V460" />
            <path d="M600 407V460" />
            <path d="M1000 407V460" />
          </g>
          <g className="tech-system__wiring-live">
            <path d="M600 82V130" />
            <path d="M200 130H1000" />
            <path d="M200 130V182" />
            <path d="M600 130V182" />
            <path d="M1000 130V182" />
            <path d="M200 354V407" />
            <path d="M600 354V407" />
            <path d="M1000 354V407" />
            <path d="M200 407H1000" />
            <path d="M200 407V460" />
            <path d="M600 407V460" />
            <path d="M1000 407V460" />
          </g>
          <g className="tech-system__wiring-glow">
            <path d="M600 82V130" />
            <path d="M200 130H1000" />
            <path d="M600 130V182" />
            <path d="M600 354V407" />
            <path d="M200 407H1000" />
          </g>
          <g className="tech-system__junctions">
            {[200, 600, 1000].flatMap((cx) => [130, 407].map((cy) => [cx, cy])).map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={cx === 600 ? 4 : 3} />
            ))}
          </g>
        </svg>

        <div className="tech-system__categories">
          {techStack.map((category, categoryIndex) => (
            <article
              className={`tech-system__category tech-system__category--${category.number}`}
              key={category.number}
            >
              <div className="tech-system__category-meta">
                <span>{category.number}</span>
                <span>{categoryIndex < 3 ? "CORE LAYER" : categoryIndex === 5 ? "GROWTH LAYER" : "SYSTEM LAYER"}</span>
              </div>

              <header className="tech-system__category-head">
                <h3>{category.title}</h3>
                <span className="tech-system__port" aria-hidden="true" />
              </header>

              <ul className="tech-system__nodes">
                {category.items.map((item) => {
                  const isCore = categoryIndex === 0 && coreFrontend.has(item);
                  return (
                    <li className={isCore ? "tech-system__node is-primary" : "tech-system__node"} key={item}>
                      <span className="tech-system__node-mark" aria-hidden="true">{marks[item] ?? "•"}</span>
                      <span className="tech-system__node-copy">
                        <b>{item}</b>
                        <small>{isCore ? "CORE" : "STACK"}</small>
                      </span>
                      <span className="tech-system__node-signal" aria-hidden="true" />
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>

        <div className="tech-system__footerline">
          <span>FRONTEND FIRST</span>
          <span>BACKEND &amp; DEVOPS EXPANDING</span>
          <span>06 MODULES / 24 TECHNOLOGIES</span>
        </div>
      </div>
    </section>
  );
}
