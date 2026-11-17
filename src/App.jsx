import { Experience } from "./components/Experience";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { SiteHeader } from "./components/SiteHeader";

function App() {
    return (
        <div className="site-shell">
            <SiteHeader />
            <main>
                <Hero />
                <Experience />
                <Projects />
            </main>
            <footer className="site-footer">
                <span>Aaron Yang / 2026</span>
                <span>Built with curiosity</span>
            </footer>
        </div>
    );
}

export default App;
