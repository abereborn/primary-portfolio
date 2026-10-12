import { Fragment, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { homeCards } from "../../data/homeCards";

type Card = (typeof homeCards)[number];
export default function HomeCard({ card }: { card: Card }) {
  const image = <img className={card.imageClass} src={card.src} alt={card.alt} width={card.width} height={card.height} draggable="false" decoding="async" />;
  return <div className="slot" style={{ "--i": card.index } as CSSProperties}>
    <Link to={card.href} className={card.className} aria-label={card.label}>
      <div className="face"><div className="card-bg"></div><div className="card-halo"></div>
        {card.picture ? <picture><source srcSet={card.srcWebp} type="image/webp" />{image}</picture> : image}
        <div className="card-vig"></div><div className="card-rivets"><i></i><i></i></div>
        <span className="card-no">{card.number}</span>
        <h2 className="card-title">{card.titleLines.map((line, index) => <Fragment key={index}>{index > 0 && <br />}{line}</Fragment>)}</h2>
        <div className="plate"><span className="lbl">{card.caption}</span><span className="go"><svg className="ico ico-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M9.2 7H17v7.8" /></svg></span></div>
        <div className="shine"></div>
      </div>
    </Link>
  </div>;
}
