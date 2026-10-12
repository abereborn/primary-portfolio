import { useCallback, useState } from "react";
import MobileMenu from "./MobileMenu";
import { MenuToggleIcon } from "../ui/menu-toggle-icon";
import { Link } from "react-router-dom";
import { navigation } from "../../data/navigation";
import { site } from "../../data/site";

export default function Navbar({ page }: { page: string }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return <div className="navigation-shell" role={open ? "dialog" : undefined} aria-modal={open ? true : undefined} aria-label={open ? "Mobile navigation" : undefined}><nav className="nav" aria-label="Main">
    <Link to="/" className="mark" inert={open}><span className="mark-glyph" aria-hidden="true">AB</span><span className="mark-txt"><b>{site.name}</b><span className="mono">{site.role}</span></span></Link>
    <div className="nav-mid glass" inert={open}>{navigation.map(({ id, label, href }) => <Link key={id} to={href} className={"mono" + (page === id ? " on" : "")} aria-current={page === id ? "page" : undefined}>{label}</Link>)}</div>
    <div className="nav-end"><div className="status glass mono"><span className="led"></span>{site.status}</div><button className="burger glass" id="burger" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(value => !value)} aria-controls="sheet"><MenuToggleIcon open={open} aria-hidden="true" /></button></div>
  </nav><MobileMenu page={page} open={open} onClose={close} /></div>;
}
