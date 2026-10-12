import { Link } from "react-router-dom";
import { navigation } from "../../data/navigation";

export default function NextChapters({ page }: { page: string }) {
  const cards = navigation.filter(item => item.id !== "home" && item.id !== page);
  return <nav className="next rv" aria-label="Next chapters"><span className="next-lbl">Pick your card!</span><div className="next-row">
    {cards.map(item => <Link key={item.id} to={item.href} className={"next-card " + item.tone}>
      <span className="nc-no">{item.number}</span><span className="nc-name">{item.titleStart}<em>{item.titleEnd}</em></span>
      <span className="nc-go"><svg className="ico ico-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M9.2 7H17v7.8" /></svg></span>
    </Link>)}
  </div></nav>;
}
