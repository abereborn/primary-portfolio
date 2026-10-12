import NextChapters from "../components/layout/NextChapters";
import { site } from "../data/site";
import ChapterHeader from "../components/layout/ChapterHeader";
import React from "react";

function handleContactSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get("name") ?? "");
  const email = String(form.get("email") ?? "");
  const subject = String(form.get("subject") ?? "");
  const message = String(form.get("message") ?? "");
  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function Contact() {
  return (
    <>
      <section className="chapter contact-page" id="contact">
        <div className="wrap">
          <ChapterHeader chapter="Chapter 04">
            Con<em>tact</em>
          </ChapterHeader>
          <div className="contact-stack">
            <section className="contact-hero-card rv" aria-labelledby="contact-title">
              <figure className="contact-hero-media" aria-hidden="true">
                <img
                  src="assets/contact/contact-image.webp"
                  alt=""
                  width="1672"
                  height="941"
                  decoding="async"
                  fetchPriority="high"
                />
              </figure>
              <div className="contact-hero-shade" aria-hidden="true"></div>

              <div className="contact-hero-title">
                <h2 id="contact-title" className="contact-title">
                  <span className="contact-title-line disp" data-split={true}>
                    Connect
                  </span>
                  <span className="contact-title-line disp outline" data-split={true}>
                    With me
                  </span>
                </h2>
              </div>

              <div className="contact-hero-copy">
                <span className="contact-hero-copy-lead">
                  Got ideas? We've got
                  <br />
                  <strong>the skills. Let's team up.</strong>
                </span>
                <p>Tell us more about yourself and what you're got in mind.</p>
              </div>

              <div className="contact-hero-rail">
                <span className="contact-kicker">
                  <span className="led"></span>
                  Open For Work
                </span>
                <span className="contact-rail-location">{site.location}</span>
                <a href="#contact-info" aria-label="Explore contact details">
                  Get in touch
                  <svg className="ico ico-arrow" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 17 17 7M9.2 7H17v7.8"></path>
                  </svg>
                </a>
              </div>
            </section>
            <section className="contact-composition rv" id="contact-info" aria-label="Contact Afan Baihaqi">
              <div className="contact-editorial">
                <img className="contact-portrait" src="assets/contact/me-contact.png" alt="" width="1024" height="1536" loading="lazy" decoding="async" />
                <div className="contact-editorial-copy">
                  <span className="contact-eyebrow mono">{"Open for opportunities"}</span>
                  <h2 id="contact-feature-title" className="contact-editorial-title">
                    {"Have a project in mind?"}
                    <br />
                    <span>{"Let's talk about it."}</span>
                  </h2>
                  <p>{"Have a project in mind, a collaboration to discuss, or an opportunity worth talking about? Reach out through any channel below."}</p>
                  <p className="contact-availability">{"I'm currently open for freelance, internship, or full-time opportunities."}</p>
                  <a className="contact-cv-link" href={site.cv} download={true}>
                    {"Download CV "}
                    <svg className="ico ico-arrow" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 3v12m-5-5 5 5 5-5M5 19h14"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div className="contact-form-panel">
                <header className="contact-form-head">
                  <span className="contact-form-index mono">{"SEND A NOTE"}</span>
                  <span className="contact-form-status"><i aria-hidden="true"></i>{"Available for projects"}</span>
                </header>
                <h3 className="contact-form-title">{"Send a message"}</h3>
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <div className="contact-form-row">
                    <label className="contact-field">
                      <span>{"Name"}</span>
                      <input name="name" type="text" autoComplete="name" placeholder="Your name" required />
                    </label>
                    <label className="contact-field">
                      <span>{"Email"}</span>
                      <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
                    </label>
                  </div>
                  <label className="contact-field">
                    <span>{"Subject"}</span>
                    <input name="subject" type="text" placeholder="What would you like to discuss?" required />
                  </label>
                  <label className="contact-field">
                    <span>{"Message"}</span>
                    <textarea name="message" rows={5} placeholder="Tell me a little about your project..." required></textarea>
                  </label>
                  <button className="contact-submit" type="submit">
                    <span>{"Send Message"}</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
                  </button>
                </form>
                <nav className="contact-quick-links" aria-label="Other contact channels">
                  <a href={`mailto:${site.email}`}>{"Email"}</a>
                  <a href={`tel:${site.phone.replaceAll("-", "")}`}>{"Phone"}</a>
                  <a href={site.linkedin} target="_blank" rel="noopener noreferrer">{"LinkedIn"}</a>
                  <a href={site.instagram} target="_blank" rel="noopener noreferrer">{"Instagram"}</a>
                  <a href={site.github} target="_blank" rel="noopener noreferrer">{"GitHub"}</a>
                </nav>
              </div>
            </section>
          </div>
          <NextChapters page="contact" />
        </div>
      </section>
    </>
  );
}
