import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Environment from "./components/layout/Environment";
import Preloader from "./components/layout/Preloader";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Tech from "./pages/Tech";
import Contact from "./pages/Contact";
import { pageMeta } from "./data/pageMeta";
import { usePortfolioInteractions } from "./hooks/usePortfolioInteractions";

const routes = {
  "/": { id: "home", Page: Home },
  "/about": { id: "about", Page: About },
  "/projects": { id: "projects", Page: Projects },
  "/tech": { id: "tech", Page: Tech },
  "/contact": { id: "contact", Page: Contact },
} as const;

function PortfolioPage({ route }: { route: (typeof routes)[keyof typeof routes] }) {
  const { pathname } = useLocation();
  usePortfolioInteractions(pathname);

  useEffect(() => {
    const meta = pageMeta[route.id];
    document.title = meta.title;
    document.body.classList.toggle("sub", route.id !== "home");
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
    window.scrollTo(0, 0);
  }, [route, pathname]);

  const Page = route.Page;
  return <>
    {route.id === "home" && <Preloader />}
    <Environment />
    <Navbar page={route.id} />
    <Page />
    <Footer />
  </>;
}

export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<PortfolioPage route={routes["/"]} />} />
    <Route path="/about" element={<PortfolioPage route={routes["/about"]} />} />
    <Route path="/projects" element={<PortfolioPage route={routes["/projects"]} />} />
    <Route path="/tech" element={<PortfolioPage route={routes["/tech"]} />} />
    <Route path="/contact" element={<PortfolioPage route={routes["/contact"]} />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>;
}
