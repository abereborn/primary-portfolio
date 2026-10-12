import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { navigation } from "../../data/navigation";

interface MobileMenuProps { page: string; open: boolean; onClose: () => void }

export default function MobileMenu({ page, open, onClose }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => { onClose(); }, [location.pathname, onClose]);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1081px)");
    const closeOnDesktop = () => { if (query.matches) onClose(); };
    closeOnDesktop();
    query.addEventListener("change", closeOnDesktop);
    return () => query.removeEventListener("change", closeOnDesktop);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const panel = dialogRef.current;
    const shell = panel?.parentElement;
    const toggle = shell?.querySelector<HTMLButtonElement>("#burger");
    if (!panel || !shell || !toggle) return;
    const previousOverflow = document.body.style.overflow;
    const siblings = Array.from(shell.parentElement?.children ?? [])
      .filter((node): node is HTMLElement => node instanceof HTMLElement && node !== shell);
    const previousInert = siblings.map(node => node.inert);
    siblings.forEach(node => { node.inert = true; });
    shell.style.setProperty("--menu-scrollbar", `${window.innerWidth - document.documentElement.clientWidth}px`);
    document.body.style.overflow = "hidden";

    // Keep the persistent toggle in the same focus scope as the centered menu.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab") return;
      const controls = [toggle, ...panel.querySelectorAll<HTMLAnchorElement>("a[href]")];
      const current = controls.indexOf(document.activeElement as HTMLButtonElement | HTMLAnchorElement);
      const next = (current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
      event.preventDefault();
      controls[next].focus();
    };
    toggle.focus({ preventScroll: true });
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      shell.style.removeProperty("--menu-scrollbar");
      siblings.forEach((node, i) => { node.inert = previousInert[i]; });
      if (toggle.isConnected && toggle.getClientRects().length) toggle.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  return <div ref={dialogRef} className="mobile-menu-dialog" id="sheet" data-visible={open} inert={!open} aria-hidden={!open}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="sheet glass">
      <header className="mobile-menu-heading">
        <span id="mobile-menu-title" className="mono">Navigation</span>
      </header>
      <nav aria-label="Mobile navigation">
        {navigation.filter(item => item.id !== "home").map(item => <Link key={item.id} to={item.href}
          onClick={onClose} aria-current={page === item.id ? "page" : undefined}>{item.label}<i>{item.number}</i></Link>)}
      </nav>
    </div>
  </div>;
}
