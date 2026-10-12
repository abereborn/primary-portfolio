import { site } from "../../data/site";

const methods = [
  { number: "01", kind: "Email", href: "mailto:" + site.email, value: site.email, path: "M3 5h18v14H3z M3 5l9 7 9-7" },
  { number: "02", kind: "Phone", href: "tel:" + site.phone.replaceAll("-", ""), value: site.phone, path: "M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" },
  { number: "03", kind: "Location", value: site.location, path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" },
  { number: "04", kind: "GitHub", href: site.github, value: "abereborn", aria: "GitHub, abereborn (opens in a new tab)", path: "M12 2a10 10 0 0 0-3.16 19.49c.5.1.68-.21.68-.48v-1.68c-2.78.6-3.37-1.18-3.37-1.18-.46-1.17-1.11-1.48-1.11-1.48-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.84.1-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.55 9.55 0 0 1 5 0c1.9-1.3 2.74-1.03 2.74-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" },
];
export default function ContactMethods() {
  return <>{methods.map(method => <article className="contact-method rv" key={method.number}>
    <header className="contact-method-head"><span className="f-no">{method.number}</span><span className="contact-method-kind">{method.kind}</span></header>
    {method.href ? <a className="contact-method-value" href={method.href} target={method.kind === "GitHub" ? "_blank" : undefined} rel={method.kind === "GitHub" ? "noopener noreferrer" : undefined} aria-label={method.aria}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={method.path} /></svg><span>{method.value}</span>{method.kind !== "Location" && <b aria-hidden="true">↗</b>}
    </a> : <div className="contact-method-value is-static"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={method.path} /></svg><span>{method.value}</span></div>}
  </article>)}</>;
}
