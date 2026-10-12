import { Link } from "react-router-dom";
import NextChapters from "../components/layout/NextChapters";
import DevelopmentFlow3D from "../components/tech/DevelopmentFlow3D";
import ChapterHeader from "../components/layout/ChapterHeader";

export default function Tech() {
  return (
    <section className="chapter" id="tech">
      <div className="wrap">
        <ChapterHeader chapter="Chapter 03">Tech <em>Stack</em></ChapterHeader>

        <div className="banner banner--stack tech-hero rv">
          <div className="banner-bg banner-bg--stack" aria-hidden="true">
            <img className="tech-hero__image" src="assets/media/tech-workstation.png" alt="" width="1672" height="941" decoding="async" fetchPriority="high" />
          </div>
          <div className="tech-hero__grid" aria-hidden="true" />
          <div className="banner-tl">
            <span className="banner-word disp" data-split={true}>TECH</span>
            <span className="banner-word disp outline" data-split={true}>STACK</span>
          </div>

          <div className="banner-claim">
            <p>Frontend-focused, with room to grow on <em>backend &amp; DevOps.</em></p>
            <div className="banner-figs"><span>React · TypeScript · REST APIs</span></div>
          </div>
        </div>

        <div className="lede rv">
          <p className="lede-text">
            <span className="s1">Frontend first.</span>
            Backend, database, DevOps and mobile experience alongside it, plus the areas I am actively growing into.
          </p>
          <Link className="lede-cta" to="/projects">
            <span>See it in projects</span>
            <i><svg className="ico ico-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M9.2 7H17v7.8"></path></svg></i>
          </Link>
        </div>

        <DevelopmentFlow3D />
        <NextChapters page="tech" />
      </div>
    </section>
  );
}
