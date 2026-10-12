import type { certificates } from "../../data/certificates";
import { site } from "../../data/site";

type Certificate = (typeof certificates)[number];
export default function CertificateCard({ certificate }: { certificate: Certificate }) {
  const alt = site.name + " — " + certificate.title + " certificate from " + certificate.issuer;
  return <article className="certificate-card rv">
    <div className="shot certificate-shot">
      <button type="button" data-full={certificate.image} data-alt={alt} data-project={certificate.title} aria-label={"Enlarge " + certificate.title + " certificate"}>
        <img src={certificate.image} alt={alt} width="1754" height="1238" loading="lazy" decoding="async" />
      </button>
    </div>
    <div className="certificate-meta">
      <div><span className="certificate-no mono">{certificate.number}</span><h5>{certificate.title}</h5><span>{certificate.issuer}</span></div>
      <a className="certificate-link" href={certificate.link} target="_blank" rel="noopener noreferrer" aria-label={"Verify " + certificate.title + " certificate on SoloLearn (opens in a new tab)"}>
        <span>Verify</span><svg className="ico ico-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M9.2 7H17v7.8" /></svg>
      </a>
    </div>
  </article>;
}
